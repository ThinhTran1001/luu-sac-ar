const AI3D_STUDIO_BASE_URL = 'https://api.3daistudio.com';
const AI3D_STUDIO_API_KEY = process.env.AI3D_STUDIO_API_KEY || '';
const IS_MOCK = process.env.MOCK_3D_GENERATION === 'true';

export type AI3DProvider = 'trellis2' | 'hunyuan-rapid' | 'hunyuan-pro';

export interface AI3DGenerateOptions {
  provider?: AI3DProvider;
  enablePbr?: boolean;
  resolution?: '512' | '1024' | '1536';
  textureSize?: 1024 | 2048 | 4096;
  prompt?: string;
}

export interface AI3DSubmitResult {
  taskId: string;
  createdAt: string;
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

function authHeaders(): Record<string, string> {
  if (!AI3D_STUDIO_API_KEY) {
    throw new Error('AI3D_STUDIO_API_KEY is not configured');
  }
  return {
    Authorization: `Bearer ${AI3D_STUDIO_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

// ---------------------------------------------------------------------------
// Mock mode: simulates 3D AI Studio with a 20-second fake pipeline so the
// full async flow (polling, USDZ convert, finalize) can be tested for free.
// Enable with MOCK_3D_GENERATION=true in .env
// ---------------------------------------------------------------------------
const MOCK_DURATION_MS = 20_000;
const mockTasks = new Map<string, number>(); // taskId → createdAt timestamp

const SAMPLE_GLB_URL = 'https://res.cloudinary.com/demo/raw/upload/v1/sample-models/duck.glb';

class MockAI3DStudioService {
  static async submitGeneration(): Promise<AI3DSubmitResult> {
    const taskId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    mockTasks.set(taskId, Date.now());
    console.log(`[MOCK 3D] Task created: ${taskId} (will finish in ${MOCK_DURATION_MS / 1000}s)`);
    return { taskId, createdAt: new Date().toISOString() };
  }

  static async checkStatus(taskId: string): Promise<AI3DStatusResult> {
    const createdAt = mockTasks.get(taskId);
    if (!createdAt) {
      throw new Error(`[MOCK 3D] Unknown task: ${taskId}`);
    }

    const elapsed = Date.now() - createdAt;
    const pct = Math.min(Math.round((elapsed / MOCK_DURATION_MS) * 100), 100);

    if (pct < 100) {
      return { status: pct < 10 ? 'PENDING' : 'IN_PROGRESS', progress: pct };
    }

    return {
      status: 'FINISHED',
      progress: 100,
      results: [
        {
          asset_url: SAMPLE_GLB_URL,
          asset: SAMPLE_GLB_URL,
          asset_type: 'glb',
          thumbnail: null as unknown as string,
        },
      ],
    };
  }
}

// ---------------------------------------------------------------------------

export class AI3DStudioService {
  /**
   * Submit a 3D generation request (image-to-3D).
   * Returns a task_id for polling.
   */
  static async submitGeneration(
    imageBase64: string,
    options: AI3DGenerateOptions = {},
  ): Promise<AI3DSubmitResult> {
    if (IS_MOCK) return MockAI3DStudioService.submitGeneration();

    const provider = options.provider ?? 'trellis2';

    const body =
      provider === 'trellis2'
        ? this.buildTrellis2Body(imageBase64, options)
        : this.buildHunyuanBody(imageBase64, options, provider);

    const endpoint = this.getEndpoint(provider);

    const response = await fetch(`${AI3D_STUDIO_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message =
        (error as Record<string, string>)?.detail ||
        (error as Record<string, string>)?.error ||
        `3D AI Studio generation failed: ${response.status}`;
      throw new Error(message);
    }

    const data = (await response.json()) as { task_id: string; created_at: string };
    return { taskId: data.task_id, createdAt: data.created_at };
  }

  /**
   * Check the status of a generation request.
   */
  static async checkStatus(taskId: string): Promise<AI3DStatusResult> {
    if (IS_MOCK) return MockAI3DStudioService.checkStatus(taskId);

    const response = await fetch(
      `${AI3D_STUDIO_BASE_URL}/v1/generation-request/${taskId}/status/`,
      { headers: authHeaders() },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        (error as Record<string, string>)?.detail || `Status check failed: ${response.status}`,
      );
    }

    return (await response.json()) as AI3DStatusResult;
  }

  /**
   * Submit generation and poll until finished.
   * Used by backend product creation flow.
   */
  static async generateAndWait(
    imageBase64: string,
    options: AI3DGenerateOptions = {},
    maxWaitMs = 300_000,
    pollIntervalMs = 5_000,
  ): Promise<{ glbUrl: string; thumbnail?: string }> {
    const { taskId } = await this.submitGeneration(imageBase64, options);

    const deadline = Date.now() + maxWaitMs;

    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, pollIntervalMs));

      const status = await this.checkStatus(taskId);

      if (status.status === 'FINISHED' && status.results?.length) {
        const result = status.results[0];
        const glbUrl = result.asset_url || result.asset;
        return { glbUrl, thumbnail: result.thumbnail };
      }

      if (status.status === 'FAILED') {
        throw new Error('3D generation failed on 3D AI Studio');
      }
    }

    throw new Error('3D generation timed out');
  }

  private static getEndpoint(provider: AI3DProvider): string {
    switch (provider) {
      case 'trellis2':
        return '/v1/3d-models/trellis2/generate/';
      case 'hunyuan-rapid':
        return '/v1/3d-models/tencent/generate/rapid/';
      case 'hunyuan-pro':
        return '/v1/3d-models/tencent/generate/pro/';
    }
  }

  private static buildTrellis2Body(imageBase64: string, options: AI3DGenerateOptions) {
    return {
      image: imageBase64,
      resolution: options.resolution ?? '1024',
      textures: options.enablePbr ?? true,
      texture_size: options.textureSize ?? 2048,
      generate_thumbnail: true,
    };
  }

  private static buildHunyuanBody(
    imageBase64: string,
    options: AI3DGenerateOptions,
    provider: AI3DProvider,
  ) {
    const body: Record<string, unknown> = {
      image: imageBase64,
      enable_pbr: options.enablePbr ?? true,
    };

    if (options.prompt) {
      body.prompt = options.prompt;
    }

    if (provider === 'hunyuan-pro') {
      body.model = '3.0';
      body.generate_type = 'Normal';
    }

    return body;
  }
}
