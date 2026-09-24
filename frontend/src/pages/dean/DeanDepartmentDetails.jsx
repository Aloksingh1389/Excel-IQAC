import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS, hasDeanPermission } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { DeanDepartmentSummary } from '../../components/dean';

const Section = ({ title, children }) => (
  <Card className="p-4 sm:p-6 space-y-3">
    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">{title}</h3>
    {children}
  </Card>
);

export const DeanDepartmentDetails = () => {
  const { departmentId } = useParams();
  const { user } = useAuth();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user || !departmentId) return undefined;
    setLoading(true);
    setError(null);
    deanPortalService.getDepartmentDetails(departmentId, user)
      .then((res) => { if (!cancelled) setDetail(res?.data || null); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load department details.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, departmentId]);

  if (!hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_DEPARTMENT_DETAILS_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view department details.</div>;
  if (loading) return <Loader message="Loading department details..." />;
  if (error) {
    const denied = /outside your assigned scope/i.test(error);
    return (
      <div className="space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">
          {denied ? 'Access denied: this department is outside your assigned scope.' : error}
        </div>
        <Link to="/dean/departments" className="text-xs font-bold text-indigo-700 underline">Back to Departments</Link>
      </div>
    );
  }
  if (!detail) return <EmptyState title="No details" description="Department details are unavailable." />;

  const op = detail.operational || {};
  const compliance = detail.compliance || {};
  const accred = detail.accreditation || {};
  const quality = detail.quality || {};

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <Link to="/dean/departments" className="text-xs font-bold text-indigo-700 underline">← Departments</Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">{detail.department?.name}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{detail.department?.code} • HOD: {detail.department?.hodName || '—'}</p>
      </div>

      <Section title="Department Summary"><DeanDepartmentSummary detail={detail} /></Section>

      <Section title={`Recent Submissions (${(op.pendingSubmissions || []).length} pending, ${(op.returnedSubmissions || []).length} returned)`}>
        {(op.pendingSubmissions || []).length === 0 && (op.returnedSubmissions || []).length === 0
          ? <EmptyState title="No open submissions" description="No pending or returned submissions for this department." />
          : (
            <ul className="space-y-2 text-xs">
              {[...(op.pendingSubmissions || []), ...(op.returnedSubmissions || [])].slice(0, 10).map((s) => (
                <li key={s.id} className="border border-slate-200 rounded-lg p-2.5 flex flex-wrap justify-between gap-2">
                  <span className="font-bold text-slate-800">{s.submissionId} — {s.title}</span>
                  <span className="font-semibold text-slate-500">{s.status}</span>
                </li>
              ))}
            </ul>
          )}
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title={`Quality (Score ${quality.score ?? '—'})`}>
          {quality.categories ? (
            <ul className="text-xs space-y-1.5">
              {Object.entries(quality.categories).map(([k, v]) => (
                <li key={k} className="flex justify-between font-medium text-slate-700"><span>{k}</span><span className="font-bold">{v}</span></li>
              ))}
            </ul>
          ) : <p className="text-xs text-slate-500">No category data.</p>}
        </Section>
        <Section title={`Compliance (${compliance.rate ?? '—'}%)`}>
          {(compliance.records || []).length === 0 ? <p className="text-xs text-slate-500">No compliance records.</p> : (
            <ul className="text-xs space-y-1.5">
              {(compliance.records || []).slice(0, 8).map((r) => (
                <li key={r.id} className="flex justify-between font-medium text-slate-700"><span>{r.title || r.id}</span><span className="font-bold">{r.status}</span></li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section title={`Accreditation Gaps (${(accred.gaps || []).length}) • Readiness ${accred.readiness ?? '—'}%`}>
        {(accred.gaps || []).length === 0 ? <p className="text-xs text-slate-500">No accreditation gaps recorded.</p> : (
          <ul className="text-xs space-y-1.5">
            {(accred.gaps || []).slice(0, 8).map((g, i) => (
              <li key={g.id || i} className="border border-slate-200 rounded-lg p-2.5 text-slate-700">{g.title || g.description || g.id}</li>
            ))}
          </ul>
        )}
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title={`Improvement Plans (${(detail.improvementPlans || []).length})`}>
          {(detail.improvementPlans || []).length === 0 ? <p className="text-xs text-slate-500">No improvement plans.</p> : (
            <ul className="text-xs space-y-1.5">
              {(detail.improvementPlans || []).slice(0, 8).map((p) => (
                <li key={p.id} className="flex justify-between font-medium text-slate-700"><span>{p.title || p.id}</span><span className="font-bold">{p.status}</span></li>
              ))}
            </ul>
          )}
        </Section>
        <Section title={`Meetings (${(detail.meetings || []).length})`}>
          {(detail.meetings || []).length === 0 ? <p className="text-xs text-slate-500">No meetings recorded.</p> : (
            <ul className="text-xs space-y-1.5">
              {(detail.meetings || []).slice(0, 8).map((m) => (
                <li key={m.id} className="flex justify-between font-medium text-slate-700"><span>{m.title || m.id}</span><span className="font-bold">{m.status}</span></li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
};
