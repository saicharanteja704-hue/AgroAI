import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  padding = 'md',
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding];

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-md transition-shadow relative overflow-hidden ${
        glow ? 'gradient-card-glow' : ''
      } ${paddingStyles} ${className}`}
    >
      {children}
    </div>
  );
};
