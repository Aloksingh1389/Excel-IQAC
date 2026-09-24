// Centralized Accreditation Framework & Criteria Management Service for Stage 5G

import { ACCREDITATION_FRAMEWORKS, NAAC_CRITERIA_DEFINITIONS, METRIC_READINESS_STATUS } from '../config/accreditationFrameworkConfig';
import { MOCK_ACCREDITATION_METRICS } from '../data/mockAccreditationMetrics';
import { MOCK_ACCREDITATION_GAPS } from '../data/mockAccreditationGaps';
import { accreditationCalculations } from '../utils/accreditationCalculations';
import { ROLES } from '../config/roles';
import { storage } from '../utils/storage';

const STORAGE_KEY = 'excel_iqac_accreditation_metrics';

const getStoredMetrics = () => {
  const data = storage.get(STORAGE_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) {
    storage.set(STORAGE_KEY, MOCK_ACCREDITATION_METRICS);
    return MOCK_ACCREDITATION_METRICS;
  }
  return data;
};

const SIMULATED_LATENCY_MS = 150;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const accreditationService = {
  getAccessibleMetrics: (user, list = null) => {
    if (!user) return [];
    const metrics = list || getStoredMetrics();
    const role = user.role;

    if (
      role === ROLES.TECHNICAL_DIRECTOR ||
      role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
      role === ROLES.INSTITUTION_ADMIN ||
      role === ROLES.IQAC_HEAD ||
      role === ROLES.IQAC_MEMBER
    ) {
      return metrics;
    }

    if (role === ROLES.DEAN) {
      const assignedCodes = user.assignedDepartments || ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
      return metrics.filter((m) => m.applicableScope === 'INSTITUTION' || assignedCodes.includes(m.assignedDepartment));
    }

    if (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) {
      const userDeptCode = user.departmentCode || 'CSE';
      return metrics.filter((m) => m.applicableScope === 'INSTITUTION' || m.assignedDepartment === userDeptCode);
    }

    if (role === ROLES.STAFF) {
      return metrics.filter((m) => m.assignedDepartment === user.departmentCode || m.assignedOwner === user.name);
    }

    return metrics;
  },

  getAccreditationSummary: async (user) => {
    await delay();
    const metrics = accreditationService.getAccessibleMetrics(user);

    const criteriaList = NAAC_CRITERIA_DEFINITIONS.map((c) => {
      const cMetrics = metrics.filter((m) => m.criterionId === c.id);
      return accreditationCalculations.calculateCriterionReadiness(c, cMetrics);
    });

    const frameworkReadiness = accreditationCalculations.calculateFrameworkReadiness(criteriaList);

    return {
      success: true,
      data: {
        framework: ACCREDITATION_FRAMEWORKS.NAAC,
        readiness: frameworkReadiness,
        criteria: criteriaList,
        gapsCount: MOCK_ACCREDITATION_GAPS.length,
      },
    };
  },

  getCriteria: async (user) => {
    await delay();
    const metrics = accreditationService.getAccessibleMetrics(user);

    const data = NAAC_CRITERIA_DEFINITIONS.map((c) => {
      const cMetrics = metrics.filter((m) => m.criterionId === c.id);
      const calc = accreditationCalculations.calculateCriterionReadiness(c, cMetrics);
      return {
        ...c,
        readiness: calc,
        metrics: cMetrics,
      };
    });

    return { success: true, data };
  },

  getCriterionById: async (criterionId, user) => {
    await delay();
    const c = NAAC_CRITERIA_DEFINITIONS.find((cr) => cr.id === criterionId || cr.code === criterionId);
    if (!c) throw new Error('Criterion record not found.');

    const metrics = accreditationService.getAccessibleMetrics(user);
    const cMetrics = metrics.filter((m) => m.criterionId === c.id);
    const calc = accreditationCalculations.calculateCriterionReadiness(c, cMetrics);

    return {
      success: true,
      data: {
        ...c,
        readiness: calc,
        metrics: cMetrics,
      },
    };
  },

  getMetrics: async (filters = {}, user) => {
    await delay();
    const accessible = accreditationService.getAccessibleMetrics(user);
    const { searchQuery, criterionFilter, statusFilter, deptFilter } = filters;

    let result = accessible;

    if (criterionFilter && criterionFilter !== 'ALL') {
      result = result.filter((m) => m.criterionId === criterionFilter || m.code.startsWith(criterionFilter));
    }

    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((m) => m.readinessStatus === statusFilter);
    }

    if (deptFilter && deptFilter !== 'ALL') {
      result = result.filter((m) => m.assignedDepartment === deptFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.code.toLowerCase().includes(q) ||
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }

    return { success: true, data: result };
  },

  getMetricById: async (metricId, user) => {
    await delay();
    const accessible = accreditationService.getAccessibleMetrics(user);
    const m = accessible.find((item) => item.id === metricId || item.code === metricId);
    if (!m) throw new Error('Accreditation metric record not found.');
    return { success: true, data: m };
  },

  getAccreditationGaps: async (filters = {}, user) => {
    await delay();
    const { gapType, priorityFilter } = filters;
    let result = MOCK_ACCREDITATION_GAPS;

    if (gapType && gapType !== 'ALL') {
      result = result.filter((g) => g.type === gapType);
    }

    if (priorityFilter && priorityFilter !== 'ALL') {
      result = result.filter((g) => g.priority === priorityFilter);
    }

    return { success: true, data: result };
  },

  // Functions prepared for Stage 5H Auto-AQAR PDF/Word Generator Consumption
  getCriterionReportData: async (criterionId) => {
    const res = await accreditationService.getCriterionById(criterionId, { role: ROLES.IQAC_HEAD });
    return res.data;
  },

  getAccreditationSummaryReportData: async () => {
    const res = await accreditationService.getAccreditationSummary({ role: ROLES.IQAC_HEAD });
    return res.data;
  },
};
