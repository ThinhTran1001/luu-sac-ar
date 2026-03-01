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
    <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="search">Tìm Kiếm</Label>
        <Input
          id="search"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-[200px]">
        <Label htmlFor="category">Danh Mục</Label>
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
          <SelectTrigger id="category">
            <SelectValue placeholder="Tất cả Danh Mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả Danh Mục</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-[200px]">
        <Label htmlFor="sort">Sắp Xếp</Label>
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
          <SelectTrigger id="sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Mới Nhất</SelectItem>
            <SelectItem value="createdAt-asc">Cũ Nhất</SelectItem>
            <SelectItem value="price-asc">Giá: Thấp đến Cao</SelectItem>
            <SelectItem value="price-desc">Giá: Cao đến Thấp</SelectItem>
            <SelectItem value="name-asc">Tên: A đến Z</SelectItem>
            <SelectItem value="name-desc">Tên: Z đến A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button variant="outline" onClick={handleClearFilters}>
          Xóa Bộ Lọc
        </Button>
      </div>
    </div>
  );
}
