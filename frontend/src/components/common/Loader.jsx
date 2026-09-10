import React from 'react';
import { GraduationCap } from 'lucide-react';

export const Loader = ({ fullScreen = false, message = 'Loading institutional portal...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm animate-pulse">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div className="absolute -inset-1 rounded-2xl border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>

      <div className="space-y-1">
        <h2 className="text-sm font-bold text-slate-900 tracking-wider uppercase">IQAC Portal</h2>
        <p className="text-xs text-slate-500 font-medium">{message}</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50">
        {content}
      </div>
    );
  }

  return content;
};

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-indigo-600 border-t-transparent ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
      role="status"
      aria-label="loading"
    />
  );
};
