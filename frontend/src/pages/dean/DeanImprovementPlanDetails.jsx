import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS, hasDeanPermission } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

export const DeanImprovementPlanDetails = () => {
  const { planId } = useParams();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user || !planId) return undefined;
    setLoading(true);
    setError(null);
    deanPortalService.getImprovementPlanById(planId, user)
      .then((res) => { if (!cancelled) setRecord(res?.data || null); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load improvement plan.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, planId]);

  if (!hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_IMPROVEMENT_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view improvement plans.</div>;
  if (loading) return <Loader message="Loading improvement plan..." />;
  if (error) {
    const denied = /outside your assigned scope/i.test(error);
    return (
      <div className="space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{denied ? 'Access denied: this record belongs to a department outside your assigned scope.' : error}</div>
        <Link to="/dean/improvement-plans" className="text-xs font-bold text-indigo-700 underline">Back to Improvement Plans</Link>
      </div>
    );
  }
  if (!record) return <EmptyState title="Not found" description="Improvement plan not found." />;

  const milestones = record.milestones || record.actions || [];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <Link to="/dean/improvement-plans" className="text-xs font-bold text-indigo-700 underline">← Improvement Plans</Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">{record.title || record.id}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{record.departmentCode || record.deptCode} • {record.status}</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Plan Detail</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[['Objective', record.objective], ['Owner', record.owner || record.ownerName], ['Start Date', record.startDate], ['Target Date', record.targetDate || record.dueDate], ['Progress', record.progress != null ? `${record.progress}%` : null]].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-lg p-2.5"><dt className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">{k}</dt><dd className="font-semibold text-slate-800 mt-0.5">{v || '—'}</dd></div>
          ))}
        </dl>
        {record.description && <p className="text-xs text-slate-600 leading-relaxed">{record.description}</p>}
      </Card>
      <Card className="p-4 sm:p-6 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Milestones ({Array.isArray(milestones) ? milestones.length : 0})</h3>
        {!Array.isArray(milestones) || milestones.length === 0 ? <p className="text-xs text-slate-500">No milestones recorded.</p> : (
          <ul className="text-xs space-y-1.5">
            {milestones.map((m, i) => (
              <li key={m.id || i} className="flex justify-between border border-slate-200 rounded-lg p-2.5">
                <span className="font-bold text-slate-800">{typeof m === 'string' ? m : (m.title || m.id)}</span>
                <span className="text-slate-500">{typeof m === 'string' ? '' : (m.status || '')}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
