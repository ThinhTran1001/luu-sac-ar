'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProductSchema, CreateProductDto, CategoryDto, ProductDto } from '@luu-sac/shared';
import { useEffect, useState, useRef } from 'react';
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
import { Loader2, Upload, X } from 'lucide-react';
import ImageBackgroundRemover from '@/components/ar/ImageBackgroundRemover';

interface ProductFormProps {
  initialData?: Partial<ProductDto>;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  // Preview States
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnailImage || null,
  );
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    initialData?.galleryImages || [],
  );

  // AR 3D State
  const [arOriginalBlob, setArOriginalBlob] = useState<Blob | null>(null);
  const [arNoBgBlob, setArNoBgBlob] = useState<Blob | null>(null);
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
      status: initialData?.status || 'ACTIVE',
    },
  });

  const categoryId = watch('categoryId');
  const status = watch('status');

  useEffect(() => {
    categoryService.findAll().then(setCategories).catch(console.error);
  }, []);

  // Cleanup object URLs
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

    // Add AR images if available
    if (arNoBgBlob) {
      formData.append('imageNoBg', arNoBgBlob, 'image-no-bg.png');
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={onNativeSubmit} className="space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Product Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the primary details for your ceramic product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g. Blue Phoenix Vase"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe the product's history, material, and design..."
                  rows={6}
                />
                {errors.description && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" {...register('price')} type="number" min="0" step="0.01" />
                  {errors.price && (
                    <p className="text-sm font-medium text-destructive">{errors.price.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" {...register('quantity')} type="number" min="0" />
                  {errors.quantity && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
              <CardDescription>
                Select additional high-resolution images for the gallery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div
                  className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center hover:bg-accent/50 transition-colors cursor-pointer relative"
                  onClick={() => document.getElementById('galleryImages')?.click()}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">
                    Click to upload gallery images
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

          {/* AR 3D Generation */}
          <ImageBackgroundRemover
            onProcessed={(original, noBg) => {
              setArOriginalBlob(original);
              setArNoBgBlob(noBg);
            }}
            onClear={() => {
              setArOriginalBlob(null);
              setArNoBgBlob(null);
            }}
            disabled={isSubmitting}
          />
        </div>

        {/* Right Column: Organization & Featured Images */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>Set product status and category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={(val) => setValue('categoryId', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('categoryId')} />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(val: any) => setValue('status', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="HIDE">Hide</SelectItem>
                    <SelectItem value="DELETED">Deleted</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('status')} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Main image and thumbnail used in listings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Main Image</Label>
                <div className="relative aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center overflow-hidden bg-accent/20 group hover:border-primary/50 transition-colors">
                  {mainImagePreview ? (
                    <>
                      <Image
                        src={mainImagePreview}
                        alt="Main Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => document.getElementById('imageUrl')?.click()}
                        >
                          Change Image
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
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-muted-foreground">Upload Main Image</span>
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
                <Label>Thumbnail Image</Label>
                <div className="relative h-32 w-32 mx-auto rounded-lg border-2 border-dashed flex flex-col items-center justify-center overflow-hidden bg-accent/20 group hover:border-primary/50 transition-colors">
                  {thumbnailPreview ? (
                    <>
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="secondary"
                          size="xs"
                          onClick={() => document.getElementById('thumbnailImage')?.click()}
                        >
                          Change
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
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Thumbnail</span>
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
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Product...
                </>
              ) : (
                'Save Product'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
