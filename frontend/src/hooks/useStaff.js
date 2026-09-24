// Custom Hook for Staff Portal Data & Workflow (Stage 6)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { staffService } from '../services/staffService';
import { submissionService } from '../services/submissionService';
import { evidenceService } from '../services/evidenceService';
import { actionItemService } from '../services/actionItemService';

export const useStaff = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [qualityContribution, setQualityContribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaffData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [profRes, dashRes, subRes, evRes, actRes, qualRes] = await Promise.all([
        staffService.getStaffProfile(user),
        staffService.getStaffDashboard(user),
        submissionService.getSubmissions({}, user),
        evidenceService.getEvidenceList({}, user),
        actionItemService.getActionItems({}, user),
        staffService.getStaffQualityContribution(user),
      ]);

      if (profRes.success) setProfile(profRes.data);
      if (dashRes.success) setDashboard(dashRes.data);
      if (subRes.success) setSubmissions(subRes.data);
      if (evRes.success) setEvidenceList(evRes.data);
      if (actRes.success) setTasks(actRes.data);
      if (qualRes.success) setQualityContribution(qualRes.data);
    } catch (err) {
      console.error('Error in useStaff hook:', err);
      setError(err.message || 'Failed to fetch staff portal data.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  const updateProfile = async (payload) => {
    const res = await staffService.updateStaffProfile(payload, user);
    if (res.success) await fetchStaffData();
    return res;
  };

  return {
    profile,
    dashboard,
    submissions,
    evidenceList,
    tasks,
    qualityContribution,
    loading,
    error,
    refresh: fetchStaffData,
    updateProfile,
  };
};
