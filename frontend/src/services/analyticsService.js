// Analytics Service for Stage 3 Management Analytics & Decision Support

import { MOCK_ANALYTICS_DATA } from '../data/mockAnalytics';

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const getYearData = (year = '2026-27') => {
  return (
    MOCK_ANALYTICS_DATA[year] ||
    MOCK_ANALYTICS_DATA['2026-27']
  );
};

export const analyticsService = {
  /**
   * Retrieves high-level analytics overview across all 5 key pillars
   */
  getAnalyticsOverview: async (year = '2026-27', filters = {}) => {
    await delay();
    const data = getYearData(year);
    return {
      success: true,
      academicYear: data.academicYear,
      compareYear: data.compareYear,
      overviewKPIs: data.overviewKPIs,
      managementInsights: data.managementInsights || [],
      performanceAlerts: data.performanceAlerts || [],
    };
  },

  /**
   * Retrieves academic performance analytics and trends
   */
  getAcademicAnalytics: async (year = '2026-27', filters = {}) => {
    await delay();
    const data = getYearData(year);
    let deptComp = data.academicAnalytics.departmentComparison || [];

    if (filters.department && filters.department !== 'ALL') {
      deptComp = deptComp.filter(
        (d) => d.id === filters.department || d.code === filters.department
      );
    }

    return {
      success: true,
      academicYear: data.academicYear,
      kpis: data.academicAnalytics.kpis,
      yearlyTrend: data.academicAnalytics.yearlyTrend,
      departmentComparison: deptComp,
      semesterPerformance: data.academicAnalytics.semesterPerformance,
    };
  },

  /**
   * Retrieves student demographics, progression funnel, and achievements
   */
  getStudentAnalytics: async (year = '2026-27', filters = {}) => {
    await delay();
    const data = getYearData(year);
    return {
      success: true,
      academicYear: data.academicYear,
      kpis: data.studentAnalytics.kpis,
      genderDistribution: data.studentAnalytics.genderDistribution,
      departmentDistribution: data.studentAnalytics.departmentDistribution,
      progressionFunnel: data.studentAnalytics.progressionFunnel,
      achievementCategories: data.studentAnalytics.achievementCategories,
    };
  },

  /**
   * Retrieves faculty strength, designations, PhD ratio, and FDP hours
   */
  getFacultyAnalytics: async (year = '2026-27', filters = {}) => {
    await delay();
    const data = getYearData(year);
    return {
      success: true,
      academicYear: data.academicYear,
      kpis: data.facultyAnalytics.kpis,
      qualificationDistribution: data.facultyAnalytics.qualificationDistribution,
      designationDistribution: data.facultyAnalytics.designationDistribution,
      fdpParticipationByDept: data.facultyAnalytics.fdpParticipationByDept,
    };
  },

  /**
   * Retrieves research funding, grants, startups, and patent status
   */
  getResearchAnalytics: async (year = '2026-27', filters = {}) => {
    await delay();
    const data = getYearData(year);
    return {
      success: true,
      academicYear: data.academicYear,
      kpis: data.researchAnalytics.kpis,
      yearlyTrend: data.researchAnalytics.yearlyTrend,
      fundingBreakdown: data.researchAnalytics.fundingBreakdown,
      patentsStatus: data.researchAnalytics.patentsStatus,
    };
  },

  /**
   * Retrieves Scopus/SCI/UGC publication output and department rankings
   */
  getPublicationAnalytics: async (year = '2026-27', filters = {}) => {
    await delay();
    const data = getYearData(year);
    return {
      success: true,
      academicYear: data.academicYear,
      kpis: data.publicationAnalytics.kpis,
      indexingBreakdown: data.publicationAnalytics.indexingBreakdown,
      departmentRanking: data.publicationAnalytics.departmentRanking,
    };
  },

  /**
   * Retrieves campus placement rates, packages, and recruiter metrics
   */
  getPlacementAnalytics: async (year = '2026-27', filters = {}) => {
    await delay();
    const data = getYearData(year);
    return {
      success: true,
      academicYear: data.academicYear,
      kpis: data.placementAnalytics.kpis,
      yearlyTrend: data.placementAnalytics.yearlyTrend,
      packageDistribution: data.placementAnalytics.packageDistribution,
      departmentPlacementSummary: data.placementAnalytics.departmentPlacementSummary,
    };
  },

  /**
   * Retrieves 6-pillar departmental scorecards and rankings
   */
  getDepartmentComparison: async (year = '2026-27', filters = {}) => {
    await delay();
    const data = getYearData(year);
    let scorecards = data.departmentScorecards || [];

    if (filters.department && filters.department !== 'ALL') {
      scorecards = scorecards.filter(
        (d) => d.id === filters.department || d.code === filters.department
      );
    }

    return {
      success: true,
      academicYear: data.academicYear,
      scorecards,
    };
  },

  /**
   * Retrieves rule-based management insights
   */
  getManagementInsights: async (year = '2026-27', filters = {}) => {
    await delay(100);
    const data = getYearData(year);
    return {
      success: true,
      academicYear: data.academicYear,
      insights: data.managementInsights || [],
    };
  },

  /**
   * Retrieves performance alerts with severity levels
   */
  getPerformanceAlerts: async (year = '2026-27', filters = {}) => {
    await delay(100);
    const data = getYearData(year);
    return {
      success: true,
      academicYear: data.academicYear,
      alerts: data.performanceAlerts || [],
    };
  },
};
