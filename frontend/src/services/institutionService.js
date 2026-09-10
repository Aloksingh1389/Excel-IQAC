// Institution Service for Stage 2 Institution Overview & Department Drilldown

import { MOCK_INSTITUTION_DATA } from '../data/mockInstitution';
import { filterAndSortDepartments } from '../utils/institutionUtils';

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const getYearData = (year = '2026-27') => {
  return (
    MOCK_INSTITUTION_DATA[year] ||
    MOCK_INSTITUTION_DATA['2026-27']
  );
};

export const institutionService = {
  /**
   * Retrieves high-level institutional overview for the selected academic year
   */
  getInstitutionOverview: async (year = '2026-27') => {
    await delay();
    const data = getYearData(year);
    return {
      success: true,
      academicYear: data.academicYear,
      institution: data.institution,
      academic: data.academic,
      performanceSummary: data.performanceSummary,
      attentionItems: data.attentionItems || [],
      departmentsCount: data.departments?.length || data.institution.departments,
    };
  },

  /**
   * Retrieves filtered and sorted list of departments for the selected year
   */
  getDepartments: async (year = '2026-27', filters = {}) => {
    await delay();
    const data = getYearData(year);
    const rawDepartments = data.departments || [];
    const filteredDepartments = filterAndSortDepartments(rawDepartments, filters);

    return {
      success: true,
      academicYear: data.academicYear,
      totalCount: rawDepartments.length,
      data: filteredDepartments,
    };
  },

  /**
   * Retrieves single department details by ID (e.g. 'IT', 'CSE')
   */
  getDepartmentById: async (year = '2026-27', departmentId) => {
    await delay();
    const data = getYearData(year);
    const cleanId = (departmentId || '').toUpperCase().trim();
    const department = (data.departments || []).find(
      (d) => d.id.toUpperCase() === cleanId || d.code.toUpperCase() === cleanId
    );

    if (!department) {
      throw new Error(`Department with code '${departmentId}' not found.`);
    }

    return {
      success: true,
      academicYear: data.academicYear,
      data: department,
    };
  },

  /**
   * Retrieves performance summary comparison for the institution
   */
  getInstitutionPerformance: async (year = '2026-27') => {
    await delay();
    const data = getYearData(year);
    return {
      success: true,
      academicYear: data.academicYear,
      data: data.performanceSummary || [],
    };
  },

  /**
   * Retrieves actionable attention items
   */
  getAttentionItems: async (year = '2026-27') => {
    await delay(100);
    const data = getYearData(year);
    return {
      success: true,
      academicYear: data.academicYear,
      data: data.attentionItems || [],
    };
  },
};
