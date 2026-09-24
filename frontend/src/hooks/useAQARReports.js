// Custom Hook for AQAR Reports Management (Stage 5H)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { aqarReportService } from '../services/aqarReportService';

export const useAQARReports = (initialFilters = {}) => {
  const { user, academicYear } = useAuth();
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState({ academicYear, ...initialFilters });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await aqarReportService.getAQARReports(filters, user);
      if (res.success) {
        setReports(res.data);
        setStatistics(res.stats);
      }
    } catch (err) {
      console.error('Error in useAQARReports hook:', err);
      setError(err.message || 'Failed to fetch AQAR reports.');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const createDraft = async (payload) => {
    const res = await aqarReportService.createAQARDraft(payload, user);
    if (res.success) await fetchReports();
    return res;
  };

  const getAQARDetails = async (id) => {
    return await aqarReportService.getAQARById(id, user);
  };

  const updateAQAR = async (id, payload) => {
    const res = await aqarReportService.updateAQARReport(id, payload, user);
    if (res.success) await fetchReports();
    return res;
  };

  const submitForReview = async (id) => {
    const res = await aqarReportService.submitAQARForReview(id, user);
    if (res.success) await fetchReports();
    return res;
  };

  const finalizeReport = async (id) => {
    const res = await aqarReportService.finalizeAQARReport(id, user);
    if (res.success) await fetchReports();
    return res;
  };

  return {
    reports,
    statistics,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchReports,
    createDraft,
    getAQARDetails,
    updateAQAR,
    submitForReview,
    finalizeReport,
  };
};
