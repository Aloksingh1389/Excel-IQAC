// Centralized IQAC Meeting Configuration (Stage 5E)

export const MEETING_STATUS = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  MINUTES_PENDING: 'MINUTES_PENDING',
  MINUTES_FINALIZED: 'MINUTES_FINALIZED',
};

export const MEETING_STATUS_CONFIG = {
  DRAFT: {
    label: 'DRAFT',
    classes: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  SCHEDULED: {
    label: 'SCHEDULED',
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  IN_PROGRESS: {
    label: 'IN PROGRESS',
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  COMPLETED: {
    label: 'COMPLETED',
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  MINUTES_PENDING: {
    label: 'MINUTES PENDING',
    classes: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
  },
  MINUTES_FINALIZED: {
    label: 'MINUTES FINALIZED',
    classes: 'bg-teal-50 text-teal-800 border-teal-300 font-extrabold shadow-2xs',
    dot: 'bg-teal-500',
  },
};

export const MEETING_TYPES = {
  IQAC_GENERAL: 'IQAC_GENERAL',
  IQAC_REVIEW: 'IQAC_REVIEW',
  DEPARTMENT_IQAC: 'DEPARTMENT_IQAC',
  QUALITY_REVIEW: 'QUALITY_REVIEW',
  SPECIAL_MEETING: 'SPECIAL_MEETING',
  EMERGENCY_MEETING: 'EMERGENCY_MEETING',
};

export const MEETING_TYPE_LABELS = {
  IQAC_GENERAL: 'IQAC General Meeting',
  IQAC_REVIEW: 'IQAC Quarterly Review',
  DEPARTMENT_IQAC: 'Department IQAC Review',
  QUALITY_REVIEW: 'Academic Quality Review',
  SPECIAL_MEETING: 'Special Advisory Meeting',
  EMERGENCY_MEETING: 'Emergency Quality Audit',
};

export const MEETING_MODES = {
  PHYSICAL: 'PHYSICAL',
  ONLINE: 'ONLINE',
  HYBRID: 'HYBRID',
};

export const AGENDA_STATUS = {
  PENDING: 'PENDING',
  DISCUSSED: 'DISCUSSED',
  DEFERRED: 'DEFERRED',
  CLOSED: 'CLOSED',
};

export const MINUTES_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  FINALIZED: 'FINALIZED',
};
