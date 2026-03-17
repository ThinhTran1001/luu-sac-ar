'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ProductDto, CategoryDto } from '@luu-sac/shared';
import { ColumnHeader } from '@/components/common/ColumnHeader';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

type ProductWithCategory = ProductDto & { category?: CategoryDto | null };

interface ProductColumnsProps {
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const getProductColumns = ({
  onDelete,
  onEdit,
}: ProductColumnsProps): ColumnDef<ProductWithCategory>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => <ColumnHeader column={column} title="Sản Phẩm" />,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 rounded-md border overflow-hidden">
            {product.thumbnailImage ? (
              <Image
                src={product.thumbnailImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                Trống
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm line-clamp-1">{product.name}</span>
            <span className="text-xs text-muted-foreground font-mono">
              Tồn kho: {product.quantity}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'category',
    header: ({ column }) => <ColumnHeader column={column} title="Danh Mục" />,
    cell: ({ row }) => {
      const category = row.original.category;
      return <span className="text-sm text-muted-foreground">{category?.name || '—'}</span>;
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <ColumnHeader column={column} title="Giá" />,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <ColumnHeader column={column} title="Trạng Thái" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const label = status === 'ACTIVE' ? 'Hoạt Động' : status === 'HIDE' ? 'Ẩn' : status;
      const variant =
        status === 'ACTIVE' ? 'statusActive' : status === 'HIDE' ? 'statusHide' : 'statusDeleted';
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(product.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(product.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
