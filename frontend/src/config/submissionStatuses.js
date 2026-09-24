// Centralized Submission Status Enum and Visual Configurations (Stage 5C)

export const SUBMISSION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  RETURNED: 'RETURNED',
  RESUBMITTED: 'RESUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  VERIFIED: 'VERIFIED',
};

export const SUBMISSION_STATUS_CONFIG = {
  DRAFT: {
    label: 'DRAFT',
    classes: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  SUBMITTED: {
    label: 'SUBMITTED',
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  UNDER_REVIEW: {
    label: 'UNDER REVIEW',
    classes: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
  },
  RETURNED: {
    label: 'RETURNED',
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  RESUBMITTED: {
    label: 'RESUBMITTED',
    classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  APPROVED: {
    label: 'APPROVED',
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  REJECTED: {
    label: 'REJECTED',
    classes: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  VERIFIED: {
    label: 'VERIFIED',
    classes: 'bg-teal-50 text-teal-800 border-teal-300 font-extrabold shadow-2xs',
    dot: 'bg-teal-500',
  },
};
