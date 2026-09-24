// Custom Hook for Improvement Plans (Stage 5F)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { improvementPlanService } from '../services/improvementPlanService';

export const useImprovementPlans = (initialFilters = {}) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await improvementPlanService.getImprovementPlans(filters, user);
      if (res.success) {
        setPlans(res.data);
        setStatistics(res.stats);
      }
    } catch (err) {
      console.error('Error in useImprovementPlans hook:', err);
      setError(err.message || 'Failed to fetch improvement plans.');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const createImprovementPlan = async (payload) => {
    const res = await improvementPlanService.createImprovementPlan(payload, user);
    if (res.success) await fetchPlans();
    return res;
  };

  const updatePlanProgress = async (id, progressVal, comment) => {
    const res = await improvementPlanService.updatePlanProgress(id, progressVal, user, comment);
    if (res.success) await fetchPlans();
    return res;
  };

  const getImprovementPlanDetails = async (id) => {
    return await improvementPlanService.getImprovementPlanById(id, user);
  };

  return {
    plans,
    statistics,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchPlans,
    createImprovementPlan,
    updatePlanProgress,
    getImprovementPlanDetails,
  };
};
