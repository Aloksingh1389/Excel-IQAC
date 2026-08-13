import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-blue-600 focus:ring-blue-500',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm focus:ring-slate-400',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-emerald-600 focus:ring-emerald-500',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-rose-600 focus:ring-rose-500',
  warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm border border-amber-600 focus:ring-amber-500',
  outline: 'bg-transparent hover:bg-blue-50 text-blue-700 border border-blue-600 focus:ring-blue-500',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-400 border border-transparent',
};

const SIZES = {
  xs: 'px-2.5 py-1 text-xs rounded-md font-medium',
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
  md: 'px-4 py-2 text-sm font-semibold rounded-lg',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const variantStyles = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyles = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  title = '',
  onClick,
  ...props
}) => {
  const variantStyles = VARIANTS[variant] || VARIANTS.ghost;
  const sizeMap = {
    xs: 'p-1 rounded text-xs',
    sm: 'p-1.5 rounded-md text-xs',
    md: 'p-2 rounded-lg text-sm',
    lg: 'p-2.5 rounded-xl text-base',
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 ${variantStyles} ${sizeMap[size] || sizeMap.md} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex items-center rounded-lg shadow-sm ${className}`} role="group">
      {children}
    </div>
  );
};
