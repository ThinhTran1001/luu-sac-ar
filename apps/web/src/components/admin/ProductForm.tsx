'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProductSchema, CreateProductDto, CategoryDto, ProductDto } from '@luu-sac/shared';
import { useEffect, useState } from 'react';
import { categoryService } from '@/services/category.service';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload } from 'lucide-react';
import { MoneyInput } from '@/components/ui/money-input';
import AR3DGenerator from '@/components/ar/AR3DGenerator';

export interface ProductFormSubmitData {
  formData: FormData;
  arImageFile?: File;
}

interface ProductFormProps {
  initialData?: Partial<ProductDto>;
  onSubmit: (data: ProductFormSubmitData) => Promise<void>;
  isSubmitting: boolean;
}

export default function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const [mainImagePreview, setMainImagePreview] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnailImage || null,
  );
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    initialData?.galleryImages || [],
  );

  const [arImageFile, setArImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductDto>({
    // @ts-ignore: Mismatch between file input (FileList) and Schema (URL string)
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      quantity: initialData?.quantity || 0,
      categoryId: initialData?.categoryId || '',
      status: initialData?.status || 'HIDE',
    },
  });

  const categoryId = watch('categoryId');
  const status = watch('status');

  useEffect(() => {
    categoryService.findAll().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    return () => {
      [mainImagePreview, thumbnailPreview, ...galleryPreviews].forEach((url) => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [mainImagePreview, thumbnailPreview, galleryPreviews]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setGalleryPreviews(urls);
    }
  };

  const onNativeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (arImageFile) {
      formData.set('status', 'HIDE');
    }

    await onSubmit({
      formData,
      arImageFile: arImageFile ?? undefined,
    });
  };

  const effectiveStatus = arImageFile ? 'HIDE' : status;

  return (
    <form onSubmit={onNativeSubmit} className="space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Product Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Thông Tin Cơ Bản</CardTitle>
              <CardDescription className="text-gray-500">Nhập chi tiết chính cho sản phẩm gốm sứ của bạn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Tên Sản Phẩm</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ví dụ: Bình Gốm Lục Bình"
                  className={`text-gray-700 bg-white ${errors.name ? 'border-destructive' : 'border-gray-300'}`}
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">Mô Tả</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Mô tả lịch sử, chất liệu, và thiết kế của sản phẩm..."
                  rows={6}
                  className="text-gray-700 bg-white border-gray-300"
                />
                {errors.description && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-700">Giá</Label>
                  <MoneyInput
                    id="price"
                    name="price"
                    value={watch('price') || 0}
                    onChange={(v) => setValue('price', v)}
                    error={!!errors.price}
                  />
                  {errors.price && (
                    <p className="text-sm font-medium text-destructive">{errors.price.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-gray-700">Số Lượng</Label>
                  <Input id="quantity" {...register('quantity')} type="number" min="0" className="text-gray-700 bg-white border-gray-300" />
                  {errors.quantity && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Thư Viện Ảnh</CardTitle>
              <CardDescription className="text-gray-500">
                Chọn thêm những hình ảnh chất lượng cao cho thư viện ảnh.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer relative"
                  onClick={() => document.getElementById('galleryImages')?.click()}
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">
                    Nhấp để tải lên các hình ảnh thư viện
                  </p>
                  <Input
                    id="galleryImages"
                    type="file"
                    name="galleryImages"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryChange}
                  />
                </div>

                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {galleryPreviews.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md overflow-hidden border"
                      >
                        <Image src={url} alt={`Gallery ${index}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AR 3D Generation (3D AI Studio) */}
          <AR3DGenerator
            productId={initialData?.id}
            onImageSelected={(file) => setArImageFile(file)}
            onClear={() => setArImageFile(null)}
            disabled={isSubmitting}
          />
        </div>

        {/* Right Column: Organization & Featured Images */}
        <div className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Sắp Xếp</CardTitle>
              <CardDescription className="text-gray-500">Thiết lập trạng thái và danh mục sản phẩm.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Danh Mục</Label>
                <Select value={categoryId} onValueChange={(val) => setValue('categoryId', val)}>
                  <SelectTrigger className="text-gray-700 bg-white border-gray-300">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-gray-700 focus:bg-blue-50 focus:text-blue-600">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="categoryId" value={categoryId || ''} />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Trạng Thái</Label>
                <Select
                  value={effectiveStatus}
                  onValueChange={(val: any) => setValue('status', val)}
                  disabled={!!arImageFile}
                >
                  <SelectTrigger className="text-gray-700 bg-white border-gray-300">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="ACTIVE" className="text-gray-700 focus:bg-blue-50 focus:text-blue-600">Hoạt Động</SelectItem>
                    <SelectItem value="HIDE" className="text-gray-700 focus:bg-blue-50 focus:text-blue-600">Ẩn</SelectItem>
                    <SelectItem value="DELETED" className="text-gray-700 focus:bg-blue-50 focus:text-blue-600">Đã Xóa</SelectItem>
                  </SelectContent>
                </Select> 
                {arImageFile && (
                  <p className="text-xs text-amber-600">
                    Trạng thái tự động đặt Ẩn khi có ảnh 3D. Sẽ chuyển Hoạt Động khi tạo 3D xong.
                  </p>
                )}
                <input type="hidden" name="status" value={effectiveStatus || 'ACTIVE'} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Ảnh Sản Phẩm</CardTitle>
              <CardDescription className="text-gray-500">Ảnh bìa và ảnh thu nhỏ được dùng làm đại diện.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-700">Ảnh Bìa Chính</Label>
                <div className="relative aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden bg-gray-50 group hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  {mainImagePreview ? (
                    <>
                      <Image
                        src={mainImagePreview}
                        alt="Main Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          onClick={() => document.getElementById('imageUrl')?.click()}
                        >
                          Thay Đổi Ảnh
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-full w-full flex-col space-y-2"
                      onClick={() => document.getElementById('imageUrl')?.click()}
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-gray-500">Tải Ảnh Bìa Chính</span>
                    </Button>
                  )}
                  <Input
                    id="imageUrl"
                    type="file"
                    name="imageUrl"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setMainImagePreview)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Ảnh Thu Nhỏ Thêm</Label>
                <div className="relative h-32 w-32 mx-auto rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden bg-gray-50 group hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  {thumbnailPreview ? (
                    <>
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          onClick={() => document.getElementById('thumbnailImage')?.click()}
                        >
                          Đổi
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-full w-full flex-col space-y-1"
                      onClick={() => document.getElementById('thumbnailImage')?.click()}
                    >
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500">Ảnh Thu Nhỏ</span>
                    </Button>
                  )}
                  <Input
                    id="thumbnailImage"
                    type="file"
                    name="thumbnailImage"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setThumbnailPreview)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" size="lg" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang Lưu Sản Phẩm...
                </>
              ) : (
                'Lưu Sản Phẩm'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
