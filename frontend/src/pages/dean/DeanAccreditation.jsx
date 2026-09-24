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

export const DeanAccreditation = () => {
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
    deanPortalService.getAccreditationSummary(user, selection.length > 0 ? selection : undefined)
      .then((res) => { if (!cancelled) setRows(res?.data || []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load accreditation summary.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, departmentId, JSON.stringify(selectedDepartments)]);

  if (!can(DEAN_PERMISSIONS.DEAN_ACCREDITATION_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view accreditation.</div>;
  if (loading) return <Loader message="Loading accreditation readiness..." />;
  if (error) {
    const denied = /outside your scope/i.test(error);
    return (
      <div className="space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{denied ? 'Access denied: this department is outside your assigned scope.' : error}</div>
        <Link to="/dean/accreditation" className="text-xs font-bold text-indigo-700 underline">Back to Accreditation</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        {departmentId && <Link to="/dean/accreditation" className="text-xs font-bold text-indigo-700 underline">← Accreditation</Link>}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
          {departmentId ? `Accreditation — ${rows[0]?.name || departmentId}` : 'Accreditation Readiness'}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">NAAC criteria 1–7 readiness across your assigned departments (view-only; framework managed by IQAC)</p>
      </div>
      {!departmentId && (
        <Card className="p-4 sm:p-6 space-y-3">
          <DepartmentScopeSelector assigned={assignedDepartments} selected={selectedDepartments} onChange={setSelectedDepartments} />
        </Card>
      )}
      {(rows || []).length === 0 ? <EmptyState title="No accreditation data" description="No accreditation data for the current selection." /> : (
        <div className="space-y-4">
          {rows.map((d) => (
            <Card key={d.code} className="p-4 sm:p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900">{d.name} ({d.code})</h3>
                <p className="text-sm font-black text-indigo-700">Readiness {d.readiness ?? '—'}%</p>
              </div>
              {d.criteria ? (
                <ul className="text-xs space-y-1.5">
                  {Object.entries(d.criteria).map(([k, v]) => (
                    <li key={k}>
                      <div className="flex justify-between font-medium text-slate-700"><span>Criterion {k}</span><span className="font-bold">{v}%</span></div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-0.5"><div className={`h-full ${(Number(v) || 0) < 65 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, Number(v) || 0)}%` }} /></div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-xs text-slate-500">No criterion data.</p>}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-1.5">Gaps ({(d.gaps || []).length})</h4>
                {(d.gaps || []).length === 0 ? <p className="text-xs text-slate-500">No open gaps.</p> : (
                  <ul className="text-xs space-y-1.5">
                    {(d.gaps || []).slice(0, 8).map((g, i) => (
                      <li key={g.id || i} className="border border-slate-200 rounded-lg p-2.5 text-slate-700">{g.title || g.description || g.id}</li>
                    ))}
                  </ul>
                )}
              </div>
              {!departmentId && <Link to={`/dean/accreditation/${d.code}`} className="inline-block text-xs font-bold text-indigo-700 underline">Open department focus →</Link>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
