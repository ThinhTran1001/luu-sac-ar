'use client';

import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useBackground3DStore, type Background3DTask } from '@/stores/background-3d.store';
import {
  checkStatus,
  uploadGlb,
  convertToUsdz,
  finalizeProduct,
} from '@/services/ai3d-studio.service';

const POLL_INTERVAL_MS = 4_000;

function toastId(task: Background3DTask) {
  return `bg-3d-${task.productId}`;
}

function showProgress(task: Background3DTask, message: string, progress: number) {
  toast.loading(message, {
    id: toastId(task),
    description: `${task.productName} — ${progress}%`,
    duration: Infinity,
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface ProcessCallbacks {
  onComplete: () => void;
}

async function processTask(
  task: Background3DTask,
  update: (productId: string, u: Partial<Background3DTask>) => void,
  callbacks: ProcessCallbacks,
) {
  const pid = task.productId;

  try {
    let glbUrl = task.glbUrl || '';

    if (!glbUrl) {
      update(pid, { status: 'generating' });
      showProgress(task, 'Đang tạo mô hình 3D...', task.progress || 15);

      const deadline = Date.now() + 600_000;

      while (Date.now() < deadline) {
        await sleep(POLL_INTERVAL_MS);

        const result = await checkStatus(task.taskId);

        if (result.status === 'PENDING') {
          update(pid, { progress: 15 });
          showProgress(task, 'Đang chờ xử lý...', 15);
        } else if (result.status === 'IN_PROGRESS') {
          const p = Math.min(result.progress || 30, 75);
          update(pid, { progress: p });
          showProgress(task, 'Đang tạo mô hình 3D...', p);
        } else if (result.status === 'FINISHED' && result.results?.length) {
          const r = result.results[0];
          glbUrl = r.asset_url || r.asset;
          update(pid, { progress: 80, glbUrl });
          break;
        } else if (result.status === 'FAILED') {
          throw new Error('3D AI Studio generation failed');
        }
      }

      if (!glbUrl) throw new Error('3D generation timed out');
    }

    // Re-upload GLB to Cloudinary for a permanent, CORS-friendly URL
    if (!glbUrl.includes('cloudinary.com')) {
      update(pid, { status: 'converting', progress: 82 });
      showProgress(task, 'Đang lưu trữ mô hình 3D...', 82);
      glbUrl = await uploadGlb(glbUrl);
      update(pid, { glbUrl, progress: 85 });
    }

    let usdzUrl = task.usdzUrl || '';
    if (!usdzUrl) {
      update(pid, { status: 'converting', progress: 87 });
      showProgress(task, 'Đang chuyển đổi USDZ cho iOS AR...', 87);

      try {
        usdzUrl = await convertToUsdz(glbUrl);
      } catch {
        // USDZ conversion is non-critical
      }
      update(pid, { usdzUrl, progress: 92 });
    }

    update(pid, { status: 'finalizing', progress: 95 });
    showProgress(task, 'Đang cập nhật sản phẩm...', 95);

    await finalizeProduct(pid, glbUrl, usdzUrl);

    update(pid, { status: 'completed', progress: 100 });
    callbacks.onComplete();

    toast.success('Mô hình 3D đã hoàn tất!', {
      id: toastId(task),
      description: `${task.productName} — Sản phẩm đã chuyển sang trạng thái Hoạt Động`,
      duration: 8000,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Tạo mô hình 3D thất bại';
    update(pid, { status: 'failed', error: message });
    toast.error('Tạo mô hình 3D thất bại', {
      id: toastId(task),
      description: `${task.productName} — ${message}`,
      duration: 10000,
    });
  }
}

/**
 * Global component that processes background 3D generation tasks.
 * Mount once in root layout — persists across page navigation and reloads.
 */
export default function Background3DProcessor() {
  const tasks = useBackground3DStore((s) => s.tasks);
  const updateTask = useBackground3DStore((s) => s.updateTask);
  const processingRef = useRef<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const invalidateProducts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [queryClient]);

  useEffect(() => {
    for (const task of tasks) {
      if (task.status === 'completed' || task.status === 'failed') continue;
      if (processingRef.current.has(task.productId)) continue;

      processingRef.current.add(task.productId);

      processTask(task, updateTask, { onComplete: invalidateProducts }).finally(() => {
        processingRef.current.delete(task.productId);
      });
    }
  }, [tasks, updateTask, invalidateProducts]);

  return null;
}
