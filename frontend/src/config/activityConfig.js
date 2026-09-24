// Centralized IQAC Activity & Action Item Configuration (Stage 5E)

export const ACTIVITY_STATUS = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED',
  OVERDUE: 'OVERDUE',
};

export const ACTIVITY_STATUS_CONFIG = {
  PLANNED: {
    label: 'PLANNED',
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  IN_PROGRESS: {
    label: 'IN PROGRESS',
    classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  COMPLETED: {
    label: 'COMPLETED',
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
    dot: 'bg-emerald-500',
  },
  ON_HOLD: {
    label: 'ON HOLD',
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  CANCELLED: {
    label: 'CANCELLED',
    classes: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
  OVERDUE: {
    label: 'OVERDUE',
    classes: 'bg-rose-50 text-rose-800 border-rose-200 font-extrabold',
    dot: 'bg-rose-500',
  },
};

export const ACTION_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
};

export const ACTION_STATUS_CONFIG = {
  OPEN: {
    label: 'OPEN',
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  IN_PROGRESS: {
    label: 'IN PROGRESS',
    classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  COMPLETED: {
    label: 'COMPLETED',
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
    dot: 'bg-emerald-500',
  },
  OVERDUE: {
    label: 'OVERDUE',
    classes: 'bg-rose-50 text-rose-800 border-rose-200 font-extrabold',
    dot: 'bg-rose-500',
  },
  CANCELLED: {
    label: 'CANCELLED',
    classes: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
};

export const ACTIVITY_CATEGORIES = {
  ACADEMIC_QUALITY: 'ACADEMIC_QUALITY',
  FACULTY_DEVELOPMENT: 'FACULTY_DEVELOPMENT',
  STUDENT_DEVELOPMENT: 'STUDENT_DEVELOPMENT',
  RESEARCH: 'RESEARCH',
  FEEDBACK: 'FEEDBACK',
  AUDIT: 'AUDIT',
  ACCREDITATION: 'ACCREDITATION',
  TRAINING: 'TRAINING',
  QUALITY_IMPROVEMENT: 'QUALITY_IMPROVEMENT',
  OTHER: 'OTHER',
};

export const ACTIVITY_CATEGORY_LABELS = {
  ACADEMIC_QUALITY: 'Academic Quality Assurance',
  FACULTY_DEVELOPMENT: 'Faculty Development Initiative',
  STUDENT_DEVELOPMENT: 'Student Excellence & Skill Drive',
  RESEARCH: 'Research Promotion Drive',
  FEEDBACK: 'Stakeholder Feedback Collection',
  AUDIT: 'Internal Quality Audit',
  ACCREDITATION: 'NAAC / NBA Accreditation Readiness',
  TRAINING: 'Skill & Pedagogy Training',
  QUALITY_IMPROVEMENT: 'Institutional Quality Improvement',
  OTHER: 'General IQAC Activity',
};
