import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  onClick = null,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 shadow-2xs transition-all ${
        hover ? 'hover:border-slate-300 hover:shadow-xs cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Badge = ({
  children,
  variant = 'neutral', // 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size = 'sm', // 'xs' | 'sm' | 'md'
  className = '',
}) => {
  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md ${
        sizeStyles[size] || sizeStyles.sm
      } ${variantStyles[variant] || variantStyles.neutral} ${className}`}
    >
      {children}
    </span>
  );
};

export const Avatar = ({
  src = null,
  name = 'User',
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().replace(/^Dr\.\s*|^Prof\.\s*/i, '').split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeMap[size] || sizeMap.md} rounded-full object-cover border border-slate-200 ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={`inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200 shrink-0 select-none ${
        sizeMap[size] || sizeMap.md
      } ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
