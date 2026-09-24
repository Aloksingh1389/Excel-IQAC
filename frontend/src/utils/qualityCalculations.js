// Quality Monitoring Calculation Utilities (Stage 5F)

import { INDICATOR_STATUS, QUALITY_INDICATOR_DEFINITIONS } from '../config/qualityIndicatorConfig';
import { getQualityScoreRating, QUALITY_WEIGHTS } from '../config/qualityScoreConfig';
import { COMPLIANCE_STATUS } from '../config/complianceConfig';

export const qualityCalculations = {
  calculatePercentage: (part, total) => {
    if (!total || total <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((part / total) * 100)));
  },

  calculateGap: (current, target) => {
    return Math.round((Number(current) || 0) - (Number(target) || 0));
  },

  calculateIndicatorStatus: (indicator, currentValue) => {
    if (currentValue === null || currentValue === undefined) return INDICATOR_STATUS.NOT_AVAILABLE;

    const val = Number(currentValue);
    const target = Number(indicator.target);
    const warning = Number(indicator.warningThreshold);
    const critical = Number(indicator.criticalThreshold);

    if (indicator.direction === 'HIGHER_IS_BETTER') {
      if (val >= target) return INDICATOR_STATUS.EXCELLENT;
      if (val >= warning) return INDICATOR_STATUS.GOOD;
      if (val >= critical) return INDICATOR_STATUS.WARNING;
      return INDICATOR_STATUS.CRITICAL;
    } else {
      // LOWER_IS_BETTER
      if (val <= target) return INDICATOR_STATUS.EXCELLENT;
      if (val <= warning) return INDICATOR_STATUS.GOOD;
      if (val <= critical) return INDICATOR_STATUS.WARNING;
      return INDICATOR_STATUS.CRITICAL;
    }
  },

  calculateQualityScore: (metrics = {}) => {
    const indicatorPerf = Number(metrics.indicatorPerformance) || 80;
    const complianceRate = Number(metrics.complianceRate) || 85;
    const evidenceRate = Number(metrics.evidenceCompleteness) || 82;
    const actionRate = Number(metrics.actionClosureRate) || 88;
    const subVerification = Number(metrics.submissionVerificationRate) || 90;

    const weightedScore =
      indicatorPerf * QUALITY_WEIGHTS.INDICATOR_PERFORMANCE +
      complianceRate * QUALITY_WEIGHTS.COMPLIANCE_RATE +
      evidenceRate * QUALITY_WEIGHTS.EVIDENCE_COMPLETENESS +
      actionRate * QUALITY_WEIGHTS.ACTION_CLOSURE_RATE +
      subVerification * QUALITY_WEIGHTS.SUBMISSION_VERIFICATION;

    const score = Math.round(weightedScore);
    const rating = getQualityScoreRating(score);

    return {
      score,
      rating: rating.label,
      classes: rating.classes,
      breakdown: {
        indicatorPerf,
        complianceRate,
        evidenceRate,
        actionRate,
        subVerification,
      },
    };
  },

  calculateTrend: (current, previous, direction = 'HIGHER_IS_BETTER') => {
    if (previous === null || previous === undefined) return 'NO_DATA';
    const diff = Number(current) - Number(previous);
    if (Math.abs(diff) < 0.1) return 'STABLE';

    if (direction === 'HIGHER_IS_BETTER') {
      return diff > 0 ? 'UP' : 'DOWN';
    } else {
      return diff < 0 ? 'UP' : 'DOWN';
    }
  },
};
