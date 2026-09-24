// Custom Hook for Stage 5D Evidence Repository & Verification

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { evidenceService } from '../services/evidenceService';

export const useEvidence = (initialFilters = {}) => {
  const { user, academicYear } = useAuth();
  const [evidence, setEvidence] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [missingEvidence, setMissingEvidence] = useState([]);
  const [filters, setFilters] = useState({ academicYear, ...initialFilters });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvidenceData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const [evRes, revRes, missRes] = await Promise.all([
        evidenceService.getEvidence({ ...filters, academicYear }, user),
        evidenceService.getPendingEvidenceReviews(user),
        evidenceService.getMissingEvidence(user),
      ]);

      if (evRes.success) {
        setEvidence(evRes.data);
        setStatistics(evRes.stats);
      }

      if (revRes.success) {
        setPendingReviews(revRes.data);
        setReviewStats(revRes.stats);
      }

      if (missRes.success) {
        setMissingEvidence(missRes.data);
      }
    } catch (err) {
      console.error('Error in useEvidence hook:', err);
      setError(err.message || 'Failed to fetch evidence data.');
    } finally {
      setLoading(false);
    }
  }, [user, academicYear, filters]);

  useEffect(() => {
    fetchEvidenceData();
  }, [fetchEvidenceData]);

  const uploadEvidence = async (payload) => {
    const res = await evidenceService.uploadEvidence(payload, user);
    if (res.success) await fetchEvidenceData();
    return res;
  };

  const verifyEvidence = async (id, comment) => {
    const res = await evidenceService.verifyEvidence(id, comment, user);
    if (res.success) await fetchEvidenceData();
    return res;
  };

  const returnEvidence = async (id, reason) => {
    const res = await evidenceService.returnEvidence(id, reason, user);
    if (res.success) await fetchEvidenceData();
    return res;
  };

  const rejectEvidence = async (id, reason) => {
    const res = await evidenceService.rejectEvidence(id, reason, user);
    if (res.success) await fetchEvidenceData();
    return res;
  };

  const resubmitEvidence = async (id, payload) => {
    const res = await evidenceService.resubmitEvidence(id, payload, user);
    if (res.success) await fetchEvidenceData();
    return res;
  };

  const getEvidenceDetails = async (id) => {
    return await evidenceService.getEvidenceById(id, user);
  };

  const getEvidenceBySubmission = async (submissionId) => {
    return await evidenceService.getEvidenceBySubmission(submissionId, user);
  };

  return {
    evidence,
    statistics,
    pendingReviews,
    reviewStats,
    missingEvidence,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchEvidenceData,
    uploadEvidence,
    verifyEvidence,
    returnEvidence,
    rejectEvidence,
    resubmitEvidence,
    getEvidenceDetails,
    getEvidenceBySubmission,
  };
};
