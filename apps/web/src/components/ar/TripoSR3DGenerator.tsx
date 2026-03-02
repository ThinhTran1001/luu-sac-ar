'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Wand2, X, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generate3DModelWithProgress } from '@/services/triposr.service';
import type { ComponentProps } from 'react';
import type { ProductViewer3D as ProductViewer3DType } from './ProductViewer3D';

const ProductViewer3D = dynamic<ComponentProps<typeof ProductViewer3DType>>(
  () => import('./ProductViewer3D').then((m) => ({ default: m.ProductViewer3D })),
  { ssr: false },
);

interface TripoSR3DGeneratorProps {
  onSuccess: (glbUrl: string, usdzUrl: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

type ProcessingStatus = 'idle' | 'processing' | 'done' | 'error';

export default function TripoSR3DGenerator({
  onSuccess,
  onClear,
  disabled = false,
}: TripoSR3DGeneratorProps) {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [usdzUrl, setUsdzUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError(`File không hợp lệ. Chỉ chấp nhận: PNG, JPEG, JPG, WebP. Nhận được: ${file.type}`);
        setStatus('error');
        return;
      }

      setError(null);
      setProgress(0);
      setProgressMessage('');
      setStatus('processing');

      const originalUrl = URL.createObjectURL(file);
      setOriginalPreview(originalUrl);

      try {
        const result = await generate3DModelWithProgress(file, (event) => {
          setProgress(event.progress);
          if (event.message) setProgressMessage(event.message);
        });

        setProgress(100);
        setGlbUrl(result.glbUrl);
        setUsdzUrl(result.usdzUrl);
        setStatus('done');
        onSuccess(result.glbUrl, result.usdzUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Tạo mô hình 3D thất bại');
        setStatus('error');
      }
    },
    [onSuccess],
  );

  const handleClear = useCallback(() => {
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    setOriginalPreview(null);
    setGlbUrl(null);
    setUsdzUrl(null);
    setStatus('idle');
    setProgress(0);
    setProgressMessage('');
    setError(null);
    onClear();
  }, [originalPreview, onClear]);

  const isProcessing = status === 'processing';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Tạo mô hình 3D AR
        </CardTitle>
        <CardDescription>Tải ảnh lên để tạo mô hình 3D cho AR.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'idle' && (
          <div
            className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => !disabled && document.getElementById('ar-image-input')?.click()}
          >
            <Wand2 className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-center">Nhấn để tải ảnh lên tạo mô hình 3D AR</p>
            <p className="text-xs text-muted-foreground text-center mt-1">
              PNG, JPEG, JPG, WebP • ~8–15 giây
            </p>
            <input
              id="ar-image-input"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleFileSelect}
              disabled={disabled || isProcessing}
            />
          </div>
        )}

        {isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{progress}%</span>
                {progressMessage && (
                  <p className="text-xs text-muted-foreground truncate">{progressMessage}</p>
                )}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {status === 'done' && glbUrl && (
          <div className="space-y-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted">
              <ProductViewer3D
                modelUrl={glbUrl}
                usdzUrl={usdzUrl ?? undefined}
                productName="Mô hình 3D đã tạo"
                posterUrl={originalPreview ?? undefined}
                processingStatus="COMPLETED"
              />
            </div>

            <Button type="button" variant="outline" size="sm" onClick={handleClear}>
              <X className="h-4 w-4 mr-2" />
              Xóa & Tải ảnh khác
            </Button>
          </div>
        )}

        {status === 'error' && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={handleClear}>
              Thử lại
            </Button>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
