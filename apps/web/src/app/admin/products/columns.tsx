'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ProductDto } from '@luu-sac/shared';
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

interface ProductColumnsProps {
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const getProductColumns = ({
  onDelete,
  onEdit,
}: ProductColumnsProps): ColumnDef<ProductDto>[] => [
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
      return (
        <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'} className="capitalize">
          {status.toLowerCase()}
        </Badge>
      );
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
              Chỉnh sửa chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(product.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Xóa sản phẩm
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
