import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { DepartmentFilterBar, DepartmentStaffTable } from '../../components/department';

export const DepartmentStaff = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', designation: '', status: '' });

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    departmentPortalService.getDepartmentStaff(user, filters)
      .then((res) => { if (!cancelled) setStaff(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load department staff.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role, user?.departmentCode, filters.search, filters.designation, filters.status]);

  if (loading) return <Loader message="Loading department staff..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Staff</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Staff roster for your department scope</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-4">
        <DepartmentFilterBar
          search={filters.search}
          onSearchChange={(v) => setFilters((f) => ({ ...f, search: v }))}
          searchPlaceholder="Search name or employee ID..."
          filters={[
            { key: 'designation', label: 'Designation', value: filters.designation, options: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'] },
            { key: 'status', label: 'Status', value: filters.status, options: ['Active', 'Inactive', 'On Leave'] },
          ]}
          onFilterChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        />
        {staff.length === 0 ? (
          <EmptyState title="No staff found" description="No staff members match the current filters." />
        ) : (
          <DepartmentStaffTable staff={staff} onSelect={(id) => navigate(`/department/staff/${id}`)} />
        )}
        <p className="text-[11px] text-slate-500 font-medium">Note: HOD/coordinator cannot delete staff or change roles.</p>
      </Card>
    </div>
  );
};
