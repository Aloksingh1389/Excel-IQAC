// Management portal state hook (Stage 9).
// Pages consume this hook; the hook consumes managementPortalService; the
// service consumes existing Stage 2/3/4/5 systems. No mock access in pages.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { managementPortalService } from '../services/managementPortalService';
import { getManagementModulesForUser, hasManagementPermission } from '../config/managementPortalConfig';

export const useManagementPortal = (user, academicYear = '2026-27') => {
  const [profile, setProfile] = useState(null);
  const [overview, setOverview] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

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
        const [profRes, overRes, deptRes] = await Promise.all([
          managementPortalService.getManagementProfile(user),
          managementPortalService.getInstitutionOverview(user, academicYear),
          managementPortalService.getDepartmentOverview(user),
        ]);
        if (!cancelled) {
          setProfile(profRes.data);
          setOverview(overRes.data);
          setDepartments(deptRes.data);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load Management portal.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role, academicYear, refreshKey]);

  const modules = useMemo(() => getManagementModulesForUser(user), [user]);
  const can = useCallback((permission) => hasManagementPermission(user, permission), [user]);

  return {
    currentManagementUser: profile,
    profile,
    institutionOverview: overview,
    kpis: overview?.kpis || null,
    executiveSummary: overview?.executiveSummary || null,
    attentionItems: overview?.attention || [],
    departments,
    modules,
    can,
    loading,
    error,
    refresh,
  };
};
