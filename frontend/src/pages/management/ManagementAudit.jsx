import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const Alert = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{message}</div>
);

export const ManagementAudit = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', role: 'ALL', department: 'ALL', action: 'ALL', date: '' });

  const fetchData = async (f = filters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await managementPortalService.getAuditRecords(f, user);
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load audit records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role]);

  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  if (loading) return <Loader message="Loading audit records..." />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_AUDIT_VIEW)) return <Alert message="You do not have permission to view audit records." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Audit Center ({rows.length})</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Read-only institutional audit trail</p>
      </div>
      {error && <Alert message={error} />}
      <Card className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
        <input value={filters.search} onChange={(e) => set('search', e.target.value)} placeholder="Search actor, action..."
          className="text-xs border border-slate-200 rounded-lg px-3 py-2" />
        <input value={filters.role} onChange={(e) => set('role', e.target.value)} placeholder="Role (ALL)"
          className="text-xs border border-slate-200 rounded-lg px-3 py-2" />
        <input value={filters.department} onChange={(e) => set('department', e.target.value)} placeholder="Department (ALL)"
          className="text-xs border border-slate-200 rounded-lg px-3 py-2" />
        <input value={filters.action} onChange={(e) => set('action', e.target.value)} placeholder="Action (ALL)"
          className="text-xs border border-slate-200 rounded-lg px-3 py-2" />
        <input value={filters.date} onChange={(e) => set('date', e.target.value)} placeholder="Date (YYYY-MM-DD)"
          className="text-xs border border-slate-200 rounded-lg px-3 py-2" />
        <button onClick={() => fetchData()} className="text-xs font-bold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Apply</button>
      </Card>
      <Card className="p-4 sm:p-6">
        {rows.length === 0 ? <EmptyState title="No audit records" description="No records match the current filters." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Actor</th><th className="py-2 pr-3">Role</th>
              <th className="py-2 pr-3">Action</th><th className="py-2 pr-3">Entity</th><th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Detail</th>
            </tr></thead>
            <tbody>{rows.slice(0, 100).map((l, i) => (
              <tr key={l.id || i} className="border-b border-slate-100">
                <td className="py-2 pr-3 whitespace-nowrap">{l.timestamp || l.createdAt || '—'}</td>
                <td className="py-2 pr-3 font-bold">{l.actorName || '—'}</td>
                <td className="py-2 pr-3">{l.actorRole || '—'}</td>
                <td className="py-2 pr-3">{l.action || '—'}</td>
                <td className="py-2 pr-3">{l.targetId || '—'}</td>
                <td className="py-2 pr-3">{l.departmentId || '—'}</td>
                <td className="py-2 pr-3 text-slate-500 max-w-xs truncate">{l.reason || ''}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
};
