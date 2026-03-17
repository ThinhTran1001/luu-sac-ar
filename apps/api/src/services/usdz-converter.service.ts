import {
  createCanvas,
  Image as NapiImage,
} from '@napi-rs/canvas';

// Runtime export exists but TS types don't include it
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { CanvasElement } = require('@napi-rs/canvas') as { CanvasElement: unknown };
import { loadGltf } from 'node-three-gltf';
import * as THREE from 'three';
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter.js';
import fs from 'fs';

let polyfillsApplied = false;

/**
 * Set up Node.js globals so Three.js USDZExporter works outside a browser.
 * Maps @napi-rs/canvas classes to the DOM types USDZExporter expects.
 */
function setupPolyfills() {
  if (polyfillsApplied) return;
  polyfillsApplied = true;

  const g = globalThis as Record<string, unknown>;

  g.document = g.document ?? {
    createElement(tag: string) {
      if (tag === 'canvas') {
        const c = createCanvas(1, 1);
        shimToBlob(c as unknown as HTMLCanvasElement);
        return c;
      }
      return {};
    },
  };

  g.HTMLImageElement = NapiImage;
  g.HTMLCanvasElement = CanvasElement;
  g.OffscreenCanvas = g.OffscreenCanvas ?? class {};
  g.ImageBitmap = g.ImageBitmap ?? class {};
}

/**
 * @napi-rs/canvas lacks `toBlob()` — shim it via `toBuffer()`.
 */
function shimToBlob(canvas: HTMLCanvasElement) {
  const c = canvas as any;
  if (typeof c.toBlob === 'function') return;

  c.toBlob = function (
    callback: (blob: Blob) => void,
    mimeType = 'image/png',
    quality?: number,
  ) {
    try {
      const buf: Buffer =
        mimeType === 'image/jpeg'
          ? this.toBuffer('image/jpeg', Math.round((quality ?? 0.92) * 100))
          : this.toBuffer('image/png');
      callback(new Blob([new Uint8Array(buf)], { type: mimeType }));
    } catch {
      callback(new Blob([], { type: mimeType as string }));
    }
  };
}

/**
 * `node-three-gltf` loads texture images as raw { data, width, height, channels }.
 * Convert them into @napi-rs/canvas CanvasElements so USDZExporter recognises them.
 */
function patchTextureImages(scene: THREE.Group | THREE.Object3D): void {
  scene.traverse((object) => {
    if (!(object as THREE.Mesh).isMesh) return;

    const material = (object as THREE.Mesh).material as THREE.MeshStandardMaterial;
    if (!material?.isMeshStandardMaterial) return;

    const maps = [
      material.map,
      material.normalMap,
      material.roughnessMap,
      material.metalnessMap,
      material.aoMap,
      material.emissiveMap,
    ];

    for (const tex of maps) {
      if (!tex?.image || (tex.image as any)._usdzPatched) continue;
      (tex.image as any)._usdzPatched = true;

      const canvas = rawImageToCanvas(tex.image);
      if (canvas) tex.image = canvas;
    }
  });
}

function rawImageToCanvas(img: any): any | null {
  try {
    const data: Buffer | Uint8Array | undefined = img.data;
    const w: number = img.width;
    const h: number = img.height;
    const channels: number = img.channels ?? 4;

    if (!data || !w || !h) return null;

    const canvas = createCanvas(w, h);
    shimToBlob(canvas as unknown as HTMLCanvasElement);

    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(w, h);
    const dst = imageData.data;
    const src = data;

    if (channels === 4) {
      dst.set(new Uint8ClampedArray(src.buffer ?? src, src.byteOffset ?? 0, w * h * 4));
    } else if (channels === 3) {
      for (let i = 0, j = 0; i < w * h; i++, j += 3) {
        dst[i * 4] = src[j];
        dst[i * 4 + 1] = src[j + 1];
        dst[i * 4 + 2] = src[j + 2];
        dst[i * 4 + 3] = 255;
      }
    } else if (channels === 1) {
      for (let i = 0; i < w * h; i++) {
        dst[i * 4] = dst[i * 4 + 1] = dst[i * 4 + 2] = src[i];
        dst[i * 4 + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  } catch {
    return null;
  }
}

export class UsdzConverterService {
  /**
   * Convert a GLB file (from URL) to USDZ buffer.
   */
  static async fromUrl(glbUrl: string): Promise<Buffer> {
    setupPolyfills();

    const gltf = await loadGltf(glbUrl);
    patchTextureImages(gltf.scene);

    const exporter = new USDZExporter();
    const arrayBuffer = await exporter.parseAsync(gltf.scene, {
      quickLookCompatible: true,
      maxTextureSize: 1024,
    });

    return Buffer.from(arrayBuffer);
  }

  /**
   * Convert a GLB buffer to USDZ buffer.
   */
  static async fromBuffer(glbBuffer: Buffer): Promise<Buffer> {
    const tempPath = `/tmp/usdz-conv-${Date.now()}.glb`;
    fs.writeFileSync(tempPath, glbBuffer);

    try {
      return await this.fromUrl(tempPath);
    } finally {
      fs.unlinkSync(tempPath);
    }
  }
}
