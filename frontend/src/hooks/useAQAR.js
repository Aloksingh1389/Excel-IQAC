// Custom Hook for Current AQAR Report Editor & Builder (Stage 5H)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { aqarReportService } from '../services/aqarReportService';
import { aqarValidationService } from '../services/aqarValidationService';

export const useAQAR = (reportId) => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [validation, setValidation] = useState({ status: 'VALID', blockers: [], warnings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAQAR = useCallback(async () => {
    if (!user || !reportId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await aqarReportService.getAQARById(reportId, user);
      if (res.success) {
        setReport(res.data);
        const valRes = aqarValidationService.validateAQARReport(res.data);
        setValidation(valRes);
      }
    } catch (err) {
      console.error('Error in useAQAR hook:', err);
      setError(err.message || 'Failed to load AQAR report.');
    } finally {
      setLoading(false);
    }
  }, [user, reportId]);

  useEffect(() => {
    fetchAQAR();
  }, [fetchAQAR]);

  const updateSection = async (updatePayload) => {
    const res = await aqarReportService.updateAQARReport(reportId, updatePayload, user);
    if (res.success) {
      setReport(res.data);
      setValidation(aqarValidationService.validateAQARReport(res.data));
    }
    return res;
  };

  return {
    report,
    validation,
    loading,
    error,
    refresh: fetchAQAR,
    updateSection,
  };
};
