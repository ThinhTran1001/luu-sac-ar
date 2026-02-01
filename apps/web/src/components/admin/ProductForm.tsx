'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProductSchema, CreateProductDto, CategoryDto, ProductDto } from '@luu-sac/shared';
import { useEffect, useState } from 'react';
import { categoryService } from '@/services/category.service';
import Image from 'next/image';

interface ProductFormProps {
  initialData?: Partial<ProductDto>;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

// Separate schema for form validation if needed,
// but since we handle files manually, we'll relax the schema or skip client-side file validation for now
// and rely on server or simple required checks.

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

  const {
    register,
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

  useEffect(() => {
    categoryService.findAll().then(setCategories).catch(console.error);
  }, []);

  // Cleanup object URLs to avoid memory leaks
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
    await onSubmit(formData);
  };

  return (
    <form onSubmit={onNativeSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Product Details */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  {...register('name')}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register('description')}
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    {...register('price')}
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    {...register('quantity')}
                    type="number"
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  {...register('categoryId')}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                >
                  <option value="">Select a Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  {...register('status')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="HIDE">Hide</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>

            <div className="space-y-6">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      name="imageUrl"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setMainImagePreview)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Required. Displays on product card.
                    </p>
                  </div>
                  {mainImagePreview && (
                    <div className="relative w-24 h-24 border rounded-lg overflow-hidden bg-white">
                      <Image
                        src={mainImagePreview}
                        alt="Main Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      name="thumbnailImage"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setThumbnailPreview)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Optional. Smaller version for lists.
                    </p>
                  </div>
                  {thumbnailPreview && (
                    <div className="relative w-24 h-24 border rounded-lg overflow-hidden bg-white">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Images
                </label>
                <input
                  type="file"
                  name="galleryImages"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">Select multiple images.</p>

                {galleryPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {galleryPreviews.map((url, index) => (
                      <div
                        key={index}
                        className="relative w-full h-20 border rounded-lg overflow-hidden bg-white"
                      >
                        <Image src={url} alt={`Gallery ${index}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-5 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Product'
          )}
        </button>
      </div>
    </form>
  );
}
