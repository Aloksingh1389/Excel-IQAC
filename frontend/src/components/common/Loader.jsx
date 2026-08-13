import React from 'react';
import { Loader2, AlertCircle, FolderX, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const Loader = ({
  message = 'Loading data...',
  size = 'md',
  fullScreen = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-blue-600 mb-3`} />
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-xs flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export const Spinner = ({ size = 'sm', className = '' }) => {
  const sizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  return <Loader2 className={`${sizeMap[size] || sizeMap.sm} animate-spin ${className}`} />;
};

export const Skeleton = ({ className = '', rows = 1 }) => {
  if (rows > 1) {
    return (
      <div className="space-y-2.5 w-full">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-slate-200/80 rounded animate-pulse ${
              i === rows - 1 ? 'w-3/4' : 'w-full'
            } ${className}`}
          />
        ))}
      </div>
    );
  }
  return <div className={`bg-slate-200/80 rounded animate-pulse ${className}`} />;
};

export const EmptyState = ({
  title = 'No records found',
  description = 'There are no items to display at this time.',
  icon: Icon = FolderX,
  actionLabel = null,
  onAction = null,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-200 ${className}`}>
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Unable to complete your request. Please try again.',
  onRetry = null,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-xl border border-rose-200 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-950 mb-1">{title}</h3>
      <p className="text-sm text-rose-700 max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
