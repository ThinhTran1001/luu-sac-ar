import sharp from 'sharp';
import * as THREE from 'three';
import { Document, NodeIO } from '@gltf-transform/core';
import { v2 as cloudinary } from 'cloudinary';

interface ProcessedTextures {
  colorTexture: {
    data: Buffer;
    width: number;
    height: number;
  };
  displacementTexture: {
    data: Buffer;
    width: number;
    height: number;
  };
  alphaTexture: {
    data: Buffer;
    width: number;
    height: number;
  };
}

const MAX_TEXTURE_SIZE = 1024;
const DISPLACEMENT_SCALE = 0.05; // Độ nổi của displacement
const RADIAL_SEGMENTS = 128; // Số segments quanh trục (độ mịn)
const HEIGHT_SEGMENTS = 128; // Số segments theo chiều cao

export class AR3DService {
  /**
   * Main entry point: Generate GLB from transparent PNG image
   */
  static async generateFromImage(imageBuffer: Buffer): Promise<{
    glbBuffer: Buffer;
    fileSize: number;
  }> {
    console.log('[AR3D] Starting generation. Image buffer size:', imageBuffer.length);

    // Step 1: Process image into multiple textures
    const textures = await this.processImageTextures(imageBuffer);
    console.log(
      '[AR3D] Textures processed:',
      textures.colorTexture.width,
      'x',
      textures.colorTexture.height,
    );

    // Step 2: Generate 3D mesh with cylindrical geometry
    const mesh = await this.generateCylindricalMesh(textures);
    console.log('[AR3D] 3D Cylindrical Mesh generated');

    // Step 3: Export to GLB
    const glbBuffer = await this.exportToGLB(mesh, textures);
    console.log('[AR3D] GLB exported. Size:', glbBuffer.length);

    return {
      glbBuffer,
      fileSize: glbBuffer.length,
    };
  }

