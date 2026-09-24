// Centralized Evidence Configuration (Stage 5D)

export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_FILE_TYPES = ['PDF', 'JPG', 'JPEG', 'PNG', 'DOC', 'DOCX', 'XLS', 'XLSX'];

export const EVIDENCE_STATUS = {
  UPLOADED: 'UPLOADED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  RETURNED: 'RETURNED',
  RESUBMITTED: 'RESUBMITTED',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
};

export const EVIDENCE_STATUS_CONFIG = {
  UPLOADED: {
    label: 'UPLOADED',
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
  VERIFIED: {
    label: 'VERIFIED',
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold shadow-2xs',
    dot: 'bg-emerald-500',
  },
  REJECTED: {
    label: 'REJECTED',
    classes: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
};

export const EVIDENCE_TYPES = {
  CERTIFICATE: 'CERTIFICATE',
  APPOINTMENT_LETTER: 'APPOINTMENT_LETTER',
  EXPERIENCE_DOCUMENT: 'EXPERIENCE_DOCUMENT',
  DEGREE_CERTIFICATE: 'DEGREE_CERTIFICATE',
  FDP_CERTIFICATE: 'FDP_CERTIFICATE',
  TRAINING_CERTIFICATE: 'TRAINING_CERTIFICATE',
  PUBLICATION_PROOF: 'PUBLICATION_PROOF',
  PATENT_DOCUMENT: 'PATENT_DOCUMENT',
  RESEARCH_DOCUMENT: 'RESEARCH_DOCUMENT',
  PROJECT_DOCUMENT: 'PROJECT_DOCUMENT',
  CONSULTANCY_DOCUMENT: 'CONSULTANCY_DOCUMENT',
  AWARD_CERTIFICATE: 'AWARD_CERTIFICATE',
  ACHIEVEMENT_CERTIFICATE: 'ACHIEVEMENT_CERTIFICATE',
  EVENT_DOCUMENT: 'EVENT_DOCUMENT',
  DEPARTMENT_REPORT: 'DEPARTMENT_REPORT',
  IQAC_DOCUMENT: 'IQAC_DOCUMENT',
  OTHER: 'OTHER',
};

export const EVIDENCE_TYPE_LABELS = {
  CERTIFICATE: 'Participation Certificate',
  APPOINTMENT_LETTER: 'Appointment Letter',
  EXPERIENCE_DOCUMENT: 'Experience & Service Record',
  DEGREE_CERTIFICATE: 'Degree & Qualification Certificate',
  FDP_CERTIFICATE: 'FDP / Training Certificate',
  TRAINING_CERTIFICATE: 'Specialized Training Certificate',
  PUBLICATION_PROOF: 'Publication Proof (DOI / Scopus / Journal)',
  PATENT_DOCUMENT: 'Patent Application / Grant Document',
  RESEARCH_DOCUMENT: 'Research Project Sanction Letter',
  PROJECT_DOCUMENT: 'Project Completion / UC Certificate',
  CONSULTANCY_DOCUMENT: 'Consultancy MoU / Payment Proof',
  AWARD_CERTIFICATE: 'Award / Honor Certificate',
  ACHIEVEMENT_CERTIFICATE: 'Student Achievement Certificate',
  EVENT_DOCUMENT: 'Event Report & Geo-Tagged Photos',
  DEPARTMENT_REPORT: 'Department Quarterly Report',
  IQAC_DOCUMENT: 'IQAC Compliance / Audit Record',
  OTHER: 'General Supporting Document',
};
