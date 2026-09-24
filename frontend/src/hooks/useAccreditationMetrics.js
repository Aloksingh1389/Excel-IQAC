// Custom Hook for NAAC Metrics Management (Stage 5G)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { accreditationService } from '../services/accreditationService';

export const useAccreditationMetrics = (initialFilters = {}) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await accreditationService.getMetrics(filters, user);
      if (res.success) setMetrics(res.data);
    } catch (err) {
      console.error('Error in useAccreditationMetrics hook:', err);
      setError(err.message || 'Failed to fetch accreditation metrics.');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const getMetricDetails = async (id) => {
    return await accreditationService.getMetricById(id, user);
  };

  return {
    metrics,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchMetrics,
    getMetricDetails,
  };
};
