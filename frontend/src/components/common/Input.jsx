import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      name,
      value,
      onChange,
      placeholder = '',
      error = null,
      helperText = null,
      icon: Icon = null,
      required = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div className={`w-full space-y-1.5 ${className}`}>
        {label && (
          <label className="block text-xs font-semibold text-slate-700 select-none">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative rounded-lg shadow-2xs">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
          )}

          <input
            ref={ref}
            type={computedType}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
              Icon ? 'pl-9' : 'pl-3.5'
            } ${isPassword ? 'pr-10' : 'pr-3.5'} py-2 ${
              errorMessage
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 hover:border-slate-400'
            }`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
        )}

        {helperText && !errorMessage && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Select = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      options = [],
      placeholder = 'Select option...',
      error = null,
      helperText = null,
      required = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div className={`w-full space-y-1.5 ${className}`}>
        {label && (
          <label className="block text-xs font-semibold text-slate-700 select-none">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative rounded-lg shadow-2xs">
          <select
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full text-sm bg-white text-slate-900 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed pl-3.5 pr-8 py-2 appearance-none cursor-pointer ${
              errorMessage
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 hover:border-slate-400'
            }`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt, idx) => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={idx} value={optValue}>
                  {optLabel}
                </option>
              );
            })}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
        )}

        {helperText && !errorMessage && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
