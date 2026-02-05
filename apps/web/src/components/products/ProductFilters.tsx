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
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-[200px]">
        <Label htmlFor="category">Category</Label>
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
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-[200px]">
        <Label htmlFor="sort">Sort By</Label>
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
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button variant="outline" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
