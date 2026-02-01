'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { columns } from './columns';
import { useProducts } from '@/hooks/useProducts';
import { PaginationState } from '@tanstack/react-table';

export function ProductTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const { data, isLoading, error } = useProducts({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const handlePaginationChange = (
    updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState),
  ) => {
    const newPagination =
      typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;

    setPagination(newPagination);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPagination.pageIndex + 1));
    params.set('limit', String(newPagination.pageSize));
    router.push(`?${params.toString()}`);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error loading products</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={data?.data || []}
      pageCount={data?.meta?.totalPages}
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
      manualPagination={true}
      manualSorting={true}
    />
  );
}
