import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { DepartmentFilterBar, DepartmentReviewTable } from '../../components/department';

export const DepartmentReviewCenter = () => {
  const { user, academicYear } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = {
    searchQuery: searchParams.get('search') || '',
    statusFilter: searchParams.get('status') || '',
    typeFilter: searchParams.get('type') || '',
    priority: searchParams.get('priority') || '',
    staff: searchParams.get('staff') || '',
  };

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    const svcFilters = {
      searchQuery: filters.searchQuery || undefined,
      statusFilter: filters.statusFilter === 'ALL' ? undefined : filters.statusFilter,
      typeFilter: filters.typeFilter === 'ALL' ? undefined : filters.typeFilter,
      academicYear,
    };
    departmentPortalService.getDepartmentSubmissions(svcFilters, user)
      .then((res) => {
        if (cancelled) return;
        let rows = Array.isArray(res.data) ? res.data : [];
        if (filters.priority) rows = rows.filter((r) => r.priority === filters.priority);
        if (filters.staff) {
          const q = filters.staff.toLowerCase();
          rows = rows.filter((r) => (r.submittedBy || '').toLowerCase().includes(q));
        }
        setSubmissions(rows);
      })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load submissions.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role, user?.departmentCode, searchParams, academicYear]);

  const patch = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  if (loading) return <Loader message="Loading review queue..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Review Center</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Submissions in your department scope</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-4">
        <DepartmentFilterBar
          search={filters.searchQuery}
          onSearchChange={(v) => patch('search', v)}
          searchPlaceholder="Search submissions..."
          filters={[
            { key: 'status', label: 'Status', value: filters.statusFilter, options: ['SUBMITTED', 'UNDER_REVIEW', 'RESUBMITTED', 'APPROVED', 'RETURNED', 'REJECTED', 'VERIFIED'] },
            { key: 'type', label: 'Type', value: filters.typeFilter, options: ['PUBLICATION', 'FDP', 'ACTIVITY', 'EVIDENCE', 'ACHIEVEMENT', 'RESEARCH'] },
            { key: 'priority', label: 'Priority', value: filters.priority, options: ['HIGH', 'MEDIUM', 'LOW'] },
          ]}
          onFilterChange={patch}
        />
        <input
          value={filters.staff}
          onChange={(e) => patch('staff', e.target.value)}
          placeholder="Filter by staff name..."
          className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white min-w-[200px]"
        />
        {submissions.length === 0 ? (
          <EmptyState title="No submissions found" description="No submissions match the current filters." />
        ) : (
          <DepartmentReviewTable submissions={submissions} onSelect={(id) => navigate(`/department/review/${id}`)} />
        )}
      </Card>
    </div>
  );
};
