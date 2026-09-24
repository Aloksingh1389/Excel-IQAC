import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS, hasDeanPermission } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const inputCls = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

export const DeanReviewCenter = () => {
  const { user, academicYear } = useAuth();
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchQuery = params.get('search') || '';
  const statusFilter = params.get('status') || 'ALL';
  const typeFilter = params.get('type') || 'ALL';
  const deptFilter = params.get('dept') || 'ALL';
  const priorityFilter = params.get('priority') || 'ALL';

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
      deanPortalService.getDeanSubmissions({
        searchQuery: searchQuery || undefined,
        statusFilter: statusFilter === 'ALL' ? undefined : statusFilter,
        typeFilter: typeFilter === 'ALL' ? undefined : typeFilter,
        deptFilter: deptFilter === 'ALL' ? undefined : deptFilter,
        academicYear: academicYear || '2026-27',
      }, user),
      deanPortalService.getAssignedDepartments(user).catch(() => ({ data: [] })),
    ])
      .then(([subRes, deptRes]) => {
        if (cancelled) return;
        setItems(subRes?.data || []);
        setDepartments(deptRes?.data || []);
      })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load review queue.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, searchQuery, statusFilter, typeFilter, deptFilter, academicYear]);

  const filtered = useMemo(() => {
    if (priorityFilter === 'ALL') return items || [];
    return (items || []).filter((s) => (s.priority || '').toUpperCase() === priorityFilter.toUpperCase());
  }, [items, priorityFilter]);

  if (!hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_SUBMISSION_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view the review queue.</div>;
  if (loading) return <Loader message="Loading Dean review queue..." />;
  if (error) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Review Center</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Monitoring queue across your assigned departments • {academicYear || '2026-27'}</p>
      </div>
      <Card className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          <input value={searchQuery} onChange={(e) => set('search', e.target.value)} placeholder="Search submissions..." className={inputCls} />
          <select value={statusFilter} onChange={(e) => set('status', e.target.value)} className={inputCls}>
            {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'RESUBMITTED', 'VERIFIED', 'APPROVED', 'RETURNED', 'REJECTED'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => set('type', e.target.value)} className={inputCls}>
            {['ALL', 'AQAR', 'SSR', 'DATA', 'REPORT', 'EVIDENCE'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={deptFilter} onChange={(e) => set('dept', e.target.value)} className={inputCls}>
            <option value="ALL">All departments</option>
            {(departments || []).map((d) => <option key={d.code} value={d.code}>{d.code} — {d.name}</option>)}
          </select>
          <select value={priorityFilter} onChange={(e) => set('priority', e.target.value)} className={inputCls}>
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => <option key={s} value={s}>{s === 'ALL' ? 'All priorities' : s}</option>)}
          </select>
        </div>
      </Card>
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Submissions ({filtered.length})</h3>
        {filtered.length === 0 ? <EmptyState title="No submissions" description="No submissions match the current filters." /> : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead><tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                <th className="p-3">ID</th><th className="p-3">Title</th><th className="p-3 text-center">Dept</th><th className="p-3 text-center">Status</th><th className="p-3 text-center">Priority</th><th className="p-3 text-right">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-indigo-900">{s.submissionId || s.id}</td>
                    <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{s.title}</td>
                    <td className="p-3 text-center">{s.departmentCode}</td>
                    <td className="p-3 text-center">{s.status}</td>
                    <td className="p-3 text-center">{s.priority || '—'}</td>
                    <td className="p-3 text-right"><Link to={`/dean/review/${s.id}`} className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold">View</Link></td>
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
