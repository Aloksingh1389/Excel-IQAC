// Centralized Quality Monitoring Service for Stage 5F

import { MOCK_QUALITY_INDICATORS } from '../data/mockQualityIndicators';
import { MOCK_QUALITY_SNAPSHOTS } from '../data/mockQualitySnapshots';
import { QUALITY_INDICATOR_CATEGORIES, INDICATOR_STATUS } from '../config/qualityIndicatorConfig';
import { getQualityScoreRating } from '../config/qualityScoreConfig';
import { qualityCalculations } from '../utils/qualityCalculations';
import { ROLES } from '../config/roles';
import { storage } from '../utils/storage';

const STORAGE_KEY = 'excel_iqac_quality_indicators';

const getStoredIndicators = () => {
  const data = storage.get(STORAGE_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) {
    storage.set(STORAGE_KEY, MOCK_QUALITY_INDICATORS);
    return MOCK_QUALITY_INDICATORS;
  }
  return data;
};

const SIMULATED_LATENCY_MS = 150;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const qualityService = {
  getAccessibleIndicators: (user, list = null) => {
    if (!user) return [];
    const indicators = list || getStoredIndicators();
    const role = user.role;

    if (
      role === ROLES.TECHNICAL_DIRECTOR ||
      role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
      role === ROLES.INSTITUTION_ADMIN ||
      role === ROLES.IQAC_HEAD
    ) {
      return indicators;
    }

    if (role === ROLES.DEAN) {
      return indicators;
    }

    if (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) {
      return indicators;
    }

    return indicators;
  },

  getQualitySummary: async (user, academicYear = '2025-26') => {
    await delay();
    const indicators = qualityService.getAccessibleIndicators(user);

    const calcResult = qualityCalculations.calculateQualityScore({
      indicatorPerformance: 84,
      complianceRate: 88,
      evidenceCompleteness: 85,
      actionClosureRate: 86,
      submissionVerificationRate: 90,
    });

    const categoryScores = [
      { category: 'ACADEMIC', name: 'Academic Quality', score: 86, target: 85 },
      { category: 'FACULTY', name: 'Faculty Excellence', score: 88, target: 85 },
      { category: 'RESEARCH', name: 'Research & Grants', score: 74, target: 80 },
      { category: 'PUBLICATION', name: 'Publications', score: 82, target: 85 },
      { category: 'EVIDENCE', name: 'Evidence Verification', score: 91, target: 95 },
      { category: 'COMPLIANCE', name: 'Compliance Rate', score: 88, target: 90 },
      { category: 'IQAC_OPERATION', name: 'IQAC Operations', score: 86, target: 90 },
    ];

    const departmentScorecards = [
      { code: 'CSE', name: 'Computer Science & Engineering', score: 91, compliance: 94, evidence: 91, actions: 90, status: 'EXCELLENT' },
      { code: 'ECE', name: 'Electronics & Communication', score: 82, compliance: 82, evidence: 78, actions: 85, status: 'GOOD' },
      { code: 'EEE', name: 'Electrical & Electronics', score: 86, compliance: 88, evidence: 85, actions: 88, status: 'GOOD' },
      { code: 'MECH', name: 'Mechanical Engineering', score: 68, compliance: 61, evidence: 55, actions: 60, status: 'WARNING' },
      { code: 'CIVIL', name: 'Civil Engineering', score: 65, compliance: 58, evidence: 52, actions: 55, status: 'WARNING' },
      { code: 'IT', name: 'Information Technology', score: 88, compliance: 90, evidence: 88, actions: 89, status: 'GOOD' },
    ];

    return {
      success: true,
      data: {
        overallScore: calcResult.score,
        rating: calcResult.rating,
        classes: calcResult.classes,
        target: 85,
        gap: calcResult.score - 85,
        breakdown: calcResult.breakdown,
        categoryScores,
        departmentScorecards,
        indicatorsCount: indicators.length,
      },
    };
  },

  getQualityIndicators: async (filters = {}, user) => {
    await delay();
    const accessible = qualityService.getAccessibleIndicators(user);
    const { searchQuery, categoryFilter, statusFilter } = filters;

    let result = accessible;

    if (categoryFilter && categoryFilter !== 'ALL') {
      result = result.filter((ind) => ind.category === categoryFilter);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((ind) => ind.status === statusFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (ind) =>
          ind.code.toLowerCase().includes(q) ||
          ind.name.toLowerCase().includes(q) ||
          ind.description.toLowerCase().includes(q)
      );
    }

    return { success: true, data: result };
  },

  getQualityTrends: async (user) => {
    await delay();
    return { success: true, data: MOCK_QUALITY_SNAPSHOTS };
  },
};
