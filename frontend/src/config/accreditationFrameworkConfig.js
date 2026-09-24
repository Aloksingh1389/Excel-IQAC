// Centralized NAAC & Accreditation Framework Configuration (Stage 5G)

export const ACCREDITATION_FRAMEWORKS = {
  NAAC: {
    id: 'NAAC',
    name: 'National Assessment and Accreditation Council',
    shortName: 'NAAC',
    version: 'V1',
    enabled: true,
    criteriaCount: 7,
    description: 'Representative NAAC-aligned prototype accreditation framework for autonomous colleges.',
  },
};

export const METRIC_TYPES = {
  QUANTITATIVE: 'QUANTITATIVE',
  QUALITATIVE: 'QUALITATIVE',
  DOCUMENTARY: 'DOCUMENTARY',
  EVIDENCE_BASED: 'EVIDENCE_BASED',
  COMPLIANCE: 'COMPLIANCE',
  COMPOSITE: 'COMPOSITE',
};

export const METRIC_READINESS_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  DATA_PENDING: 'DATA_PENDING',
  EVIDENCE_PENDING: 'EVIDENCE_PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  PARTIALLY_READY: 'PARTIALLY_READY',
  READY: 'READY',
  VERIFIED: 'VERIFIED',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
};

export const METRIC_READINESS_CONFIG = {
  VERIFIED: {
    label: 'VERIFIED & READY',
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold shadow-2xs',
    dot: 'bg-emerald-500',
  },
  READY: {
    label: 'READY FOR AUDIT',
    classes: 'bg-teal-50 text-teal-800 border-teal-200 font-bold',
    dot: 'bg-teal-500',
  },
  PARTIALLY_READY: {
    label: 'PARTIALLY READY',
    classes: 'bg-blue-50 text-blue-800 border-blue-200 font-bold',
    dot: 'bg-blue-500',
  },
  UNDER_REVIEW: {
    label: 'UNDER REVIEW',
    classes: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
  },
  EVIDENCE_PENDING: {
    label: 'EVIDENCE PENDING',
    classes: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
    dot: 'bg-amber-500',
  },
  DATA_PENDING: {
    label: 'DATA PENDING',
    classes: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
    dot: 'bg-amber-500',
  },
  NOT_STARTED: {
    label: 'NOT STARTED',
    classes: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  NOT_APPLICABLE: {
    label: 'N/A',
    classes: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
  },
};

export const NAAC_CRITERIA_DEFINITIONS = [
  {
    id: 'NAAC-C1',
    frameworkId: 'NAAC',
    code: 'C1',
    number: 1,
    name: 'Curricular Aspects',
    shortTitle: 'Curriculum & Pedagogy',
    description: 'Curriculum design, academic flexibility, feedback system, and course outcomes alignment.',
    weightage: 150,
    ownerRole: 'IQAC_HEAD',
    displayOrder: 1,
  },
  {
    id: 'NAAC-C2',
    frameworkId: 'NAAC',
    code: 'C2',
    number: 2,
    name: 'Teaching-Learning and Evaluation',
    shortTitle: 'Teaching & Evaluation',
    description: 'Student enrollment, faculty profile, learning process, CO-PO attainment, and evaluation reforms.',
    weightage: 200,
    ownerRole: 'DEAN',
    displayOrder: 2,
  },
  {
    id: 'NAAC-C3',
    frameworkId: 'NAAC',
    code: 'C3',
    number: 3,
    name: 'Research, Innovations and Extension',
    shortTitle: 'Research & Grants',
    description: 'Funded research projects, patents, Scopus/SCI journal publications, and extension activities.',
    weightage: 250,
    ownerRole: 'IQAC_HEAD',
    displayOrder: 3,
  },
  {
    id: 'NAAC-C4',
    frameworkId: 'NAAC',
    code: 'C4',
    number: 4,
    name: 'Infrastructure and Learning Resources',
    shortTitle: 'Infrastructure & Library',
    description: 'Classroom facilities, laboratories, digital library, ICT infrastructure, and maintenance.',
    weightage: 100,
    ownerRole: 'DEAN',
    displayOrder: 4,
  },
  {
    id: 'NAAC-C5',
    frameworkId: 'NAAC',
    code: 'C5',
    number: 5,
    name: 'Student Support and Progression',
    shortTitle: 'Student Support & Placement',
    description: 'Scholarships, placement rate, higher education progression, alumni engagement, and sports.',
    weightage: 100,
    ownerRole: 'HOD',
    displayOrder: 5,
  },
  {
    id: 'NAAC-C6',
    frameworkId: 'NAAC',
    code: 'C6',
    number: 6,
    name: 'Governance, Leadership and Management',
    shortTitle: 'Governance & IQAC',
    description: 'Institutional vision, faculty welfare, financial management, IQAC meetings & quality audits.',
    weightage: 100,
    ownerRole: 'IQAC_HEAD',
    displayOrder: 6,
  },
  {
    id: 'NAAC-C7',
    frameworkId: 'NAAC',
    code: 'C7',
    number: 7,
    name: 'Institutional Values and Best Practices',
    shortTitle: 'Values & Best Practices',
    description: 'Gender equity, environmental sustainability, energy audits, green campus, and distinctiveness.',
    weightage: 100,
    ownerRole: 'IQAC_HEAD',
    displayOrder: 7,
  },
];
