// Custom Hook for IQAC Activities Management (Stage 5E)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { activityService } from '../services/activityService';

export const useActivities = (initialFilters = {}) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await activityService.getActivities(filters, user);
      if (res.success) {
        setActivities(res.data);
        setStatistics(res.stats);
      }
    } catch (err) {
      console.error('Error in useActivities hook:', err);
      setError(err.message || 'Failed to fetch activities.');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const createActivity = async (payload) => {
    const res = await activityService.createActivity(payload, user);
    if (res.success) await fetchActivities();
    return res;
  };

  const updateActivityProgress = async (id, progressVal, comment) => {
    const res = await activityService.updateActivityProgress(id, progressVal, user, comment);
    if (res.success) await fetchActivities();
    return res;
  };

  const getActivityDetails = async (id) => {
    return await activityService.getActivityById(id, user);
  };

  return {
    activities,
    statistics,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchActivities,
    createActivity,
    updateActivityProgress,
    getActivityDetails,
  };
};