  /**
   * Process image into 3 textures
   */
  private static async processImageTextures(imageBuffer: Buffer): Promise<ProcessedTextures> {
    // Resize and extract metadata
    const resized = await sharp(imageBuffer)
      .resize({
        width: MAX_TEXTURE_SIZE,
        height: MAX_TEXTURE_SIZE,
        fit: 'inside',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .ensureAlpha()
      .toBuffer();

    const metadata = await sharp(resized).metadata();
    const width = metadata.width!;
    const height = metadata.height!;

    // Extract raw RGBA data
    const { data: rawData } = await sharp(resized).raw().toBuffer({ resolveWithObject: true });

    // === 1. Color Texture (RGBA) ===
    const colorBuffer = await sharp(resized).png().toBuffer();

    // === 2. Displacement Texture ===
    const displacementData = Buffer.alloc(width * height);

    for (let i = 0; i < width * height; i++) {
      const r = rawData[i * 4];
      const g = rawData[i * 4 + 1];
      const b = rawData[i * 4 + 2];
      const a = rawData[i * 4 + 3];

      // Nếu pixel trong suốt thì displacement = 0
      if (a < 10) {
        displacementData[i] = 0;
      } else {
        // Dùng luminance để tạo depth (màu sáng = nổi hơn)
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        displacementData[i] = Math.floor(luminance);
      }
    }

    // Apply gaussian blur để smooth displacement
    const displacementBuffer = await sharp(displacementData, {
      raw: { width, height, channels: 1 },
    })
      .blur(1.5)
      .png()
      .toBuffer();

    // === 3. Alpha Texture ===
    const alphaData = Buffer.alloc(width * height);
    for (let i = 0; i < width * height; i++) {
      alphaData[i] = rawData[i * 4 + 3];
    }

    const alphaBuffer = await sharp(alphaData, {
      raw: { width, height, channels: 1 },
    })
      .png()
      .toBuffer();

    return {
      colorTexture: { data: colorBuffer, width, height },
      displacementTexture: { data: displacementBuffer, width, height },
      alphaTexture: { data: alphaBuffer, width, height },
    };
  }

  /**
   * ✅ Generate 3D mesh using CylinderGeometry (cylindrical vase/glass shape)
   */
  private static async generateCylindricalMesh(textures: ProcessedTextures): Promise<THREE.Mesh> {
    const { colorTexture, displacementTexture } = textures;

    // Calculate dimensions
    const cylinderHeight = 1.0; // Base height

    // ✅ Adjust radius based on aspect ratio
    // For typical vase/glass: width is ~30-40% of height
    const cylinderRadius = 0.15;
    const bottomRadiusRatio = 0.7; // Bottom slightly narrower (typical glass/vase shape)

    // ✅ Create CylinderGeometry instead of PlaneGeometry
    const geometry = new THREE.CylinderGeometry(
      cylinderRadius, // radiusTop
      cylinderRadius * bottomRadiusRatio, // radiusBottom
      cylinderHeight, // height
      RADIAL_SEGMENTS, // radialSegments (quanh trục)
      HEIGHT_SEGMENTS, // heightSegments (theo chiều cao)
      false, // openEnded (false = có nắp đáy)
      0, // thetaStart
      Math.PI * 2, // thetaLength (360°)
    );

    // === Load Color Texture (RGBA) ===
    const colorTextureData = await this.loadRawTexture(colorTexture.data, 4);
    const threeColorTexture = new THREE.DataTexture(
      colorTextureData.data,
      colorTexture.width,
      colorTexture.height,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
    );
    threeColorTexture.needsUpdate = true;
    threeColorTexture.flipY = false; // ✅ Cylinder UV mapping
    threeColorTexture.wrapS = THREE.RepeatWrapping; // ✅ Wrap quanh cylinder
    threeColorTexture.wrapT = THREE.ClampToEdgeWrapping;
    threeColorTexture.colorSpace = THREE.SRGBColorSpace;

    // === Load Displacement Texture ===
    const displacementTextureData = await this.loadRawTexture(displacementTexture.data, 1);
    const threeDisplacementTexture = new THREE.DataTexture(
      displacementTextureData.data,
      displacementTexture.width,
      displacementTexture.height,
      THREE.RedFormat,
      THREE.UnsignedByteType,
    );
    threeDisplacementTexture.needsUpdate = true;
    threeDisplacementTexture.flipY = false;
    threeDisplacementTexture.wrapS = THREE.RepeatWrapping;
    threeDisplacementTexture.wrapT = THREE.ClampToEdgeWrapping;

    // ✅ Apply displacement theo hướng RADIAL (ra ngoài/vào trong)
    await this.applyCylindricalDisplacement(geometry, threeDisplacementTexture, DISPLACEMENT_SCALE);

    // === Create Material ===
    const material = new THREE.MeshStandardMaterial({
      map: threeColorTexture,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0.0,
      alphaTest: 0.05,
    });

    const mesh = new THREE.Mesh(geometry, material);

    // ✅ Rotate to face front (cylinder mặc định hướng theo Y-axis)
    mesh.rotation.y = Math.PI;
    mesh.position.set(0, 0, 0);

    return mesh;
  }

  /**
   * ✅ Apply displacement theo hướng RADIAL cho cylinder geometry
   */
  private static async applyCylindricalDisplacement(
    geometry: THREE.BufferGeometry,
    displacementTexture: THREE.DataTexture,
    scale: number,
  ): Promise<void> {
    const positionAttr = geometry.getAttribute('position');
    const uvAttr = geometry.getAttribute('uv');

    const positions = positionAttr.array as Float32Array;
    const uvs = uvAttr.array as Float32Array;

    const width = displacementTexture.image.width;
    const height = displacementTexture.image.height;
    const data = displacementTexture.image.data;

    if (!data) {
      console.error('[AR3D] Displacement texture data is missing');
      return;
    }

    // Apply displacement theo hướng radial (perpendicular to Y-axis)
    for (let i = 0; i < positions.length / 3; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];

      const u = uvs[i * 2];
      const v = uvs[i * 2 + 1];

      // Sample displacement texture
      const texX = Math.min(Math.floor(u * width), width - 1);
      const texY = Math.min(Math.floor(v * height), height - 1);
      const pixelIndex = texY * width + texX;

      // Normalize displacement (0-1) and apply scale
      const displacement = (data[pixelIndex] / 255.0) * scale;

      // ✅ Calculate radial direction (perpendicular to Y-axis)
      // Radial direction = normalized (x, 0, z)
      const radialLength = Math.sqrt(x * x + z * z);

      if (radialLength > 0.001) {
        // Avoid division by zero
        const radialDirX = x / radialLength;
        const radialDirZ = z / radialLength;

        // Move vertex outward/inward along radial direction
        positions[i * 3] += radialDirX * displacement;
        positions[i * 3 + 2] += radialDirZ * displacement;
        // Y position remains unchanged (displacement is only radial)
      }
    }

    // Update position attribute
    positionAttr.needsUpdate = true;

    // ✅ Recompute normals after displacement
    geometry.computeVertexNormals();
  }

  /**
   * Helper: Load raw texture data from PNG buffer
   */
  private static async loadRawTexture(
    pngBuffer: Buffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    channels: number,
  ): Promise<{ data: Buffer; width: number; height: number }> {
    const { data, info } = await sharp(pngBuffer).raw().toBuffer({ resolveWithObject: true });

    return {
      data: Buffer.from(data),
      width: info.width,
      height: info.height,
    };
  }

  /**
   * Export mesh to GLB binary format
   */
  private static async exportToGLB(mesh: THREE.Mesh, textures: ProcessedTextures): Promise<Buffer> {
    const document = new Document();
    const buffer = document.createBuffer();

    // Extract geometry data
    const geometry = mesh.geometry;
    const positionAttr = geometry.getAttribute('position');
    const normalAttr = geometry.getAttribute('normal');
    const uvAttr = geometry.getAttribute('uv');
    const indexAttr = geometry.getIndex();

    // Create accessors
    const positionAccessor = document
      .createAccessor()
      .setType('VEC3')
      .setArray(new Float32Array(positionAttr.array))
      .setBuffer(buffer);

    const normalAccessor = document
      .createAccessor()
      .setType('VEC3')
      .setArray(new Float32Array(normalAttr.array))
      .setBuffer(buffer);

    const uvAccessor = document
      .createAccessor()
      .setType('VEC2')
      .setArray(new Float32Array(uvAttr.array))
      .setBuffer(buffer);

    const indexAccessor = indexAttr
      ? document.createAccessor().setArray(new Uint32Array(indexAttr.array)).setBuffer(buffer)
      : null;

    // Create primitive
    const primitive = document
      .createPrimitive()
      .setAttribute('POSITION', positionAccessor)
      .setAttribute('NORMAL', normalAccessor)
      .setAttribute('TEXCOORD_0', uvAccessor);

    if (indexAccessor) primitive.setIndices(indexAccessor);

    // Create material with texture
    const material = document.createMaterial('ProductMaterial');

    const baseColorTexture = document
      .createTexture('BaseColor')
      .setImage(textures.colorTexture.data)
      .setMimeType('image/png');

    material
      .setBaseColorTexture(baseColorTexture)
      .setRoughnessFactor(0.5)
      .setMetallicFactor(0.0)
      .setDoubleSided(true)
      .setAlphaMode('BLEND');

    primitive.setMaterial(material);

    // Create mesh and scene
    const gltfMesh = document.createMesh('ProductMesh').addPrimitive(primitive);
    const node = document.createNode('ProductNode').setMesh(gltfMesh);
    const scene = document.createScene('ProductScene').addChild(node);
    document.getRoot().setDefaultScene(scene);

    // Export to GLB
    const io = new NodeIO();
    const glbBuffer = await io.writeBinary(document);

    return Buffer.from(glbBuffer);
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
