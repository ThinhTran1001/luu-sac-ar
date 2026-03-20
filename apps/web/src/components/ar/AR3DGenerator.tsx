'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wand2, X, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBackground3DStore } from '@/stores/background-3d.store';

const ProductViewer3D = dynamic(
  () => import('./ProductViewer3D').then((mod) => mod.ProductViewer3D),
  { ssr: false },
);

const VALID_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const STATUS_LABELS: Record<string, string> = {
  submitting: 'Đang gửi ảnh...',
  generating: 'Đang tạo mô hình 3D...',
  converting: 'Đang chuyển đổi USDZ cho iOS AR...',
  finalizing: 'Đang cập nhật sản phẩm...',
  completed: 'Mô hình 3D đã hoàn tất!',
  failed: 'Tạo mô hình 3D thất bại',
};

interface AR3DGeneratorProps {
  productId?: string;
  productName?: string;
  /** Mô hình AR hiện có trên server (chỉnh sửa sản phẩm) */
  existingGlbUrl?: string | null;
  existingUsdzUrl?: string | null;
  posterUrl?: string | null;
  processingStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | null;
  onImageSelected: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
}

export default function AR3DGenerator({
  productId,
  productName = 'Sản phẩm',
  existingGlbUrl,
  existingUsdzUrl,
  posterUrl,
  processingStatus = 'COMPLETED',
  onImageSelected,
  onClear,
  disabled = false,
}: AR3DGeneratorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [replaceMode, setReplaceMode] = useState(false);

  const bgTask = useBackground3DStore((s) =>
    productId ? s.tasks.find((t) => t.productId === productId) : undefined,
  );

  const isTaskActive = bgTask && bgTask.status !== 'completed' && bgTask.status !== 'failed';
  const isTaskDone = bgTask?.status === 'completed';
  const isTaskFailed = bgTask?.status === 'failed';

  const displayGlb = bgTask?.glbUrl || existingGlbUrl || undefined;
  const displayUsdz = bgTask?.usdzUrl || existingUsdzUrl || undefined;

  /** Có thể xem trước AR (URL GLB đã có — từ server hoặc sau khi AI trả về) */
  const canShowArPreview =
    !!displayGlb && !replaceMode && !preview && !isTaskActive;

  const handleStartReplace = useCallback(() => {
    onClear();
    setReplaceMode(true);
    // Mở hộp thoại chọn file ngay (cùng một lần bấm — giữ user activation)
    fileInputRef.current?.click();
  }, [onClear]);

  const handleCancelReplace = useCallback(() => {
    setReplaceMode(false);
    setError(null);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!VALID_TYPES.includes(file.type)) {
        setError('File không hợp lệ. Chỉ chấp nhận: PNG, JPEG, JPG, WebP.');
        return;
      }

      setError(null);
      setReplaceMode(false);
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageSelected(file);
    },
    [onImageSelected],
  );

  const handleClear = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
    setReplaceMode(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClear();
  }, [preview, onClear]);

  const showReplaceButton =
    !!displayGlb && !isTaskActive && !preview && !replaceMode && (isTaskDone || !!existingGlbUrl);

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Wand2 className="h-5 w-5 text-blue-600" />
          Tạo mô hình 3D AR
        </CardTitle>
        <CardDescription className="text-gray-500">
          {isTaskActive
            ? 'Đang tạo mô hình 3D trong nền...'
            : 'Tải ảnh lên để tạo mô hình 3D cho AR. Quá trình tạo 3D sẽ chạy nền sau khi lưu sản phẩm.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active background task — show live progress */}
        {isTaskActive && bgTask && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{bgTask.progress}%</span>
                <p className="text-xs text-muted-foreground truncate">
                  {STATUS_LABELS[bgTask.status] || bgTask.status}
                </p>
              </div>
            </div>
            <Progress value={bgTask.progress} className="h-2" />
            <p className="text-xs text-amber-600 font-medium">
              Mô hình 3D đang được tạo trong nền. Sản phẩm sẽ tự động chuyển sang Hoạt Động khi hoàn
              tất.
            </p>
          </div>
        )}

        {/* Task failed */}
        {isTaskFailed && bgTask && (
          <Alert variant="destructive" className="bg-red-50 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{bgTask.error || 'Tạo mô hình 3D thất bại'}</AlertDescription>
          </Alert>
        )}

        {/* AR preview — giống trang chi tiết sản phẩm */}
        {canShowArPreview && displayGlb && (
          <div className="space-y-4">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="images">Hình Ảnh</TabsTrigger>
                <TabsTrigger value="3d">Xem 3D</TabsTrigger>
              </TabsList>
              <TabsContent value="images" className="mt-4">
                <div className="relative w-full aspect-square max-h-[min(70vh,520px)] rounded-lg overflow-hidden border bg-muted">
                  {posterUrl ? (
                    <Image src={posterUrl} alt={productName} fill className="object-contain" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground p-4 text-center">
                      Chưa có ảnh đại diện. Mô hình 3D vẫn xem được ở tab &quot;Xem 3D&quot;.
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="3d" className="mt-4">
                <ProductViewer3D
                  modelUrl={displayGlb}
                  usdzUrl={displayUsdz}
                  productName={productName}
                  posterUrl={posterUrl ?? undefined}
                  processingStatus={processingStatus ?? undefined}
                />
              </TabsContent>
            </Tabs>

            {showReplaceButton && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={handleStartReplace}
                disabled={disabled}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Thay đổi mô hình AR
              </Button>
            )}
          </div>
        )}

        {/* Chế độ thay thế: chọn ảnh mới */}
        {replaceMode && !preview && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">Chọn ảnh mới để tạo lại mô hình 3D.</p>
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelReplace}>
                Hủy
              </Button>
            </div>
            <div
              className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              <Wand2 className="h-12 w-12 text-blue-600 mb-3" />
              <p className="text-sm font-medium text-center text-gray-900">
                Nhấn để tải ảnh lên tạo mô hình 3D AR
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                PNG, JPEG, JPG, WebP • Mô hình 3D sẽ được tạo nền sau khi lưu
              </p>
            </div>
          </div>
        )}

        {/* Normal upload UI — khi chưa có mô hình và không trong replace / task */}
        {!isTaskActive &&
          !isTaskDone &&
          !preview &&
          !error &&
          !canShowArPreview &&
          !replaceMode && (
            <div
              className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              <Wand2 className="h-12 w-12 text-blue-600 mb-3" />
              <p className="text-sm font-medium text-center text-gray-900">
                Nhấn để tải ảnh lên tạo mô hình 3D AR
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                PNG, JPEG, JPG, WebP • Mô hình 3D sẽ được tạo nền sau khi lưu
              </p>
            </div>
          )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled}
        />

        {/* Image selected, awaiting form submit */}
        {!isTaskActive && preview && (
          <div className="space-y-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted max-w-[300px] mx-auto">
              <Image src={preview} alt="AR 3D preview" fill className="object-contain" />
            </div>
            <p className="text-xs text-center text-amber-600 font-medium">
              Mô hình 3D sẽ được tạo tự động trong nền sau khi lưu sản phẩm. Sản phẩm sẽ ở trạng thái
              Ẩn cho đến khi hoàn tất.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={handleClear}>
              <X className="h-4 w-4 mr-2" />
              Xóa & Chọn ảnh khác
            </Button>
          </div>
        )}

        {/* Validation error */}
        {!isTaskActive && !isTaskDone && error && (
          <Alert variant="destructive" className="bg-red-50 text-red-600">
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
