const TRIPOSR_API_URL =
  process.env.NEXT_PUBLIC_TRIPOSR_API_URL || 'http://localhost:8000';

export interface TripoSRGenerateResult {
  glbUrl: string;
  usdzUrl: string;
}

export interface TripoSRSSEEvent {
  progress: number;
  message?: string;
  glb_url?: string;
  usdz_url?: string;
  error?: string;
}

export type TripoSROnProgress = (event: TripoSRSSEEvent) => void;

/**
 * Generate 3D model via /generate-stream (SSE) with real-time progress.
 * Returns both GLB (web/Android) and USDZ (iOS) URLs.
 */
export async function generate3DModelWithProgress(
  imageFile: File,
  onProgress: TripoSROnProgress,
): Promise<TripoSRGenerateResult> {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${TRIPOSR_API_URL}/generate-stream`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok || !response.body) {
    const error = await response.json().catch(() => ({}));
    const message =
      (error as { detail?: string })?.detail || `Generate failed: ${response.status}`;
    throw new Error(message);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() ?? '';

    for (const chunk of chunks) {
      const match = chunk.match(/^data:\s*(.+)$/m);
      if (!match) continue;

      const event = JSON.parse(match[1]) as TripoSRSSEEvent;

      if (event.progress === -1) {
        throw new Error(event.error ?? 'Unknown error');
      }

      onProgress(event);

      if (event.progress === 100 && event.glb_url && event.usdz_url) {
        return { glbUrl: event.glb_url, usdzUrl: event.usdz_url };
      }
    }
  }

  throw new Error('Stream ended without completion');
}

/**
 * Generate 3D model via /generate (simple JSON, no progress).
 * Returns both GLB and USDZ URLs.
 * @deprecated Use generate3DModelWithProgress for web UI
 */
export async function generate3DModel(imageFile: File): Promise<TripoSRGenerateResult> {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${TRIPOSR_API_URL}/generate`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message =
      (error as { detail?: string })?.detail || `Generate failed: ${response.status}`;
    throw new Error(message);
  }

  const data = (await response.json()) as { glb_url: string; usdz_url: string };
  return { glbUrl: data.glb_url, usdzUrl: data.usdz_url };
}
