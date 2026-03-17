'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/common/DataTable';
import { getProductColumns } from './columns';
import { useProducts } from '@/hooks/useProducts';
import { PaginationState } from '@tanstack/react-table';
import { toast } from 'sonner';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@/constants/routes';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryDto } from '@luu-sac/shared';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Hoạt Động' },
  { value: 'HIDE', label: 'Ẩn' },
] as const;

export function ProductTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    categoryService.findAll().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch, categoryId, status]);

  const query = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(categoryId && { categoryId }),
    ...(status && { status: status as 'ACTIVE' | 'HIDE' }),
  };

  const { data, isLoading, error } = useProducts(query);

  const syncUrl = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      const values = {
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
        search: debouncedSearch || undefined,
        categoryId: categoryId || undefined,
        status: status || undefined,
        ...overrides,
      };
      Object.entries(values).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      router.push(`?${params.toString()}`);
    },
    [pagination, debouncedSearch, categoryId, status, router],
  );

  const handlePaginationChange = (
    updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState),
  ) => {
    const newPagination =
      typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;
    setPagination(newPagination);
    syncUrl({
      page: String(newPagination.pageIndex + 1),
      limit: String(newPagination.pageSize),
    });
  };

  const handleDelete = async (id: string) => {
    const promise = productService.delete(id);

    toast.promise(promise, {
      loading: 'Đang xóa sản phẩm...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        return 'Xóa sản phẩm thành công';
      },
      error: 'Xóa sản phẩm thất bại',
    });
  };

  const handleEdit = (id: string) => {
    router.push(ROUTES.ADMIN.PRODUCTS.EDIT(id));
  };

  const hasFilters = !!search || !!categoryId || !!status;

  const clearFilters = () => {
    setSearch('');
    setCategoryId('');
    setStatus('');
    router.push('?');
  };

  const columns = getProductColumns({ onDelete: handleDelete, onEdit: handleEdit });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-gray-300 text-gray-700"
          />
        </div>
        <Select value={categoryId || 'ALL'} onValueChange={(v) => setCategoryId(v === 'ALL' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white border-gray-300 text-gray-700">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ALL" className="text-gray-700">Tất cả danh mục</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id} className="text-gray-700">
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status || 'ALL'} onValueChange={(v) => setStatus(v === 'ALL' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-300 text-gray-700">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-gray-700">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 self-center">
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8">Đang tải sản phẩm...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">Lỗi tải dữ liệu sản phẩm</div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
          pageCount={data?.meta?.totalPages}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          manualPagination={true}
          manualSorting={true}
        />
      )}
    </div>
  );
}
