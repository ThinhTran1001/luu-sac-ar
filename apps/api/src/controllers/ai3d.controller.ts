import { Request, Response } from 'express';
import { AI3DStudioService, AI3DProvider } from '../services/ai3d-studio.service';
import { UsdzConverterService } from '../services/usdz-converter.service';
import { optimizeGlb } from '../services/glb-optimizer.service';
import { ProductService } from '../services/product.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/app-error';
import { v2 as cloudinary } from 'cloudinary';

const VALID_PROVIDERS = ['trellis2', 'hunyuan-rapid', 'hunyuan-pro'] as const;
const IS_MOCK = process.env.MOCK_3D_GENERATION === 'true';

export class AI3DController {
  /**
   * POST /ai3d/generate
   * Accepts an image file, submits to 3D AI Studio, returns task_id.
   */
  static generate = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      throw new AppError('Image file is required', 400);
    }

    const provider = (req.body.provider as AI3DProvider) || 'trellis2';
    if (!VALID_PROVIDERS.includes(provider as (typeof VALID_PROVIDERS)[number])) {
      throw new AppError(`Invalid provider. Must be one of: ${VALID_PROVIDERS.join(', ')}`, 400);
    }

    const mimeType = file.mimetype || 'image/png';
    const imageBase64 = `data:${mimeType};base64,${file.buffer.toString('base64')}`;

    const result = await AI3DStudioService.submitGeneration(imageBase64, {
      provider,
      enablePbr: req.body.enablePbr !== 'false',
      resolution: req.body.resolution || '1024',
      prompt: req.body.prompt,
    });

    sendSuccess(res, result, 'Generation submitted successfully');
  });

  /**
   * GET /ai3d/status/:taskId
   * Proxies the status check to 3D AI Studio.
   */
  static getStatus = asyncHandler(async (req: Request, res: Response) => {
    const taskId = req.params.taskId as string;
    if (!taskId) {
      throw new AppError('Task ID is required', 400);
    }

    const status = await AI3DStudioService.checkStatus(taskId);
    sendSuccess(res, status, 'Status retrieved');
  });

  /**
   * POST /ai3d/upload-glb
   * Downloads GLB from a temporary presigned URL, optimizes it,
   * and re-uploads to Cloudinary so we get a permanent, CORS-friendly URL.
   */
  static uploadGlb = asyncHandler(async (req: Request, res: Response) => {
    const { glbUrl } = req.body;
    if (!glbUrl || typeof glbUrl !== 'string') {
      throw new AppError('glbUrl is required', 400);
    }

    if (IS_MOCK) {
      console.log('[MOCK 3D] Skipping real GLB upload, returning original URL');
      sendSuccess(res, { glbUrl }, 'GLB upload complete (mock)');
      return;
    }

    const glbResponse = await fetch(glbUrl);
    if (!glbResponse.ok) {
      throw new AppError(`Failed to download GLB: ${glbResponse.status}`, 502);
    }
    const rawBuffer = Buffer.from(await glbResponse.arrayBuffer());
    const glbBuffer = await optimizeGlb(rawBuffer);

    const permanentUrl = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'luu-sac/models',
          public_id: `glb-${Date.now()}`,
          resource_type: 'raw',
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('GLB upload failed'));
          resolve(result.secure_url);
        },
      );
      stream.end(glbBuffer);
    });

    sendSuccess(res, { glbUrl: permanentUrl }, 'GLB uploaded to permanent storage');
  });

  /**
   * POST /ai3d/convert-usdz
   * Downloads GLB from URL, converts to USDZ, uploads to Cloudinary.
   */
  static convertToUsdz = asyncHandler(async (req: Request, res: Response) => {
    const { glbUrl } = req.body;
    if (!glbUrl || typeof glbUrl !== 'string') {
      throw new AppError('glbUrl is required', 400);
    }

    if (IS_MOCK) {
      console.log('[MOCK 3D] Skipping real USDZ conversion, returning placeholder URL');
      const usdzUrl = glbUrl.replace('.glb', '.usdz');
      sendSuccess(res, { usdzUrl }, 'USDZ conversion complete (mock)');
      return;
    }

    const usdzBuffer = await UsdzConverterService.fromUrl(glbUrl);

    const usdzUrl = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'luu-sac/models',
          public_id: `usdz-${Date.now()}`,
          resource_type: 'raw',
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('USDZ upload failed'));
          resolve(result.secure_url);
        },
      );
      stream.end(usdzBuffer);
    });

    sendSuccess(res, { usdzUrl }, 'USDZ conversion complete');
  });

  /**
   * POST /ai3d/finalize
   * Updates product with 3D model URLs and sets status to ACTIVE.
   */
  static finalize = asyncHandler(async (req: Request, res: Response) => {
    const { productId, glbUrl, usdzUrl } = req.body;
    if (!productId || typeof productId !== 'string') {
      throw new AppError('productId is required', 400);
    }
    if (!glbUrl || typeof glbUrl !== 'string') {
      throw new AppError('glbUrl is required', 400);
    }

    const product = await ProductService.finalize3D(productId, glbUrl, usdzUrl);
    sendSuccess(res, product, '3D model finalized, product is now ACTIVE');
  });
}
