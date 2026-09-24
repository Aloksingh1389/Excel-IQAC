// Centralized Quality Score & Threshold Configuration (Stage 5F)

export const QUALITY_SCORE_RANGES = {
  EXCELLENT: { min: 90, max: 100, label: 'EXCELLENT', classes: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  GOOD: { min: 75, max: 89, label: 'GOOD', classes: 'bg-teal-100 text-teal-900 border-teal-300' },
  SATISFACTORY: { min: 60, max: 74, label: 'SATISFACTORY', classes: 'bg-blue-100 text-blue-900 border-blue-300' },
  WARNING: { min: 40, max: 59, label: 'NEEDS ATTENTION', classes: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold' },
  CRITICAL: { min: 0, max: 39, label: 'CRITICAL INTERVENTION', classes: 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold' },
};

export const QUALITY_WEIGHTS = {
  INDICATOR_PERFORMANCE: 0.30,
  COMPLIANCE_RATE: 0.25,
  EVIDENCE_COMPLETENESS: 0.20,
  ACTION_CLOSURE_RATE: 0.15,
  SUBMISSION_VERIFICATION: 0.10,
};

export const getQualityScoreRating = (score) => {
  const s = Math.round(Number(score) || 0);
  if (s >= 90) return QUALITY_SCORE_RANGES.EXCELLENT;
  if (s >= 75) return QUALITY_SCORE_RANGES.GOOD;
  if (s >= 60) return QUALITY_SCORE_RANGES.SATISFACTORY;
  if (s >= 40) return QUALITY_SCORE_RANGES.WARNING;
  return QUALITY_SCORE_RANGES.CRITICAL;
};
