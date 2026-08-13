import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  FileEdit, 
  Send, 
  AlertTriangle, 
  ShieldAlert, 
  Ban, 
  CheckCheck
} from 'lucide-react';

const STATUS_CONFIGS = {
  PENDING: {
    label: 'Pending',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: Clock,
  },
  ACTIVE: {
    label: 'Active',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  APPROVED: {
    label: 'Approved',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  VERIFIED: {
    label: 'Verified',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    icon: CheckCheck,
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    icon: XCircle,
  },
  SUSPENDED: {
    label: 'Suspended',
    bg: 'bg-red-100 text-red-800 border-red-300',
    dot: 'bg-red-600',
    icon: ShieldAlert,
  },
  DEACTIVATED: {
    label: 'Deactivated',
    bg: 'bg-slate-100 text-slate-700 border-slate-300',
    dot: 'bg-slate-500',
    icon: Ban,
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
    icon: Clock,
  },
  DRAFT: {
    label: 'Draft',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    icon: FileEdit,
  },
  SUBMITTED: {
    label: 'Submitted',
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
    icon: Send,
  },
  CORRECTION_REQUIRED: {
    label: 'Correction Required',
    bg: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
    icon: AlertTriangle,
  },
  RESUBMITTED: {
    label: 'Resubmitted',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    icon: Send,
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  SCHEDULED: {
    label: 'Scheduled',
    bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    dot: 'bg-cyan-500',
    icon: Clock,
  },
};

export const StatusBadge = ({
  status = 'PENDING',
  size = 'sm',
  showDot = true,
  showIcon = false,
  customLabel = null,
  className = '',
}) => {
  const normKey = String(status || '').toUpperCase().trim();
  const config = STATUS_CONFIGS[normKey] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    icon: AlertCircle,
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-semibold',
  };

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {showDot && !showIcon && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      )}
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{customLabel || config.label}</span>
    </span>
  );
};
