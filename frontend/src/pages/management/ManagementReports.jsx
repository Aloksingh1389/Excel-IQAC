import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const Alert = ({ message, tone = 'error' }) => (
  <div className={`${tone === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'} border rounded-xl p-4 text-sm font-medium`}>{message}</div>
);

export const ManagementReports = () => {
  const { user, academicYear } = useAuth();
  const [types, setTypes] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [form, setForm] = useState({ reportConfigId: '', academicYear: academicYear || '2026-27', department: 'ALL', format: 'PDF' });
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await managementPortalService.getManagementReports(user);
      setTypes(Array.isArray(res.data?.types) ? res.data.types : []);
      setHistory(Array.isArray(res.data?.history) ? res.data.history : []);
    } catch (err) {
      setError(err?.message || 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role]);

  useEffect(() => { setForm((f) => ({ ...f, academicYear: academicYear || '2026-27' })); }, [academicYear]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setNotice(null);
    setError(null);
    try {
      const res = await managementPortalService.generateManagementReport(form, user);
      setNotice(res.message || `Report generated: ${res.report?.title || res.report?.id || ''}`);
      fetchData();
    } catch (err) {
      setError(err?.message || 'Failed to generate report.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <Loader message="Loading reports..." />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_REPORT_VIEW)) return <Alert message="You do not have permission to view reports." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Management Reports</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Generate and review institution-level reports</p>
      </div>
      {error && <Alert message={error} />}
      {notice && <Alert tone="ok" message={notice} />}

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Report Types ({types.length})</h3>
        {types.length === 0 ? <EmptyState title="No report types" description="No report configurations available." /> : (
          <div className="flex flex-wrap gap-2">{types.map((t, i) => (
            <span key={t.id || i} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">{t.title || t.name || t.id}</span>
          ))}</div>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Generate Report</h3>
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <select value={form.reportConfigId} onChange={(e) => setForm({ ...form, reportConfigId: e.target.value })} className="text-xs border border-slate-200 rounded-lg px-3 py-2" required>
            <option value="">Select config...</option>
            {types.map((t, i) => <option key={t.id || i} value={t.id}>{t.title || t.name || t.id}</option>)}
          </select>
          <input value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} placeholder="Academic year" className="text-xs border border-slate-200 rounded-lg px-3 py-2" />
          <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Department (ALL)" className="text-xs border border-slate-200 rounded-lg px-3 py-2" />
          <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
            <option value="PDF">PDF</option><option value="EXCEL">Excel</option><option value="CSV">CSV</option>
          </select>
          <button type="submit" disabled={generating} className="sm:col-span-2 lg:col-span-4 text-xs font-bold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
            {generating ? 'Generating...' : 'Generate report'}
          </button>
        </form>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Report History ({history.length})</h3>
        {history.length === 0 ? <EmptyState title="No history" description="No generated reports yet." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Report</th><th className="py-2 pr-3">Year</th><th className="py-2 pr-3">Status</th>
            </tr></thead>
            <tbody>{history.slice(0, 40).map((r, i) => (
              <tr key={r.id || i} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-bold text-slate-800">
                  {r.id ? <Link to={`/director/reports/${r.id}`} className="text-indigo-600 hover:underline">{r.title || r.id}</Link> : (r.title || '—')}
                </td>
                <td className="py-2 pr-3">{r.academicYear || '—'}</td>
                <td className="py-2 pr-3">{r.status || '—'}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
};
