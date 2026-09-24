import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDeanPortal } from '../../hooks/useDeanPortal';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const inputCls = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

export const DeanReports = () => {
  const { user, academicYear } = useAuth();
  const { assignedDepartments, selectedDepartments, can } = useDeanPortal(user, academicYear || '2026-27');
  const [types, setTypes] = useState([]);
  const [history, setHistory] = useState([]);
  const [aqar, setAqar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ reportConfigId: '', academicYear: academicYear || '2026-27', format: 'PDF', departmentCodes: [] });
  const [genMsg, setGenMsg] = useState(null);
  const [genErr, setGenErr] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    Promise.all([
      deanPortalService.getDeanReportTypes(user).catch(() => ({ data: [] })),
      deanPortalService.getDeanReportHistory(user).catch(() => ({ data: [] })),
      deanPortalService.getDeanAQAROverview(user, selectedDepartments).catch(() => ({ data: null })),
    ])
      .then(([tRes, hRes, aRes]) => {
        if (cancelled) return;
        setTypes(tRes?.data || tRes?.reportTypes || []);
        setHistory(hRes?.data || hRes?.reports || []);
        setAqar(aRes?.data || null);
      })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load reports.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, JSON.stringify(selectedDepartments)]);

  const toggleDept = (code) => {
    setForm((f) => ({ ...f, departmentCodes: f.departmentCodes.includes(code) ? f.departmentCodes.filter((c) => c !== code) : [...f.departmentCodes, code] }));
  };

  const generate = async (e) => {
    e.preventDefault();
    setGenMsg(null); setGenErr(null); setGenerating(true);
    try {
      const res = await deanPortalService.generateDeanReport({
        reportConfigId: form.reportConfigId,
        academicYear: form.academicYear,
        departmentCodes: form.departmentCodes.length > 0 ? form.departmentCodes : selectedDepartments,
        format: form.format,
      }, user);
      setGenMsg(res?.message || `Report generated: ${res?.report?.title || res?.report?.id || 'done'}.`);
      const h = await deanPortalService.getDeanReportHistory(user).catch(() => ({ data: [] }));
      setHistory(h?.data || h?.reports || []);
    } catch (err) { setGenErr(err?.message || 'Report generation failed.'); }
    finally { setGenerating(false); }
  };

  if (!can(DEAN_PERMISSIONS.DEAN_REPORT_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view reports.</div>;
  if (loading) return <Loader message="Loading reports..." />;
  if (error) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Reports</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Generate cross-department reports within your assigned scope</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Report Types ({(types || []).length})</h3>
          {(types || []).length === 0 ? <p className="text-xs text-slate-500">No report types available.</p> : (
            <ul className="text-xs space-y-1.5">
              {(types || []).map((t, i) => (
                <li key={t.id || i} className="border border-slate-200 rounded-lg p-2.5 font-medium text-slate-700">{t.title || t.name || t.id}</li>
              ))}
            </ul>
          )}
          <h3 className="text-sm font-bold text-slate-900 pt-2">History ({(history || []).length})</h3>
          {(history || []).length === 0 ? <p className="text-xs text-slate-500">No generated reports yet.</p> : (
            <ul className="text-xs space-y-1.5 max-h-48 overflow-y-auto">
              {(history || []).slice(0, 10).map((h, i) => (
                <li key={h.id || i} className="flex justify-between border border-slate-200 rounded-lg p-2.5"><span className="font-bold text-slate-800">{h.title || h.id}</span><span className="text-slate-500">{h.status || h.createdAt || ''}</span></li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Generate Report</h3>
          {genMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs font-medium">{genMsg}</div>}
          {genErr && <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs font-medium">{genErr}</div>}
          <form onSubmit={generate} className="space-y-2">
            <select value={form.reportConfigId} onChange={(e) => setForm({ ...form, reportConfigId: e.target.value })} required className={`${inputCls} w-full`}>
              <option value="">Select report type...</option>
              {(types || []).map((t, i) => <option key={t.id || i} value={t.id}>{t.title || t.name || t.id}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} placeholder="Academic year" className={inputCls} />
              <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className={inputCls}>
                {['PDF', 'EXCEL', 'CSV'].map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600 mb-1.5">Departments (assigned only)</p>
              <div className="flex flex-wrap gap-2">
                {(assignedDepartments || []).map((d) => (
                  <label key={d.code} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.departmentCodes.includes(d.code)} onChange={() => toggleDept(d.code)} className="accent-indigo-600" />
                    {d.code}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" disabled={generating || !form.reportConfigId} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold">Generate</button>
          </form>
        </Card>
      </div>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">AQAR Overview (view-only)</h3>
        <p className="text-[11px] text-slate-500">AQAR finalization stays with IQAC roles. Deans monitor departmental contributions only.</p>
        {!aqar ? <EmptyState title="No AQAR data" description="AQAR overview is unavailable." /> : (
          <div className="space-y-2">
            {(aqar.departments || []).map((d) => (
              <div key={d.code} className="border border-slate-200 rounded-lg p-3 text-xs">
                <div className="flex justify-between font-bold text-slate-800"><span>{d.code} — {d.name}</span><span>Readiness {d.readiness}% • Verified {d.verifiedContributions}</span></div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1.5"><div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, Number(d.readiness) || 0)}%` }} /></div>
              </div>
            ))}
            {(aqar.reports || []).length > 0 && (
              <p className="text-[11px] text-slate-500">Recent AQAR reports: {(aqar.reports || []).slice(0, 5).map((r) => r.title || r.id).join(' • ')}</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
