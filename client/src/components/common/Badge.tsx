import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'amber' | 'blue' | 'rose' | 'slate' | 'purple' | 'category' | 'confidence';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  confidenceValue?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  size = 'md',
  className = '',
  confidenceValue,
}) => {
  let colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (variant === 'confidence' && confidenceValue) {
    const val = confidenceValue.toLowerCase();
    if (val.includes('high')) {
      colorStyles = 'bg-emerald-100/90 text-emerald-800 border-emerald-300 font-semibold';
    } else if (val.includes('moderate')) {
      colorStyles = 'bg-blue-100/90 text-blue-800 border-blue-300 font-semibold';
    } else {
      colorStyles = 'bg-amber-100/90 text-amber-800 border-amber-300 font-semibold';
    }
  } else {
    switch (variant) {
      case 'amber':
        colorStyles = 'bg-amber-50 text-amber-800 border-amber-200';
        break;
      case 'blue':
        colorStyles = 'bg-sky-50 text-sky-800 border-sky-200';
        break;
      case 'rose':
        colorStyles = 'bg-rose-50 text-rose-800 border-rose-200';
        break;
      case 'purple':
        colorStyles = 'bg-purple-50 text-purple-800 border-purple-200';
        break;
      case 'slate':
        colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';
        break;
      case 'category':
        colorStyles = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-medium';
        break;
      default:
        colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide ${sizeStyles} ${colorStyles} ${className}`}
    >
      {children}
    </span>
  );
};
