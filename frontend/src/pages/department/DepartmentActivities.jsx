import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { DepartmentFilterBar, DepartmentActivityTable } from '../../components/department';

export const DepartmentActivities = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '' });

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    departmentPortalService.getDepartmentActivities({ status: filters.status || undefined, search: filters.search || undefined }, user)
      .then((res) => { if (!cancelled) setItems(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load activities.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role, user?.departmentCode, filters.status, filters.search]);

  if (loading) return <Loader message="Loading department activities..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Activities</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Activities in your department scope</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-4">
        <DepartmentFilterBar
          search={filters.search}
          onSearchChange={(v) => setFilters((f) => ({ ...f, search: v }))}
          searchPlaceholder="Search activities..."
          filters={[
            { key: 'status', label: 'Status', value: filters.status, options: ['PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED'] },
          ]}
          onFilterChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        />
        {items.length === 0 ? (
          <EmptyState title="No activities found" description="No activities match the current filters." />
        ) : (
          <DepartmentActivityTable items={items} />
        )}
      </Card>
    </div>
  );
};
