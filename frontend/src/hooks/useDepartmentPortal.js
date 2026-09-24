// Department portal state hook (Stage 7).
// Pages consume this hook; the hook consumes departmentPortalService; the
// service consumes existing Stage 5/6 services. No localStorage in pages.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { departmentPortalService } from '../services/departmentPortalService';
import {
  getModulesForUser,
  hasDepartmentPermission,
} from '../config/departmentPortalConfig';

export const useDepartmentPortal = (user, academicYear = '2026-27') => {
  const [context, setContext] = useState(null);
  const [dashboard, setDashboard] = useState(null);
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
        const [ctxRes, dashRes] = await Promise.all([
          departmentPortalService.getDepartmentContext(user),
          departmentPortalService.getDashboard(user, academicYear),
        ]);
        if (!cancelled) {
          setContext(ctxRes.data);
          setDashboard(dashRes.data);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load department portal.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role, user?.departmentCode, academicYear, refreshKey]);

  const modules = useMemo(() => getModulesForUser(user), [user]);
  const can = useCallback((permission) => hasDepartmentPermission(user, permission), [user]);

  return {
    department: context,
    context,
    dashboard,
    kpis: dashboard?.kpis || null,
    attentionItems: dashboard?.attention || [],
    recentActivity: dashboard?.recentActivity || [],
    health: dashboard?.health || null,
    trends: dashboard?.trends || null,
    modules,
    can,
    loading,
    error,
    refresh,
  };
};
