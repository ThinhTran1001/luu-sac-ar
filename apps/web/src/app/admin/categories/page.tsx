'use client';

import { useEffect, useState } from 'react';
import { CategoryDto } from '@luu-sac/shared';
import { categoryService } from '@/services/category.service';
import Link from 'next/link';
import { DataTable } from '@/components/common/DataTable';
import { getCategoryColumns } from './columns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoryListPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.findAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const promise = categoryService.delete(id);

    toast.promise(promise, {
      loading: 'Deleting category...',
      success: () => {
        fetchCategories();
        return 'Category deleted successfully';
      },
      error: 'Failed to delete category',
    });
  };

  const columns = getCategoryColumns({ onDelete: handleDelete });

  if (loading)
    return <div className="p-8 text-center text-muted-foreground">Loading categories...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={categories} />
    </div>
  );
}
