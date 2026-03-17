import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, quantize, draco } from '@gltf-transform/functions';
// @ts-expect-error -- no type declarations for draco3dgltf
import draco3d from 'draco3dgltf';
import sharp from 'sharp';

const MAX_CLOUDINARY_RAW_BYTES = 10_485_760; // 10 MB

async function compressTextures(doc: Document, maxDim: number, jpegQuality: number) {
  for (const tex of doc.getRoot().listTextures()) {
    const img = tex.getImage();
    if (!img) continue;

    const resized = await sharp(Buffer.from(img))
      .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: jpegQuality })
      .toBuffer();

    tex.setImage(new Uint8Array(resized));
    tex.setMimeType('image/jpeg');
  }
}

/**
 * Optimize a GLB buffer to fit Cloudinary free plan 10 MB limit.
 * Pipeline: dedup → prune → quantize → Draco → optional JPEG texture compression.
 */
export async function optimizeGlb(
  glbBuffer: Buffer,
  targetBytes = MAX_CLOUDINARY_RAW_BYTES,
): Promise<Buffer> {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

  const document = await io.readBinary(new Uint8Array(glbBuffer));

  await document.transform(dedup(), prune(), quantize(), draco());

  let optimized = Buffer.from(await io.writeBinary(document));
  console.log(
    `[glb-optimizer] After dedup+prune+quantize+draco: ${(optimized.length / 1e6).toFixed(1)}MB`,
  );

  if (optimized.length > targetBytes) {
    const passes: [number, number][] = [
      [1024, 85],
      [512, 75],
      [256, 60],
    ];

    for (const [maxDim, quality] of passes) {
      await compressTextures(document, maxDim, quality);
      optimized = Buffer.from(await io.writeBinary(document));
      console.log(
        `[glb-optimizer] After textures ${maxDim}px q${quality}: ${(optimized.length / 1e6).toFixed(1)}MB`,
      );
      if (optimized.length <= targetBytes) break;
    }
  }

  console.log(
    `[glb-optimizer] ${(glbBuffer.length / 1e6).toFixed(1)}MB → ${(optimized.length / 1e6).toFixed(1)}MB ` +
      `(${Math.round((1 - optimized.length / glbBuffer.length) * 100)}% reduction)`,
  );

  if (optimized.length > targetBytes) {
    throw new Error(
      `GLB still ${(optimized.length / 1e6).toFixed(1)}MB after optimization ` +
        `(limit: ${(targetBytes / 1e6).toFixed(0)}MB). Consider upgrading Cloudinary plan.`,
    );
  }

  return optimized;
}
