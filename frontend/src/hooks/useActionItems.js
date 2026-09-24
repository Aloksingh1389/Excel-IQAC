// Custom Hook for IQAC Action Items Management (Stage 5E)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { actionItemService } from '../services/actionItemService';

export const useActionItems = (initialFilters = {}) => {
  const { user } = useAuth();
  const [actionItems, setActionItems] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActionItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await actionItemService.getActionItems(filters, user);
      if (res.success) {
        setActionItems(res.data);
        setStatistics(res.stats);
      }
    } catch (err) {
      console.error('Error in useActionItems hook:', err);
      setError(err.message || 'Failed to fetch action items.');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchActionItems();
  }, [fetchActionItems]);

  const createActionItem = async (payload) => {
    const res = await actionItemService.createActionItem(payload, user);
    if (res.success) await fetchActionItems();
    return res;
  };

  const updateActionProgress = async (id, progressVal, comment) => {
    const res = await actionItemService.updateActionProgress(id, progressVal, user, comment);
    if (res.success) await fetchActionItems();
    return res;
  };

  const getActionItemDetails = async (id) => {
    return await actionItemService.getActionItemById(id, user);
  };

  return {
    actionItems,
    statistics,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchActionItems,
    createActionItem,
    updateActionProgress,
    getActionItemDetails,
  };
};
