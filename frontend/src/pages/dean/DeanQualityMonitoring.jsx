import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDeanPortal } from '../../hooks/useDeanPortal';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { DepartmentScopeSelector } from '../../components/dean';

export const DeanQualityMonitoring = () => {
  const { departmentId } = useParams();
  const { user } = useAuth();
  const { assignedDepartments, selectedDepartments, setSelectedDepartments, can } = useDeanPortal(user);
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    const selection = departmentId ? [departmentId] : selectedDepartments;
    deanPortalService.getQualitySummary(user, selection.length > 0 ? selection : undefined)
      .then((res) => { if (!cancelled) setPayload({ data: res?.data || [], indicators: res?.indicators || [], trendLabels: res?.trendLabels || [] }); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load quality summary.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, departmentId, JSON.stringify(selectedDepartments)]);

  if (!can(DEAN_PERMISSIONS.DEAN_QUALITY_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view quality monitoring.</div>;
  if (loading || !payload) return <Loader message="Loading quality monitoring..." />;
  if (error) {
    const denied = /outside your scope/i.test(error);
    return (
      <div className="space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{denied ? 'Access denied: this department is outside your assigned scope.' : error}</div>
        <Link to="/dean/quality" className="text-xs font-bold text-indigo-700 underline">Back to Quality Monitoring</Link>
      </div>
    );
  }

  const rows = payload.data || [];
  const labels = payload.trendLabels || [];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        {departmentId && <Link to="/dean/quality" className="text-xs font-bold text-indigo-700 underline">← Quality Monitoring</Link>}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
          {departmentId ? `Quality — ${rows[0]?.name || departmentId}` : 'Quality Monitoring'}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">View-only quality indicators across your assigned departments</p>
      </div>
      {!departmentId && (
        <Card className="p-4 sm:p-6 space-y-3">
          <DepartmentScopeSelector assigned={assignedDepartments} selected={selectedDepartments} onChange={setSelectedDepartments} />
        </Card>
      )}
      {rows.length === 0 ? <EmptyState title="No quality data" description="No quality data for the current selection." /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rows.map((d) => (
            <Card key={d.code} className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{d.name} ({d.code})</h3>
                <span className="text-lg font-black text-indigo-700">{d.score ?? '—'}</span>
              </div>
              {d.categories ? (
                <ul className="text-xs space-y-1.5">
                  {Object.entries(d.categories).map(([k, v]) => (
                    <li key={k}>
                      <div className="flex justify-between font-medium text-slate-700"><span>{k}</span><span className="font-bold">{v}</span></div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-0.5"><div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, Number(v) || 0)}%` }} /></div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-xs text-slate-500">No category data.</p>}
              {Array.isArray(d.trend) && d.trend.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-slate-200/80">
                  <table className="w-full text-[11px] text-center">
                    <thead><tr className="bg-slate-50 text-slate-500 font-bold">{labels.map((l) => <th key={l} className="p-2">{l}</th>)}</tr></thead>
                    <tbody><tr>{d.trend.slice(-labels.length).map((v, i) => <td key={i} className="p-2 font-bold text-slate-800">{v ?? '—'}</td>)}</tr></tbody>
                  </table>
                </div>
              )}
              {!departmentId && <Link to={`/dean/quality/${d.code}`} className="inline-block text-xs font-bold text-indigo-700 underline">Open department focus →</Link>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
