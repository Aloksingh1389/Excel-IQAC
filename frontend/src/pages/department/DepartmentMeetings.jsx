import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { DepartmentMeetingTable } from '../../components/department';

export const DepartmentMeetings = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    departmentPortalService.getDepartmentMeetings({}, user)
      .then((res) => { if (!cancelled) setItems(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load meetings.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role, user?.departmentCode]);

  if (loading) return <Loader message="Loading department meetings..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Meetings</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Meetings in your department scope</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-4">
        {items.length === 0 ? (
          <EmptyState title="No meetings found" description="No department meetings scheduled." />
        ) : (
          <DepartmentMeetingTable items={items} />
        )}
      </Card>
    </div>
  );
};
