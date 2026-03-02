'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import type { ModelViewerElement } from '@/types/model-viewer';
import { RotateCcw, ArrowLeft, Loader2, X, Camera, AlertCircle } from 'lucide-react';

const GLB_URL =
  'https://res.cloudinary.com/dnm1hfesq/raw/upload/v1772349031/triposr/5d6148d68b6a48fda25e53d5d2e25d23.glb';
const USDZ_URL =
  'https://res.cloudinary.com/dnm1hfesq/raw/upload/v1772351503/triposr/a8dee5fe393f46f19e3f2a0a07aa4c1f.usdz';

type ViewMode = 'preview' | 'ar';
type DeviceOS = 'ios' | 'android' | 'desktop';

function detectOS(): DeviceOS {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
}

export default function ARViewerPage() {
  const viewerRef = useRef<ModelViewerElement>(null);
  const arViewerRef = useRef<ModelViewerElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [mode, setMode] = useState<ViewMode>('preview');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [modelViewerReady, setModelViewerReady] = useState(false);
  const [os, setOS] = useState<DeviceOS>('desktop');

  useEffect(() => {
    import('@google/model-viewer').then(() => setModelViewerReady(true));
    setOS(detectOS());
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const onLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };
    const onError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    viewer.addEventListener('load', onLoad);
    viewer.addEventListener('error', onError);

    return () => {
      viewer.removeEventListener('load', onLoad);
      viewer.removeEventListener('error', onError);
    };
  }, [modelViewerReady]);

  const startCameraAR = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMode('ar');
    } catch {
      setCameraError(
        'Could not access camera. Please grant camera permission and ensure you are using HTTPS.',
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setMode('preview');
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleReset = () => {
    const viewer = mode === 'ar' ? arViewerRef.current : viewerRef.current;
    if (viewer) {
      viewer.resetTurntableRotation();
      viewer.fieldOfView = 'auto';
    }
  };

  if (hasError) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center p-6">
        <div className="text-center text-white max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to load 3D model</h2>
          <p className="text-white/60 text-sm mb-6">
            The model could not be loaded. Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black px-6 py-3 rounded-full font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Android camera overlay AR mode
  if (mode === 'ar') {
    return (
      <div className="fixed inset-0 bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0" style={{ pointerEvents: 'auto' }}>
          {modelViewerReady && (
            <model-viewer
              ref={arViewerRef}
              src={GLB_URL}
              alt="Ceramic Vase - AR"
              camera-controls
              touch-action="pan-y"
              environment-image="neutral"
              exposure="1.2"
              shadow-intensity="0"
              interaction-prompt="none"
              loading="eager"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                '--poster-color': 'transparent',
              } as React.CSSProperties}
            />
          )}
        </div>

        <div className="absolute top-4 left-4 z-20 safe-area-top">
          <button
            onClick={stopCamera}
            className="bg-black/60 backdrop-blur-sm p-3 rounded-full active:scale-95 transition-transform"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="absolute top-4 right-4 z-20 safe-area-top">
          <button
            onClick={handleReset}
            className="bg-black/60 backdrop-blur-sm p-3 rounded-full active:scale-95 transition-transform"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center safe-area-bottom">
          <p className="text-white/90 text-xs bg-black/50 backdrop-blur-sm px-5 py-2.5 rounded-full">
            Drag to rotate &bull; Pinch to scale &bull; Point camera at a surface
          </p>
        </div>
      </div>
    );
  }

  // Preview mode — iOS uses model-viewer's built-in AR, Android uses camera overlay
  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm safe-area-top">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="text-white font-semibold text-sm">AR Viewer</h1>
        <button
          onClick={handleReset}
          className="text-white/80 hover:text-white transition-colors p-1"
          title="Reset view"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 3D Preview — fills remaining space, model-viewer AR button lives inside */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black">
            <Loader2 className="w-10 h-10 text-white animate-spin mb-3" />
            <p className="text-white/70 text-sm">Loading 3D model...</p>
          </div>
        )}

        {modelViewerReady && (
          <model-viewer
            ref={viewerRef}
            src={GLB_URL}
            ios-src={USDZ_URL}
            alt="Ceramic Vase - Preview"
            ar
            ar-modes={os === 'ios' ? 'quick-look' : 'webxr scene-viewer'}
            ar-scale="auto"
            ar-placement="floor"
            camera-controls
            touch-action="pan-y"
            auto-rotate
            auto-rotate-delay="2000"
            rotation-per-second="20deg"
            shadow-intensity="1.5"
            shadow-softness="0.8"
            environment-image="neutral"
            exposure="1.1"
            interaction-prompt="auto"
            loading="eager"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#111',
              '--poster-color': '#111',
            } as React.CSSProperties}
          >
            {/*
              On iOS: model-viewer renders this as the AR Quick Look trigger.
              Tapping it opens AR Quick Look with the USDZ file natively.
              On non-AR devices: this button is auto-hidden by model-viewer.
            */}
            {os === 'ios' && (
              <button
                slot="ar-button"
                className="absolute bottom-24 left-4 right-4 z-30 flex items-center justify-center gap-3 bg-white text-black font-semibold py-4 px-6 rounded-2xl shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
                  <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                  <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
                  <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
                </svg>
                Place Vase in Your Space
              </button>
            )}

            {os !== 'ios' && (
              <button slot="ar-button" style={{ display: 'none' }} />
            )}
          </model-viewer>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-6 px-4 safe-area-bottom">
        <div className="text-center mb-4">
          <p className="text-white/50 text-xs">Drag to rotate &bull; Pinch to zoom</p>
        </div>

        {/* Android / Desktop: camera overlay button */}
        {os !== 'ios' && (
          <button
            onClick={startCameraAR}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-4 px-6 rounded-2xl active:scale-[0.98] transition-transform shadow-lg shadow-white/10"
          >
            <Camera className="w-5 h-5" />
            <span>Place Vase in Your Space</span>
          </button>
        )}

        {/* iOS hint — the AR button is inside model-viewer above */}
        {os === 'ios' && (
          <p className="text-center text-white/50 text-xs">
            Tap the button above to open AR Quick Look
          </p>
        )}

        {cameraError && (
          <div className="mt-3 flex items-start gap-2 bg-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-xs">{cameraError}</p>
          </div>
        )}

        <p className="text-center text-white/40 text-xs mt-3">
          {os === 'ios' && 'Uses AR Quick Look with surface detection'}
          {os === 'android' && 'Opens camera to preview vase in your environment'}
          {os === 'desktop' && 'Open this page on your phone for the AR experience'}
        </p>
      </div>

      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
    </div>
  );
}
