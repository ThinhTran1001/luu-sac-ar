'use client';

import { useState, useEffect } from 'react';
import { PublicProductQueryDto } from '@luu-sac/shared';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { categoryService } from '@/services/category.service';
import { useDebounce } from '@/hooks/useDebounce';
import { CategoryDto } from '@luu-sac/shared';

interface ProductFiltersProps {
  filters: PublicProductQueryDto;
  onFiltersChange: (filters: PublicProductQueryDto) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    categoryService.findAll().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    onFiltersChange({ ...filters, search: debouncedSearch, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleClearFilters = () => {
    setSearch('');
    onFiltersChange({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="flex flex-wrap gap-4 p-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="search" className="text-[var(--foreground)] text-sm font-medium">Tìm kiếm</Label>
        <Input
          id="search"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-1.5 rounded-xl border-[var(--border)]"
        />
      </div>

      <div className="w-[200px]">
        <Label htmlFor="category" className="text-[var(--foreground)] text-sm font-medium">Danh mục</Label>
        <Select
          value={filters.categoryId || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              categoryId: value === 'all' ? undefined : value,
              page: 1,
            })
          }
        >
          <SelectTrigger id="category" className="mt-1.5 rounded-xl">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-[200px]">
        <Label htmlFor="sort" className="text-[var(--foreground)] text-sm font-medium">Sắp xếp</Label>
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-');
            onFiltersChange({
              ...filters,
              sortBy: sortBy as any,
              sortOrder: sortOrder as any,
            });
          }}
        >
          <SelectTrigger id="sort" className="mt-1.5 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
            <SelectItem value="createdAt-asc">Cũ nhất</SelectItem>
            <SelectItem value="price-asc">Giá: thấp → cao</SelectItem>
            <SelectItem value="price-desc">Giá: cao → thấp</SelectItem>
            <SelectItem value="name-asc">Tên: A → Z</SelectItem>
            <SelectItem value="name-desc">Tên: Z → A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button variant="outline" onClick={handleClearFilters} className="rounded-xl border-[var(--border)]">
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
}
