// Dean portal state hook (Stage 8).
// Pages consume this hook; the hook consumes deanPortalService; the service
// consumes existing Stage 4/5/6 services. Selection persists per dean via
// localStorage so it survives navigation across portal pages.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { deanPortalService } from '../services/deanPortalService';
import { getDeanModulesForUser, hasDeanPermission } from '../config/deanPortalConfig';

export const useDeanPortal = (user, academicYear = '2026-27') => {
  const [profile, setProfile] = useState(null);
  const [assignedDepartments, setAssignedDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartmentsState] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const setSelectedDepartments = useCallback((codes) => {
    setSelectedDepartmentsState(codes);
    const prefs = deanPortalService.getPreferences();
    deanPortalService.savePreferences({ ...prefs, selectedDepartments: codes });
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const [profRes, assignedRes] = await Promise.all([
          deanPortalService.getDeanProfile(user),
          deanPortalService.getAssignedDepartments(user),
        ]);
        const prefs = deanPortalService.getPreferences();
        const assignedCodes = assignedRes.data.map((d) => d.code);
        const saved = Array.isArray(prefs.selectedDepartments)
          ? prefs.selectedDepartments.filter((c) => assignedCodes.includes(c))
          : [];
        const selection = saved.length > 0 ? saved : assignedCodes;
        const [dashRes, compRes] = await Promise.all([
          deanPortalService.getDeanDashboard(user, academicYear, selection),
          deanPortalService.getDepartmentComparison(user, selection),
        ]);
        if (!cancelled) {
          setProfile(profRes.data);
          setAssignedDepartments(assignedRes.data);
          setSelectedDepartmentsState(selection);
          setDashboardData(dashRes.data);
          setComparisonData(compRes.data);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load Dean portal.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role, JSON.stringify(user?.assignedDepartments), academicYear, refreshKey]);

  const modules = useMemo(() => getDeanModulesForUser(user), [user]);
  const can = useCallback((permission) => hasDeanPermission(user, permission), [user]);

  return {
    dean: profile,
    profile,
    assignedDepartments,
    selectedDepartments,
    setSelectedDepartments,
    dashboardData,
    departmentSummaries: dashboardData?.summaries || [],
    comparisonData,
    pendingReviews: dashboardData?.kpis?.pendingReviews ?? 0,
    modules,
    can,
    loading,
    error,
    refresh,
  };
};
