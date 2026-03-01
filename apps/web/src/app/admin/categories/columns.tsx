'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CategoryDto } from '@luu-sac/shared';
import { ColumnHeader } from '@/components/common/ColumnHeader';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CategoryColumnsProps {
  onDelete: (id: string) => void;
}

export const getCategoryColumns = ({
  onDelete,
}: CategoryColumnsProps): ColumnDef<CategoryDto>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => <ColumnHeader column={column} title="Danh Mục" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <ColumnHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground font-mono">{row.getValue('id')}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onDelete(category.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Xóa Danh Mục
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
