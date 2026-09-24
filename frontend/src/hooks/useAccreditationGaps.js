// Custom Hook for NAAC Accreditation Gaps (Stage 5G)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { accreditationService } from '../services/accreditationService';

export const useAccreditationGaps = (initialFilters = {}) => {
  const { user } = useAuth();
  const [gaps, setGaps] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGaps = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await accreditationService.getAccreditationGaps(filters, user);
      if (res.success) setGaps(res.data);
    } catch (err) {
      console.error('Error in useAccreditationGaps hook:', err);
      setError(err.message || 'Failed to fetch accreditation gaps.');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchGaps();
  }, [fetchGaps]);

  return {
    gaps,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchGaps,
  };
};
