import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS, hasDeanPermission } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

export const DeanMeetings = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    deanPortalService.getDeanMeetings({}, user)
      .then((res) => { if (!cancelled) setItems(res?.data || []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load meetings.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  if (!hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_MEETING_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view meetings.</div>;
  if (loading) return <Loader message="Loading meetings..." />;
  if (error) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Meetings</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Department meetings across your assigned scope (monitoring only)</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Meetings ({(items || []).length})</h3>
        {(items || []).length === 0 ? <EmptyState title="No meetings" description="No meetings recorded in your assigned scope." /> : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead><tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                <th className="p-3">Title</th><th className="p-3 text-center">Dept</th><th className="p-3 text-center">Date</th><th className="p-3 text-center">Status</th><th className="p-3 text-right">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(items || []).map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{m.title || m.id}</td>
                    <td className="p-3 text-center">{m.departmentCode || m.deptCode}</td>
                    <td className="p-3 text-center">{m.scheduledAt || m.date || m.meetingDate || '—'}</td>
                    <td className="p-3 text-center">{m.status}</td>
                    <td className="p-3 text-right"><Link to={`/dean/meetings/${m.id}`} className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
