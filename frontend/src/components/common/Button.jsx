import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success'
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60';

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs gap-1.5',
    sm: 'px-3 py-1.5 text-xs gap-2',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-xs focus:ring-indigo-500 border border-transparent',
    secondary:
      'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 focus:ring-slate-400 border border-slate-200',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-indigo-500',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs focus:ring-rose-500 border border-transparent',
    success:
      'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs focus:ring-emerald-500 border border-transparent',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-0.5 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      )}

      {children}

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
};

export const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  onClick,
  label,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    xs: 'p-1 text-xs',
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-2.5 text-lg',
  };

  const variantStyles = {
    ghost: 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg',
    outline: 'text-slate-600 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg',
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[variant] || variantStyles.ghost} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
};
