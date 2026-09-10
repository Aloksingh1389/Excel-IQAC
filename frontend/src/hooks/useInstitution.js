import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { institutionService } from '../services/institutionService';

export const useInstitution = (filters = {}) => {
  const { academicYear } = useAuth();
  const [data, setData] = useState({
    institution: null,
    academic: null,
    departments: [],
    performance: [],
    attentionItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, deptRes] = await Promise.all([
        institutionService.getInstitutionOverview(academicYear),
        institutionService.getDepartments(academicYear, filters),
      ]);

      setData({
        institution: overviewRes.institution,
        academic: overviewRes.academic,
        departments: deptRes.data,
        performance: overviewRes.performanceSummary,
        attentionItems: overviewRes.attentionItems,
      });
    } catch (err) {
      console.error('Error in useInstitution hook:', err);
      setError(err.message || 'Unable to load institutional data.');
    } finally {
      setLoading(false);
    }
  }, [academicYear, JSON.stringify(filters)]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const fetchDepartment = async (departmentId) => {
    return await institutionService.getDepartmentById(academicYear, departmentId);
  };

  return {
    institution: data.institution,
    academic: data.academic,
    departments: data.departments,
    performance: data.performance,
    attentionItems: data.attentionItems,
    loading,
    error,
    selectedYear: academicYear,
    refetch: fetchOverview,
    fetchDepartment,
  };
};
