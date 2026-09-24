import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const Alert = ({ message, tone = 'error' }) => (
  <div className={`${tone === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'} border rounded-xl p-4 text-sm font-medium`}>{message}</div>
);

export const ManagementSubmissions = () => {
  const { user, academicYear } = useAuth();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [expanded, setExpanded] = useState(null);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await managementPortalService.getSubmissionOverview({
        searchQuery: searchQuery || undefined,
        statusFilter: statusFilter !== 'ALL' ? statusFilter : undefined,
        typeFilter: typeFilter !== 'ALL' ? typeFilter : undefined,
        deptFilter: deptFilter !== 'ALL' ? deptFilter : undefined,
        academicYear: academicYear || '2026-27',
      }, user);
      setRecords(Array.isArray(res.data) ? res.data : []);
      setStats(res.stats || {});
    } catch (err) {
      setError(err?.message || 'Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role]);

  const depts = useMemo(() => [...new Set(records.map((r) => r.departmentCode).filter(Boolean))], [records]);
  const statuses = useMemo(() => [...new Set(records.map((r) => r.status).filter(Boolean))], [records]);

  const handleComment = async (id) => {
    setSaving(true);
    setNotice(null);
    setError(null);
    try {
      const res = await managementPortalService.commentManagementSubmission(id, comment, user);
      setNotice(res.message || 'Comment recorded.');
      setComment('');
      setExpanded(null);
    } catch (err) {
      setError(err?.message || 'Failed to record comment.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading submissions..." />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_SUBMISSION_VIEW)) return <Alert message="You do not have permission to view submissions." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Submission Monitoring</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Read-only monitoring role — review only, with management comments.</p>
      </div>

      {error && <Alert message={error} />}
      {notice && <Alert tone="ok" message={notice} />}

      <div className="flex flex-wrap gap-2">
        {[['Total', stats.total ?? records.length], ['Pending', stats.pendingReview ?? '—'], ['Verified', stats.verified ?? '—']].map(([k, v]) => (
          <span key={k} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">{k}: {v}</span>
        ))}
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-2">
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search submissions..."
          className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
          <option value="ALL">All statuses</option>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
          <option value="ALL">All departments</option>{depts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <input value={typeFilter === 'ALL' ? '' : typeFilter} onChange={(e) => setTypeFilter(e.target.value || 'ALL')} placeholder="Type filter"
          className="text-xs border border-slate-200 rounded-lg px-3 py-2 sm:w-36" />
        <button onClick={fetchData} className="text-xs font-bold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Apply</button>
      </Card>

      <Card className="p-4 sm:p-6">
        {records.length === 0 ? <EmptyState title="No submissions" description="No submissions match the current filters." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Title</th><th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3">Year</th><th className="py-2 pr-3">Action</th>
            </tr></thead>
            <tbody>{records.slice(0, 50).map((r) => (
              <React.Fragment key={r.id}>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-3 font-bold text-slate-800">{r.title || r.id}</td>
                  <td className="py-2 pr-3">{r.departmentCode || '—'}</td>
                  <td className="py-2 pr-3">{r.status || '—'}</td>
                  <td className="py-2 pr-3">{r.academicYear || '—'}</td>
                  <td className="py-2 pr-3">
                    <button onClick={() => { setExpanded(expanded === r.id ? null : r.id); setComment(''); }} className="text-[11px] font-bold text-indigo-600 hover:underline">
                      {expanded === r.id ? 'Close' : 'Comment'}
                    </button>
                  </td>
                </tr>
                {expanded === r.id && (
                  <tr className="border-b border-slate-100 bg-slate-50"><td colSpan={5} className="p-3">
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} placeholder="Write a management monitoring comment..."
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <button disabled={saving || !comment.trim()} onClick={() => handleComment(r.id)}
                      className="mt-2 text-xs font-bold px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
                      {saving ? 'Saving...' : 'Record comment'}
                    </button>
                  </td></tr>
                )}
              </React.Fragment>
            ))}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
};
