import sharp from 'sharp';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { v2 as cloudinary } from 'cloudinary';

interface Vector2 {
  x: number;
  y: number;
}

interface ProfileExtractionResult {
  profile: Vector2[];
  width: number;
  height: number;
}

const ALPHA_THRESHOLD = 200;
const PROFILE_STEP = 2;
const SMOOTHING_WINDOW = 5;
const LATHE_SEGMENTS = 64;

export class AR3DService {
  /**
   * Main entry point: Generate GLB from transparent PNG image
   */
  static async generateFromImage(imageBuffer: Buffer): Promise<{
    glbBuffer: Buffer;
    fileSize: number;
  }> {
    // Step 1: Preprocess image
    const processedImage = await this.preprocessImage(imageBuffer);

    // Step 2: Extract profile from image edges
    const { profile } = await this.extractProfile(processedImage);

    if (profile.length < 10) {
      throw new Error(
        'Could not extract valid profile from image. Ensure the image has a clear subject with transparent background.',
      );
    }

    // Step 3: Smooth the profile
    const smoothedProfile = this.smoothProfile(profile);

    // Step 4: Generate 3D mesh
    const mesh = this.generateMesh(smoothedProfile, processedImage);

    // Step 5: Export to GLB
    const glbBuffer = await this.exportToGLB(mesh);

    return {
      glbBuffer,
      fileSize: glbBuffer.length,
    };
  }

  /**
   * Preprocess image: resize and ensure PNG format
   */
  private static async preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
    return sharp(imageBuffer)
      .resize({
        height: 1024,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
  }

  /**
   * Extract profile using scanline edge detection
   */
  private static async extractProfile(imageBuffer: Buffer): Promise<ProfileExtractionResult> {
    const { data, info } = await sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const profile: Vector2[] = [];

    for (let y = 0; y < height; y += PROFILE_STEP) {
      let leftEdge = -1;
      let rightEdge = -1;

      // Scan from left to find left edge
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * channels;
        const alpha = data[pixelIndex + 3]; // Alpha channel

        if (alpha > ALPHA_THRESHOLD) {
          leftEdge = x;
          break;
        }
      }

      // Scan from right to find right edge
      for (let x = width - 1; x >= 0; x--) {
        const pixelIndex = (y * width + x) * channels;
        const alpha = data[pixelIndex + 3];

        if (alpha > ALPHA_THRESHOLD) {
          rightEdge = x;
          break;
        }
      }

      // If both edges found, calculate radius
      if (leftEdge !== -1 && rightEdge !== -1) {
        const radius = (rightEdge - leftEdge) / 2;

        profile.push({
          x: radius / width, // Normalize to 0-1
          y: 1.0 - y / height, // Normalize and flip Y
        });
      }
    }

    return { profile, width, height };
  }

  /**
   * Smooth profile using moving average
   */
  private static smoothProfile(profile: Vector2[]): Vector2[] {
    const smoothed: Vector2[] = [];

    for (let i = 0; i < profile.length; i++) {
      let sumX = 0;
      let sumY = 0;
      let count = 0;

      for (let j = -SMOOTHING_WINDOW; j <= SMOOTHING_WINDOW; j++) {
        const idx = i + j;
        if (idx >= 0 && idx < profile.length) {
          sumX += profile[idx].x;
          sumY += profile[idx].y;
          count++;
        }
      }

      smoothed.push({
        x: sumX / count,
        y: sumY / count,
      });
    }

    return smoothed;
  }

  /**
   * Generate 3D mesh using Three.js LatheGeometry
   */
  private static generateMesh(profile: Vector2[], textureBuffer: Buffer): THREE.Mesh {
    // Convert profile to Three.js Vector2 array
    const points = profile.map((p) => new THREE.Vector2(p.x * 0.5, p.y));

    // Create lathe geometry (revolve profile around Y-axis)
    const geometry = new THREE.LatheGeometry(points, LATHE_SEGMENTS, 0, Math.PI * 2);

    // Create material with texture
    const textureDataUrl = `data:image/png;base64,${textureBuffer.toString('base64')}`;
    const texture = new THREE.TextureLoader().load(textureDataUrl);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.4, // Ceramic surface
      metalness: 0.1, // Slight shine
      transparent: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Center the mesh
    mesh.geometry.computeBoundingBox();
    const boundingBox = mesh.geometry.boundingBox;
    if (boundingBox) {
      const centerY = (boundingBox.max.y + boundingBox.min.y) / 2;
      mesh.position.y = -centerY;
    }

    return mesh;
  }

  /**
   * Export mesh to GLB binary format
   */
  private static async exportToGLB(mesh: THREE.Mesh): Promise<Buffer> {
    const exporter = new GLTFExporter();

    return new Promise((resolve, reject) => {
      exporter.parse(
        mesh,
        (gltf) => {
          const buffer = Buffer.from(gltf as ArrayBuffer);
          resolve(buffer);
        },
        (error) => {
          reject(new Error(`GLB export failed: ${error.message}`));
        },
        {
          binary: true,
          maxTextureSize: 2048,
        },
      );
    });
  }

  /**
   * Upload GLB buffer to Cloudinary
   */
  static async uploadGLBToCloudinary(
    glbBuffer: Buffer,
    productId: string,
  ): Promise<{ url: string; publicId: string }> {
    const base64Data = glbBuffer.toString('base64');
    const dataUri = `data:application/octet-stream;base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'raw',
      folder: 'luu-sac/models',
      public_id: `product-${productId}`,
      format: 'glb',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
}
