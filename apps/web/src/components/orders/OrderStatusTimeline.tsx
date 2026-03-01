'use client';

import { OrderStatus } from '@luu-sac/shared';
import { Check, Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
}

const STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'PENDING', label: 'Chờ Thanh Toán', icon: Clock },
  { status: 'PAID', label: 'Đã Thanh Toán', icon: Check },
  { status: 'PROCESSING', label: 'Đang Xử Lý', icon: Package },
  { status: 'SHIPPING', label: 'Đang Giao Hàng', icon: Truck },
  { status: 'COMPLETED', label: 'Hoàn Thành', icon: CheckCircle },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING: 0,
  PAID: 1,
  PROCESSING: 2,
  SHIPPING: 3,
  COMPLETED: 4,
  CANCELLED: -1,
};

export function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
        <XCircle className="h-6 w-6 text-red-600 shrink-0" />
        <div>
          <p className="font-semibold text-red-800">Đơn Hàng Đã Hủy</p>
          <p className="text-sm text-red-600">Đơn hàng này đã bị hủy.</p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER[currentStatus];

  return (
    <div className="flex items-start justify-between">
      {STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.status} className="flex flex-col items-center flex-1 relative">
            {/* Connector line */}
            {index > 0 && (
              <div
                className={`absolute top-5 -left-1/2 w-full h-0.5 ${
                  index <= currentIndex ? 'bg-green-500' : 'bg-gray-200'
                }`}
                style={{ zIndex: 0 }}
              />
            )}

            {/* Circle icon */}
            <div
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-xs font-medium text-center ${
                isCompleted ? 'text-green-700' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
