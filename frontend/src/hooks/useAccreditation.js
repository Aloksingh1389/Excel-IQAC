// Custom Hook for NAAC Accreditation Framework (Stage 5G)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { accreditationService } from '../services/accreditationService';

export const useAccreditation = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccreditation = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [sumRes, crRes] = await Promise.all([
        accreditationService.getAccreditationSummary(user),
        accreditationService.getCriteria(user),
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (crRes.success) setCriteria(crRes.data);
    } catch (err) {
      console.error('Error in useAccreditation hook:', err);
      setError(err.message || 'Failed to fetch accreditation framework data.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAccreditation();
  }, [fetchAccreditation]);

  const getCriterionDetails = async (id) => {
    return await accreditationService.getCriterionById(id, user);
  };

  return {
    summary,
    criteria,
    loading,
    error,
    refresh: fetchAccreditation,
    getCriterionDetails,
  };
};
