/// <reference path="../../../src/types/model-viewer.d.ts" />


'use client';

import { useRef } from 'react';
import '@google/model-viewer';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { ModelViewerElement } from '@/types/model-viewer';

interface ProductViewer3DProps {
  modelUrl: string;
  productName: string;
  posterUrl?: string; // Thumbnail image while loading
}

export function ProductViewer3D({ modelUrl, productName, posterUrl }: ProductViewer3DProps) {
  const viewerRef = useRef<ModelViewerElement>(null);

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.resetTurntableRotation();
      viewerRef.current.fieldOfView = 'auto';
    }
  };

  return (
    <div className="relative w-full aspect-square">
      <model-viewer
        ref={viewerRef}
        src={modelUrl}
        alt={productName}
        poster={posterUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        touch-action="pan-y"
        auto-rotate
        auto-rotate-delay="3000"
        rotation-per-second="30deg"
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        className="w-full h-full rounded-lg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* AR Button (shows on AR-capable devices) */}
        <button
          slot="ar-button"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-primary/90 transition-colors"
        >
          View in Your Space
        </button>

        {/* Loading indicator */}
        <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading 3D model...</p>
          </div>
        </div>
      </model-viewer>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleReset}
          title="Reset view"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md text-xs">
        <p className="text-muted-foreground">
          Drag to rotate • Scroll to zoom • Pinch to scale
        </p>
      </div>
    </div>
  );
}
