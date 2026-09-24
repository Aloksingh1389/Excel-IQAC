import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { DepartmentFilterBar, DepartmentEvidenceHealth, DepartmentEvidenceTable } from '../../components/department';

export const DepartmentEvidence = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', type: '' });

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const [h, e] = await Promise.all([
          departmentPortalService.getDepartmentEvidenceHealth(user),
          departmentPortalService.getDepartmentEvidence({ search: filters.search || undefined, status: filters.status || undefined, type: filters.type || undefined }, user),
        ]);
        if (!cancelled) {
          setHealth(h.data);
          setItems(Array.isArray(e.data) ? e.data : []);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load evidence.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, user?.role, user?.departmentCode, filters.search, filters.status, filters.type]);

  if (loading) return <Loader message="Loading department evidence..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Evidence</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Evidence health and records for your department</p>
      </div>
      <DepartmentEvidenceHealth health={health} />
      <Card className="p-4 sm:p-6 space-y-4">
        <DepartmentFilterBar
          search={filters.search}
          onSearchChange={(v) => setFilters((f) => ({ ...f, search: v }))}
          searchPlaceholder="Search evidence..."
          filters={[
            { key: 'status', label: 'Status', value: filters.status, options: ['UPLOADED', 'UNDER_REVIEW', 'RESUBMITTED', 'VERIFIED', 'RETURNED'] },
            { key: 'type', label: 'Type', value: filters.type, options: ['PDF', 'IMAGE', 'LINK', 'DOCUMENT', 'VIDEO'] },
          ]}
          onFilterChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        />
        {items.length === 0 ? (
          <EmptyState title="No evidence found" description="No evidence records match the current filters." />
        ) : (
          <DepartmentEvidenceTable evidence={items} onSelect={(id) => navigate(`/department/evidence/${id}`)} />
        )}
      </Card>
    </div>
  );
};
