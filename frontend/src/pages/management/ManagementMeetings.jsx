import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const Alert = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{message}</div>
);

const isUpcoming = (m) => {
  const d = m.date || m.scheduledAt || m.scheduledDate;
  if (!d) return false;
  const t = new Date(d).getTime();
  return !Number.isNaN(t) && t >= new Date(new Date().toDateString()).getTime();
};

export const ManagementMeetings = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getMeetingsOverview({}, user)
      .then((res) => { if (!cancelled) setRows(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load meetings.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  const upcoming = useMemo(() => rows.filter(isUpcoming), [rows]);
  const past = useMemo(() => rows.filter((m) => !isUpcoming(m)), [rows]);

  if (loading) return <Loader message="Loading meetings..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_MEETING_VIEW)) return <Alert message="You do not have permission to view meetings." />;

  const Table = ({ list, emptyTitle }) => (
    list.length === 0 ? <EmptyState title={emptyTitle} description="Nothing to display here." /> : (
      <div className="overflow-x-auto"><table className="min-w-full text-xs">
        <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
          <th className="py-2 pr-3">Meeting</th><th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Minutes</th>
        </tr></thead>
        <tbody>{list.slice(0, 40).map((m, i) => (
          <tr key={m.id || i} className="border-b border-slate-100">
            <td className="py-2 pr-3 font-bold text-slate-800">{m.title || m.agenda || m.id}</td>
            <td className="py-2 pr-3">{m.departmentCode || m.deptCode || '—'}</td>
            <td className="py-2 pr-3">{m.date || m.scheduledAt || m.scheduledDate || '—'}</td>
            <td className="py-2 pr-3">{m.minutesStatus || m.minutes || (m.hasMinutes ? 'Available' : 'Pending')}</td>
          </tr>
        ))}</tbody>
      </table></div>
    )
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Meeting Oversight</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{upcoming.length} upcoming • {past.length} past</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Upcoming ({upcoming.length})</h3>
        <Table list={upcoming} emptyTitle="No upcoming meetings" />
      </Card>
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Past ({past.length})</h3>
        <Table list={past} emptyTitle="No past meetings" />
      </Card>
    </div>
  );
};
