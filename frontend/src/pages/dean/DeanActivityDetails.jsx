import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS, hasDeanPermission } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

export const DeanActivityDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user || !id) return undefined;
    setLoading(true);
    setError(null);
    deanPortalService.getDeanActivityById(id, user)
      .then((res) => { if (!cancelled) setRecord(res?.data || null); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load activity.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, id]);

  if (!hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_ACTIVITY_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view activities.</div>;
  if (loading) return <Loader message="Loading activity details..." />;
  if (error) {
    const denied = /outside your assigned scope/i.test(error);
    return (
      <div className="space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{denied ? 'Access denied: this record belongs to a department outside your assigned scope.' : error}</div>
        <Link to="/dean/activities" className="text-xs font-bold text-indigo-700 underline">Back to Activities</Link>
      </div>
    );
  }
  if (!record) return <EmptyState title="Not found" description="Activity not found." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <Link to="/dean/activities" className="text-xs font-bold text-indigo-700 underline">← Activities</Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">{record.title || record.id}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{record.departmentCode || record.deptCode} • {record.status}</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Activity Detail</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[['Type', record.type], ['Start Date', record.startDate], ['End Date', record.endDate], ['Venue', record.venue], ['Coordinator', record.coordinatorName || record.coordinator], ['Participants', record.participantCount ?? record.participants]] .map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-lg p-2.5"><dt className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">{k}</dt><dd className="font-semibold text-slate-800 mt-0.5">{v ?? '—'}</dd></div>
          ))}
        </dl>
        {record.description && <p className="text-xs text-slate-600 leading-relaxed">{record.description}</p>}
        {record.outcomes && <p className="text-xs text-slate-600 leading-relaxed"><span className="font-bold">Outcomes: </span>{record.outcomes}</p>}
      </Card>
    </div>
  );
};
