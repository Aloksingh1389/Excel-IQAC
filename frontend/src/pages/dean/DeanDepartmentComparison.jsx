import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDeanPortal } from '../../hooks/useDeanPortal';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { DepartmentScopeSelector, DepartmentComparisonTable, DepartmentComparisonChart } from '../../components/dean';

export const DeanDepartmentComparison = () => {
  const { user, academicYear } = useAuth();
  const { assignedDepartments, selectedDepartments, setSelectedDepartments, can } = useDeanPortal(user, academicYear || '2026-27');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    deanPortalService.getDepartmentComparison(user, selectedDepartments)
      .then((res) => { if (!cancelled) setRows(res?.data || []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load comparison.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, JSON.stringify(selectedDepartments)]);

  if (!can(DEAN_PERMISSIONS.DEAN_DEPARTMENT_COMPARISON_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to compare departments.</div>;
  if (loading) return <Loader message="Loading department comparison..." />;
  if (error) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Comparison</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Comparison is limited to your assigned departments.</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-3">
        <DepartmentScopeSelector assigned={assignedDepartments} selected={selectedDepartments} onChange={setSelectedDepartments} />
      </Card>
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Performance Overview</h3>
        {(rows || []).length === 0 ? <EmptyState title="No data" description="No comparison data for the current selection." /> : <DepartmentComparisonChart rows={rows} />}
      </Card>
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Detailed Comparison ({(rows || []).length})</h3>
        {(rows || []).length === 0 ? <EmptyState title="No data" description="No comparison data for the current selection." /> : <DepartmentComparisonTable rows={rows} />}
      </Card>
    </div>
  );
};
