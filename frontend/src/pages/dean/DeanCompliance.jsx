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

export const DeanCompliance = () => {
  const { departmentId } = useParams();
  const { user } = useAuth();
  const { assignedDepartments, selectedDepartments, setSelectedDepartments, can } = useDeanPortal(user);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    const selection = departmentId ? [departmentId] : selectedDepartments;
    deanPortalService.getComplianceSummary(user, selection.length > 0 ? selection : undefined)
      .then((res) => { if (!cancelled) setRows(res?.data || []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load compliance summary.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, departmentId, JSON.stringify(selectedDepartments)]);

  if (!can(DEAN_PERMISSIONS.DEAN_COMPLIANCE_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view compliance.</div>;
  if (loading) return <Loader message="Loading compliance overview..." />;
  if (error) {
    const denied = /outside your scope/i.test(error);
    return (
      <div className="space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{denied ? 'Access denied: this department is outside your assigned scope.' : error}</div>
        <Link to="/dean/compliance" className="text-xs font-bold text-indigo-700 underline">Back to Compliance</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        {departmentId && <Link to="/dean/compliance" className="text-xs font-bold text-indigo-700 underline">← Compliance</Link>}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
          {departmentId ? `Compliance — ${rows[0]?.name || departmentId}` : 'Compliance Monitoring'}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">View-only compliance tracking across your assigned departments</p>
      </div>
      {!departmentId && (
        <Card className="p-4 sm:p-6 space-y-3">
          <DepartmentScopeSelector assigned={assignedDepartments} selected={selectedDepartments} onChange={setSelectedDepartments} />
        </Card>
      )}
      {(rows || []).length === 0 ? <EmptyState title="No compliance data" description="No compliance data for the current selection." /> : (
        <div className="space-y-4">
          {rows.map((d) => (
            <Card key={d.code} className="p-4 sm:p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900">{d.name} ({d.code})</h3>
                <p className="text-xs font-bold text-slate-600">Rate {d.complianceRate ?? '—'}% • Pending {d.pending} • Overdue {d.overdue}</p>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, Number(d.complianceRate) || 0)}%` }} /></div>
              {(d.records || []).length === 0 ? <p className="text-xs text-slate-500">No compliance records.</p> : (
                <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                  <table className="w-full text-left text-xs">
                    <thead><tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                      <th className="p-3">Record</th><th className="p-3 text-center">Status</th><th className="p-3 text-center">Due</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(d.records || []).slice(0, 10).map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-bold text-slate-900">{r.title || r.id}</td>
                          <td className="p-3 text-center">{r.status}</td>
                          <td className="p-3 text-center">{r.dueDate || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!departmentId && <Link to={`/dean/compliance/${d.code}`} className="inline-block text-xs font-bold text-indigo-700 underline">Open department focus →</Link>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
