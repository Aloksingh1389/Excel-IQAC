import React, { forwardRef } from 'react';
import { Search, X, UploadCloud, AlertCircle } from 'lucide-react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  required = false,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input_${label ? label.replace(/\s+/g, '_').toLowerCase() : Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full text-sm rounded-lg border bg-white px-3.5 py-2 transition-colors text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
            Icon ? 'pl-9' : ''
          } ${error ? 'border-rose-300 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20' : 'border-slate-300'} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error.message || error}</span>
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

export const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  placeholder = 'Select an option',
  id,
  ...props
}, ref) => {
  const selectId = id || `select_${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`w-full text-sm rounded-lg border bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed ${
          error ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600">{error.message || error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
});

export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  rows = 3,
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea_${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`w-full text-sm rounded-lg border bg-white px-3.5 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20' : 'border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error.message || error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
});

export const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search records...',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-1.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export const FileInput = forwardRef(({
  label,
  error,
  helperText = 'PDF, DOCX, PNG up to 10MB',
  required = false,
  fileName = '',
  onChange,
  className = '',
  id,
  accept = '.pdf,.docx,.doc,.png,.jpg,.jpeg',
  ...props
}, ref) => {
  const fileId = id || `file_${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={fileId} className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <label
        htmlFor={fileId}
        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition hover:bg-slate-50 ${
          error ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300 bg-white'
        } ${className}`}
      >
        <UploadCloud className="w-6 h-6 text-blue-600 mb-1.5" />
        <span className="text-xs font-semibold text-slate-800">
          {fileName ? fileName : 'Click to select or drag & drop evidence file'}
        </span>
        <span className="text-[11px] text-slate-500 mt-0.5">{helperText}</span>
        <input
          ref={ref}
          id={fileId}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onChange}
          {...props}
        />
      </label>
      {error && <p className="mt-1 text-xs text-rose-600">{error.message || error}</p>}
    </div>
  );
});

export const Checkbox = forwardRef(({
  label,
  description,
  id,
  className = '',
  ...props
}, ref) => {
  const checkboxId = id || `checkbox_${Math.random()}`;

  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        {...props}
      />
      <div className="text-xs">
        <label htmlFor={checkboxId} className="font-semibold text-slate-800 cursor-pointer">
          {label}
        </label>
        {description && <p className="text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
  );
});
