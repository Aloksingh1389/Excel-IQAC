// Centralized AQAR Report Configuration (Stage 5H)

export const AQAR_REPORT_STATUS = {
  DRAFT: 'DRAFT',
  DATA_GENERATED: 'DATA_GENERATED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  RETURNED: 'RETURNED',
  FINALIZED: 'FINALIZED',
  ARCHIVED: 'ARCHIVED',
};

export const AQAR_STATUS_CONFIG = {
  FINALIZED: {
    label: 'FINALIZED & APPROVED',
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold shadow-2xs',
    dot: 'bg-emerald-500',
  },
  UNDER_REVIEW: {
    label: 'UNDER IQAC REVIEW',
    classes: 'bg-violet-50 text-violet-700 border-violet-200 font-bold',
    dot: 'bg-violet-500',
  },
  DATA_GENERATED: {
    label: 'DATA POPULATED',
    classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  DRAFT: {
    label: 'DRAFT IN PROGRESS',
    classes: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
    dot: 'bg-amber-500',
  },
  RETURNED: {
    label: 'RETURNED FOR CORRECTION',
    classes: 'bg-rose-50 text-rose-800 border-rose-300 font-extrabold',
    dot: 'bg-rose-500',
  },
  ARCHIVED: {
    label: 'ARCHIVED',
    classes: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
};

export const AQAR_TEMPLATE_CONFIG = {
  frameworkId: 'NAAC',
  reportType: 'AQAR',
  version: 'PROTOTYPE-V1',
  title: 'Annual Quality Assurance Report (AQAR)',
  sections: [
    { id: 'cover', title: 'Cover Page & Institutional Profile', type: 'COVER', icon: 'Award' },
    { id: 'part_a', title: 'Part A — General Institutional Profile', type: 'INSTITUTION_PROFILE', icon: 'Building2' },
    { id: 'part_b_c1', title: 'Criterion 1 — Curricular Aspects', type: 'CRITERION', criterionId: 'NAAC-C1', icon: 'BookOpen' },
    { id: 'part_b_c2', title: 'Criterion 2 — Teaching-Learning and Evaluation', type: 'CRITERION', criterionId: 'NAAC-C2', icon: 'GraduationCap' },
    { id: 'part_b_c3', title: 'Criterion 3 — Research, Innovations and Extension', type: 'CRITERION', criterionId: 'NAAC-C3', icon: 'FlaskConical' },
    { id: 'part_b_c4', title: 'Criterion 4 — Infrastructure & Learning Resources', type: 'CRITERION', criterionId: 'NAAC-C4', icon: 'Building' },
    { id: 'part_b_c5', title: 'Criterion 5 — Student Support and Progression', type: 'CRITERION', criterionId: 'NAAC-C5', icon: 'Users' },
    { id: 'part_b_c6', title: 'Criterion 6 — Governance, Leadership & Management', type: 'CRITERION', criterionId: 'NAAC-C6', icon: 'ShieldCheck' },
    { id: 'part_b_c7', title: 'Criterion 7 — Institutional Values & Best Practices', type: 'CRITERION', criterionId: 'NAAC-C7', icon: 'HeartHandshake' },
    { id: 'initiatives', title: 'IQAC Quality Initiatives & Achievements', type: 'NARRATIVE', icon: 'Sparkles' },
    { id: 'best_practices', title: 'Institutional Best Practices & Distinctiveness', type: 'NARRATIVE', icon: 'Star' },
    { id: 'action_plan', title: 'Future Quality Action Plan for Next Academic Year', type: 'ACTION_PLAN', icon: 'Target' },
    { id: 'evidence_summary', title: 'Verified Evidence & Document Appendix', type: 'EVIDENCE_SUMMARY', icon: 'FileText' },
    { id: 'validation', title: 'AQAR Report Validation & Finalization', type: 'VALIDATION', icon: 'CheckCircle2' },
  ],
};
