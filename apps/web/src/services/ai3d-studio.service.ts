const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const AI3D_ENDPOINT = `${API_BASE}/api/ai3d`;

export type AI3DProvider = 'trellis2' | 'hunyuan-rapid' | 'hunyuan-pro';

export interface AI3DGenerateOptions {
  provider?: AI3DProvider;
  enablePbr?: boolean;
  resolution?: '512' | '1024' | '1536';
  prompt?: string;
}

export interface AI3DStatusResult {
  status: 'PENDING' | 'IN_PROGRESS' | 'FINISHED' | 'FAILED';
  progress: number;
  results?: Array<{
    asset_url: string | null;
    asset: string;
    asset_type: string;
    thumbnail?: string;
  }>;
}

/**
 * Submit image for 3D generation. Returns taskId for polling.
 */
export async function submitGeneration(
  imageFile: File,
  options: AI3DGenerateOptions = {},
): Promise<string> {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('provider', options.provider ?? 'trellis2');
  formData.append('enablePbr', String(options.enablePbr ?? true));
  formData.append('resolution', options.resolution ?? '1024');
  if (options.prompt) {
    formData.append('prompt', options.prompt);
  }

  const response = await fetch(`${AI3D_ENDPOINT}/generate`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string })?.message || `Generation submit failed: ${response.status}`,
    );
  }

  const data = (await response.json()) as { data: { taskId: string } };
  return data.data.taskId;
}

/**
 * Check status of a generation task.
 */
export async function checkStatus(taskId: string): Promise<AI3DStatusResult> {
  const response = await fetch(`${AI3D_ENDPOINT}/status/${taskId}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string })?.message || `Status check failed: ${response.status}`,
    );
  }

  const data = (await response.json()) as { data: AI3DStatusResult };
  return data.data;
}

/**
 * Upload GLB from temporary presigned URL to permanent Cloudinary storage.
 */
export async function uploadGlb(glbUrl: string): Promise<string> {
  const response = await fetch(`${AI3D_ENDPOINT}/upload-glb`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ glbUrl }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string })?.message || `GLB upload failed: ${response.status}`,
    );
  }

  const data = (await response.json()) as { data: { glbUrl: string } };
  return data.data.glbUrl;
}

/**
 * Convert GLB to USDZ via backend.
 */
export async function convertToUsdz(glbUrl: string): Promise<string> {
  const response = await fetch(`${AI3D_ENDPOINT}/convert-usdz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ glbUrl }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string })?.message || `USDZ conversion failed: ${response.status}`,
    );
  }

  const data = (await response.json()) as { data: { usdzUrl: string } };
  return data.data.usdzUrl;
}

/**
 * Finalize product: attach 3D URLs and set status to ACTIVE.
 */
export async function finalizeProduct(
  productId: string,
  glbUrl: string,
  usdzUrl?: string,
): Promise<void> {
  const response = await fetch(`${AI3D_ENDPOINT}/finalize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, glbUrl, usdzUrl }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string })?.message || `Finalize failed: ${response.status}`,
    );
  }
}
