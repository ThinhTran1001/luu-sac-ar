/// <reference path="../../types/model-viewer.d.ts" />

'use client';

import { useRef, useState, useEffect } from 'react';
// Import is handled via useEffect below
import { Button } from '@/components/ui/button';
import { RotateCcw, Loader2, AlertCircle, Smartphone, Maximize2 } from 'lucide-react';
import type { ModelViewerElement } from '@/types/model-viewer';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProductViewer3DProps {
  modelUrl: string;
  usdzUrl?: string;
  productName: string;
  posterUrl?: string;
  processingStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

/** Dự phòng khi không nhận được sự kiện (model nặng / mạng chậm) */
const LOAD_TIMEOUT_MS = 120_000;

export function ProductViewer3D({
  modelUrl,
  usdzUrl,
  productName,
  posterUrl,
  processingStatus = 'COMPLETED',
}: ProductViewer3DProps) {
  const viewerRef = useRef<ModelViewerElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modelViewerReady, setModelViewerReady] = useState(false);

  useEffect(() => {
    import('@google/model-viewer').then(() => setModelViewerReady(true));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const hasWebXR = 'xr' in navigator;
      setIsARSupported(isIOS || hasWebXR);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [modelUrl]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !modelViewerReady) return;

    let loadTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const clearLoadTimeout = () => {
      if (loadTimeoutId !== undefined) {
        clearTimeout(loadTimeoutId);
        loadTimeoutId = undefined;
      }
    };

    const onLoad = () => {
      clearLoadTimeout();
      setIsLoading(false);
      setHasError(false);
    };
    const onError = () => {
      clearLoadTimeout();
      setIsLoading(false);
      setHasError(true);
    };

    // Cảnh báo: trước đây không clearTimeout khi load thành công → sau ~20s vẫn gọi setHasError(true)
    // dù mô hình đã hiển thị (lỗi “tải thất bại” sau vài giây).
    loadTimeoutId = setTimeout(() => {
      setIsLoading(false);
      setHasError(true);
    }, LOAD_TIMEOUT_MS);

    viewer.addEventListener('load', onLoad);
    viewer.addEventListener('error', onError);

    // Model đã cache / load xong trước khi gắn listener — tránh bỏ lỡ sự kiện load
    const maybeAlreadyLoaded = () => {
      const mv = viewer as unknown as { loaded?: boolean };
      if (mv.loaded) onLoad();
    };
    requestAnimationFrame(maybeAlreadyLoaded);

    return () => {
      clearLoadTimeout();
      viewer.removeEventListener('load', onLoad);
      viewer.removeEventListener('error', onError);
    };
  }, [modelUrl, modelViewerReady]);

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.resetTurntableRotation();
      viewerRef.current.fieldOfView = 'auto';
    }
  };

  const handleFullscreen = () => {
    const element = viewerRef.current;
    if (!element) return;

    if (!isFullscreen) {
      element.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Show processing state
  if (processingStatus === 'PROCESSING') {
    return (
      <div className="relative w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium">Đang tạo mô hình 3D...</p>
        <p className="text-xs text-muted-foreground mt-1">Quá trình này có thể mất 10-15 giây</p>
      </div>
    );
  }

  // Show failed state
  if (processingStatus === 'FAILED' || hasError) {
    return (
      <div className="relative w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-6">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-sm font-medium text-center">Tải mô hình 3D thất bại</p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Không thể tạo mô hình 3D cho sản phẩm này.
        </p>
      </div>
    );
  }

  // Show pending state (no GLB yet)
  if (processingStatus === 'PENDING' || !modelUrl) {
    return (
      <div className="relative w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-6">
        <div className="h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center mb-4">
          <Smartphone className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-center">Không có bản Xem 3D</p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Sản phẩm này chưa có mô hình 3D.
        </p>
      </div>
    );
  }

  // Wait for model-viewer lib to load
  if (!modelViewerReady) {
    return (
      <div className="relative w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium">Đang tải trình xem 3D...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg z-10">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Đang tải mô hình 3D...</p>
          </div>
        </div>
      )}

      <model-viewer
        ref={viewerRef}
        src={modelUrl}
        ios-src={usdzUrl}
        alt={productName}
        poster={posterUrl}
        crossorigin="anonymous"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-placement="floor"
        camera-controls
        touch-action="pan-y"
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        className="w-full h-full rounded-lg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* AR Button (shows on AR-capable devices) */}
        <button
          slot="ar-button"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Smartphone className="h-5 w-5" />
          Xem Trong Không Gian Của Bạn
        </button>

        {/* Loading Progress */}
        <div slot="progress-bar" className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
          <div className="h-full bg-primary transition-all" style={{ width: '100%' }} />
        </div>
      </model-viewer>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button size="icon" variant="secondary" onClick={handleReset} title="Đặt lại góc nhìn">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleFullscreen} title="Toàn màn hình">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* AR Support Indicator */}
      {isARSupported && (
        <div className="absolute top-4 left-4 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Smartphone className="h-3 w-3" />
          Hỗ trợ AR
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md text-xs">
        <p className="text-muted-foreground">Kéo để xoay • Cuộn để thu phóng • Chụm ngón tay để đổi kích thước</p>
      </div>
    </div>
  );
}
