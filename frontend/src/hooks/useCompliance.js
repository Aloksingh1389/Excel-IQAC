// Custom Hook for Institutional Compliance (Stage 5F)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { complianceService } from '../services/complianceService';

export const useCompliance = (initialFilters = {}) => {
  const { user, academicYear } = useAuth();
  const [records, setRecords] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [filters, setFilters] = useState({ academicYear, ...initialFilters });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompliance = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [recRes, heatRes] = await Promise.all([
        complianceService.getComplianceRecords({ ...filters, academicYear }, user),
        complianceService.getComplianceHeatmap(user),
      ]);

      if (recRes.success) {
        setRecords(recRes.data);
        setStatistics(recRes.stats);
      }
      if (heatRes.success) {
        setHeatmap(heatRes.data);
      }
    } catch (err) {
      console.error('Error in useCompliance hook:', err);
      setError(err.message || 'Failed to fetch compliance records.');
    } finally {
      setLoading(false);
    }
  }, [user, academicYear, filters]);

  useEffect(() => {
    fetchCompliance();
  }, [fetchCompliance]);

  const getComplianceDetails = async (id) => {
    return await complianceService.getComplianceById(id, user);
  };

  return {
    records,
    statistics,
    heatmap,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchCompliance,
    getComplianceDetails,
  };
};
