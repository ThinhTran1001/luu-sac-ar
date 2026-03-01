'use client';

import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { removeBackground } from '@imgly/background-removal';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Wand2, X, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageBackgroundRemoverProps {
  onProcessed: (originalBlob: Blob, noBgBlob: Blob) => void;
  onClear: () => void;
  disabled?: boolean;
}

type ProcessingStatus = 'idle' | 'compressing' | 'removing' | 'done' | 'error';

export default function ImageBackgroundRemover({
  onProcessed,
  onClear,
  disabled = false,
}: ImageBackgroundRemoverProps) {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);
      setProgress(0);

      try {
        // Show original preview immediately
        const originalUrl = URL.createObjectURL(file);
        setOriginalPreview(originalUrl);

        // Step 1: Compress image
        setStatus('compressing');
        setProgress(10);

        const compressedFile = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });

        setProgress(30);

        // Step 2: Remove background
        setStatus('removing');

        const noBgBlob = await removeBackground(compressedFile, {
          progress: (key, current, total) => {
            const bgProgress = 30 + (current / total) * 60;
            setProgress(Math.min(bgProgress, 90));
          },
        });

        setProgress(95);

        // Step 3: Create preview and notify parent
        const processedUrl = URL.createObjectURL(noBgBlob);
        setProcessedPreview(processedUrl);

        // Pass both blobs to parent
        onProcessed(compressedFile, noBgBlob);

        setProgress(100);
        setStatus('done');
      } catch (err) {
        console.error('Background removal failed:', err);
        setError(err instanceof Error ? err.message : 'Lỗi xử lý hình ảnh');
        setStatus('error');
      }
    },
    [onProcessed],
  );

  const handleClear = useCallback(() => {
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (processedPreview) URL.revokeObjectURL(processedPreview);
    setOriginalPreview(null);
    setProcessedPreview(null);
    setStatus('idle');
    setProgress(0);
    setError(null);
    onClear();
  }, [originalPreview, processedPreview, onClear]);

  const isProcessing = status === 'compressing' || status === 'removing';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Tạo Mô Hình AR 3D
        </CardTitle>
        <CardDescription>
          Tải lên một hình ảnh để tự động xóa phông nền và tạo mô hình AR 3D.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'idle' && (
          <div
            className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => !disabled && document.getElementById('ar-image-input')?.click()}
          >
            <Wand2 className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-center">
              Nhấp để tải lên hình ảnh cho mô hình AR 3D
            </p>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Phông nền sẽ được xóa tự động
            </p>
            <input
              id="ar-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={disabled || isProcessing}
            />
          </div>
        )}

        {isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">
                {status === 'compressing' ? 'Đang nén hình ảnh...' : 'Đang xóa phông nền...'}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Quá trình này có thể mất 10-15 giây tùy thuộc vào kích thước hình ảnh
            </p>
          </div>
        )}

        {status === 'done' && originalPreview && processedPreview && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">Xóa phông nền thành công!</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Ảnh Gốc</p>
                <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                  <Image src={originalPreview} alt="Original" fill className="object-contain" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Ảnh Đã Xóa Phông Nền</p>
                <div className="relative aspect-square rounded-lg overflow-hidden border bg-[url('/checkerboard.svg')] bg-repeat">
                  <Image
                    src={processedPreview}
                    alt="Processed"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <Button type="button" variant="outline" size="sm" onClick={handleClear}>
              <X className="h-4 w-4 mr-2" />
              Xóa & Chọn Ảnh Khác
            </Button>
          </div>
        )}

        {status === 'error' && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={handleClear}
            >
              Thử Lại
            </Button>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
