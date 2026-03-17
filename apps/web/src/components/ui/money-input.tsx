import * as React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

function formatVND(value: number | string): string {
  const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value;
  if (!num && num !== 0) return '';
  return num.toLocaleString('vi-VN');
}

function parseVND(formatted: string): number {
  return parseInt(formatted.replace(/\D/g, ''), 10) || 0;
}

interface MoneyInputProps {
  name: string;
  id?: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  error?: boolean;
}

function MoneyInput({ name, id, value, onChange, className, error }: MoneyInputProps) {
  const [display, setDisplay] = React.useState(() => formatVND(value));

  React.useEffect(() => {
    setDisplay(value ? formatVND(value) : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = parseVND(raw);
    setDisplay(num ? formatVND(num) : '');
    onChange(num);
  };

  const handleBlur = () => {
    setDisplay(value ? formatVND(value) : '');
  };

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0"
        className={cn('pr-8 text-gray-700 bg-white', error ? 'border-destructive' : 'border-gray-300', className)}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">₫</span>
      <input type="hidden" name={name} value={value || 0} />
    </div>
  );
}

export { MoneyInput, formatVND, parseVND };
