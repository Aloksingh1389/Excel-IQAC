import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = (moduleType = 'overview', initialFilters = {}) => {
  const { academicYear } = useAuth();
  const [filters, setFilters] = useState({
    department: 'ALL',
    program: 'ALL',
    semester: 'ALL',
    ...initialFilters,
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModuleAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      switch (moduleType) {
        case 'academic':
          res = await analyticsService.getAcademicAnalytics(academicYear, filters);
          break;
        case 'students':
          res = await analyticsService.getStudentAnalytics(academicYear, filters);
          break;
        case 'faculty':
          res = await analyticsService.getFacultyAnalytics(academicYear, filters);
          break;
        case 'research':
          res = await analyticsService.getResearchAnalytics(academicYear, filters);
          break;
        case 'publications':
          res = await analyticsService.getPublicationAnalytics(academicYear, filters);
          break;
        case 'placement':
          res = await analyticsService.getPlacementAnalytics(academicYear, filters);
          break;
        case 'departments':
          res = await analyticsService.getDepartmentComparison(academicYear, filters);
          break;
        case 'overview':
        default:
          res = await analyticsService.getAnalyticsOverview(academicYear, filters);
          break;
      }

      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error(`Error loading analytics for module ${moduleType}:`, err);
      setError(err.message || 'Unable to load analytics data.');
    } finally {
      setLoading(false);
    }
  }, [academicYear, moduleType, JSON.stringify(filters)]);

  useEffect(() => {
    fetchModuleAnalytics();
  }, [fetchModuleAnalytics]);

  const resetFilters = () => {
    setFilters({
      department: 'ALL',
      program: 'ALL',
      semester: 'ALL',
    });
  };

  return {
    data,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    refetch: fetchModuleAnalytics,
    selectedYear: academicYear,
  };
};
