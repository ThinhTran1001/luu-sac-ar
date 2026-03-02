import { v2 as cloudinary } from 'cloudinary';

const TRIPOSR_API_URL = process.env.TRIPOSR_API_URL || 'http://localhost:8000';

export class AR3DService {
  static async generateFromImage(
    imageBuffer: Buffer,
  ): Promise<{ glbBuffer: Buffer; fileSize: number }> {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/png' });
    formData.append('image', blob, 'image.png');

    const response = await fetch(`${TRIPOSR_API_URL}/generate`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message =
        (error as { detail?: string })?.detail || `3D generation failed: ${response.status}`;
      throw new Error(message);
    }

    const data = (await response.json()) as { glb_url: string };
    const glbResponse = await fetch(data.glb_url);

    if (!glbResponse.ok) {
      throw new Error(`Failed to download GLB: ${glbResponse.status}`);
    }

    const arrayBuffer = await glbResponse.arrayBuffer();
    const glbBuffer = Buffer.from(arrayBuffer);

    return { glbBuffer, fileSize: glbBuffer.byteLength };
  }

  static async uploadGLBToCloudinary(
    glbBuffer: Buffer,
    productId: string,
  ): Promise<{ url: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'luu-sac/models',
          public_id: `product-${productId}`,
          resource_type: 'raw',
          format: 'glb',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error('Cloudinary upload returned no result'));
          }
          resolve({ url: result.secure_url });
        },
      );

      uploadStream.end(glbBuffer);
    });
  }
}
