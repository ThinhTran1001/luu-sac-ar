'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ProductDto } from '@luu-sac/shared';
import { ColumnHeader } from '@/components/common/ColumnHeader';
import Image from 'next/image';

export const columns: ColumnDef<ProductDto>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <ColumnHeader column={column} title="Product" />,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {product.thumbnailImage ? (
              <Image
                className="h-10 w-10 rounded-full object-cover"
                src={product.thumbnailImage}
                alt={product.name}
                width={40}
                height={40}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">Stock: {product.quantity}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <ColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
      return <div className="text-sm text-gray-900">{formatted}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="text-right">
          <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
          <button className="text-red-600 hover:text-red-900">Delete</button>
        </div>
      );
    },
  },
];
