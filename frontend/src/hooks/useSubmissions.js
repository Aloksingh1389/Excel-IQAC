// Custom Hook for Stage 5C Submissions & Review Workflow

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { submissionService } from '../services/submissionService';

export const useSubmissions = (initialFilters = {}) => {
  const { user, academicYear } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [filters, setFilters] = useState({ academicYear, ...initialFilters });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissionsData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const [subRes, revRes] = await Promise.all([
        submissionService.getSubmissions({ ...filters, academicYear }, user),
        submissionService.getPendingReviews(user),
      ]);

      if (subRes.success) {
        setSubmissions(subRes.data);
        setStatistics(subRes.stats);
      }

      if (revRes.success) {
        setPendingReviews(revRes.data);
        setReviewStats(revRes.stats);
      }
    } catch (err) {
      console.error('Error in useSubmissions hook:', err);
      setError(err.message || 'Failed to fetch submissions.');
    } finally {
      setLoading(false);
    }
  }, [user, academicYear, filters]);

  useEffect(() => {
    fetchSubmissionsData();
  }, [fetchSubmissionsData]);

  const createSubmission = async (payload) => {
    const res = await submissionService.createSubmission(payload, user);
    if (res.success) await fetchSubmissionsData();
    return res;
  };

  const approveSubmission = async (id, comment) => {
    const res = await submissionService.approveSubmission(id, comment, user);
    if (res.success) await fetchSubmissionsData();
    return res;
  };

  const returnSubmission = async (id, reason) => {
    const res = await submissionService.returnSubmission(id, reason, user);
    if (res.success) await fetchSubmissionsData();
    return res;
  };

  const rejectSubmission = async (id, reason) => {
    const res = await submissionService.rejectSubmission(id, reason, user);
    if (res.success) await fetchSubmissionsData();
    return res;
  };

  const resubmitSubmission = async (id, comment) => {
    const res = await submissionService.resubmitSubmission(id, comment, user);
    if (res.success) await fetchSubmissionsData();
    return res;
  };

  const verifySubmission = async (id, comment) => {
    const res = await submissionService.verifySubmission(id, comment, user);
    if (res.success) await fetchSubmissionsData();
    return res;
  };

  const getSubmissionDetails = async (id) => {
    return await submissionService.getSubmissionById(id, user);
  };

  return {
    submissions,
    statistics,
    pendingReviews,
    reviewStats,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchSubmissionsData,
    createSubmission,
    approveSubmission,
    returnSubmission,
    rejectSubmission,
    resubmitSubmission,
    verifySubmission,
    getSubmissionDetails,
  };
};
