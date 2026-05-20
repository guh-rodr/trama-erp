import { ReactNode } from 'react';

export interface BadgeProps {
  color: 'default' | 'success' | 'info' | 'error' | 'warning';
  children: ReactNode;
  className?: string;
}

const colorStyles: Record<BadgeProps['color'], string> = {
  default: 'bg-neutral-200/20 text-neutral-500 border-neutral-300',
  success: 'bg-emerald-200/20 text-emerald-500 border-emerald-300',
  info: 'bg-blue-200/20 text-blue-500 border-blue-300',
  error: 'bg-red-200/20 text-red-500 border-red-300',
  warning: 'bg-amber-200/20 text-amber-500 border-amber-300',
};

export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={`inline-flex gap-2 items-center px-2 py-0.5 font-medium text-xs border rounded-xl ${colorStyles[color]} ${className ?? ''}`}
    >
      {children}
    </span>
  );
}
