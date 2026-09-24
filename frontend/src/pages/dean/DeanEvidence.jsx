import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDeanPortal } from '../../hooks/useDeanPortal';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { DepartmentScopeSelector } from '../../components/dean';

const inputCls = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

export const DeanEvidence = () => {
  const { user, academicYear } = useAuth();
  const { assignedDepartments, selectedDepartments, setSelectedDepartments, can } = useDeanPortal(user, academicYear || '2026-27');
  const [params, setParams] = useSearchParams();
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchQuery = params.get('search') || '';
  const statusFilter = params.get('status') || 'ALL';
  const deptFilter = params.get('dept') || 'ALL';

  const set = (k, v) => {
    const next = new URLSearchParams(params);
    if (!v || v === 'ALL') next.delete(k); else next.set(k, v);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    Promise.all([
      deanPortalService.getEvidenceSummary(user, selectedDepartments),
      deanPortalService.getDeanEvidence({
        searchQuery: searchQuery || undefined,
        statusFilter: statusFilter === 'ALL' ? undefined : statusFilter,
        deptFilter: deptFilter === 'ALL' ? undefined : deptFilter,
        academicYear: academicYear || '2026-27',
      }, user),
    ])
      .then(([sumRes, evRes]) => {
        if (cancelled) return;
        setSummary(sumRes?.data || null);
        setItems(evRes?.data || []);
      })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load evidence.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, JSON.stringify(selectedDepartments), searchQuery, statusFilter, deptFilter, academicYear]);

  if (!can(DEAN_PERMISSIONS.DEAN_EVIDENCE_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view evidence.</div>;
  if (loading || !summary) return <Loader message="Loading Dean evidence overview..." />;
  if (error) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Evidence Monitoring</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Total {summary.total} • Verified {summary.verified} • Under review {summary.underReview} • Returned {summary.returned} • Missing {summary.missing}</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-3">
        <DepartmentScopeSelector assigned={assignedDepartments} selected={selectedDepartments} onChange={setSelectedDepartments} />
      </Card>
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Per-Department Completeness</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead><tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
              <th className="p-3">Department</th><th className="p-3 text-center">Required</th><th className="p-3 text-center">Verified</th><th className="p-3 text-center">Under Review</th><th className="p-3 text-center">Missing</th><th className="p-3 text-center">Completeness</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(summary.byDepartment || []).map((d) => (
                <tr key={d.departmentCode} className="hover:bg-slate-50/80">
                  <td className="p-3 font-bold text-slate-900">{d.departmentCode}</td>
                  <td className="p-3 text-center">{d.required}</td>
                  <td className="p-3 text-center">{d.verified}</td>
                  <td className="p-3 text-center">{d.underReview}</td>
                  <td className="p-3 text-center">{d.missing}</td>
                  <td className="p-3 text-center font-bold">{d.completeness}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="p-4 sm:p-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input value={searchQuery} onChange={(e) => set('search', e.target.value)} placeholder="Search evidence..." className={inputCls} />
          <select value={statusFilter} onChange={(e) => set('status', e.target.value)} className={inputCls}>
            {['ALL', 'UPLOADED', 'UNDER_REVIEW', 'RESUBMITTED', 'VERIFIED', 'RETURNED', 'REJECTED'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={deptFilter} onChange={(e) => set('dept', e.target.value)} className={inputCls}>
            <option value="ALL">All departments</option>
            {(assignedDepartments || []).map((d) => <option key={d.code} value={d.code}>{d.code} — {d.name}</option>)}
          </select>
        </div>
        <h3 className="text-sm font-bold text-slate-900">Evidence Records ({(items || []).length})</h3>
        {(items || []).length === 0 ? <EmptyState title="No evidence" description="No evidence records match the current filters." /> : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead><tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                <th className="p-3">Title</th><th className="p-3 text-center">Dept</th><th className="p-3 text-center">Status</th><th className="p-3 text-right">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(items || []).map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{e.title || e.id}</td>
                    <td className="p-3 text-center">{e.departmentCode}</td>
                    <td className="p-3 text-center">{e.status}</td>
                    <td className="p-3 text-right"><Link to={`/dean/evidence/${e.id}`} className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
