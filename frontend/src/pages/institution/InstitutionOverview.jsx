import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInstitution } from '../../hooks/useInstitution';
import { storage } from '../../utils/storage';
import { InstitutionSummary } from '../../components/institution/InstitutionSummary';
import { InstitutionStatGrid } from '../../components/institution/InstitutionStatGrid';
import { InstitutionStructure } from '../../components/institution/InstitutionStructure';
import { PerformanceSummary } from '../../components/institution/PerformanceSummary';
import { DepartmentFilters } from '../../components/institution/DepartmentFilters';
import { DepartmentTable } from '../../components/institution/DepartmentTable';
import { DepartmentCard } from '../../components/institution/DepartmentCard';
import { AttentionRequired } from '../../components/institution/AttentionRequired';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Building2, ArrowRight, Layers, AlertCircle, RefreshCw } from 'lucide-react';

export const InstitutionOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState(() => storage.get('iqac_dept_view_mode', 'table'));

  const {
    institution,
    academic,
    departments,
    performance,
    attentionItems,
    loading,
    error,
    selectedYear,
    refetch,
  } = useInstitution({
    searchTerm,
    statusFilter,
    sortBy,
    sortOrder,
  });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    storage.set('iqac_dept_view_mode', mode);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setSortBy('name');
  };

  if (loading && !institution) {
    return <Loader message={`Loading institutional data for Academic Year ${selectedYear}...`} />;
  }

  if (error) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12 bg-white rounded-2xl border border-rose-200">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Unable to load institution data</h3>
          <p className="text-xs text-slate-500">{error}</p>
        </div>
        <Button variant="primary" size="sm" icon={RefreshCw} onClick={refetch}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="space-y-0.5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Institution Overview
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            A centralized overview of institutional structure and current performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Academic Year: {selectedYear}
          </span>
          <Link to="/director/institution/departments">
            <Button variant="outline" size="sm">
              All Departments ({departments.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Institution Summary Card */}
      <InstitutionSummary institution={institution} academicYear={selectedYear} />

      {/* 3. Key Institution Numbers & Academic Overview */}
      <InstitutionStatGrid
        institution={institution}
        academic={academic}
        academicYear={selectedYear}
      />

      {/* 4. Visual Governance & Structure Hierarchy */}
      <InstitutionStructure institution={institution} />

      {/* 5. Year-over-Year Performance Summary Table */}
      <PerformanceSummary performance={performance} />

      {/* 6. Department Overview Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Department Overview</h3>
            <p className="text-xs text-slate-500">
              Comparative monitoring across all academic divisions for AY {selectedYear}
            </p>
          </div>

          <Link
            to="/director/institution/departments"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Search & Filters */}
        <DepartmentFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          totalCount={institution?.departments || 12}
          filteredCount={departments.length}
          onClearFilters={handleClearFilters}
        />

        {/* Department Presentation View (Table vs Cards) */}
        {departments.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No Department Data Available"
            description={`There are no departments matching your filter criteria for Academic Year ${selectedYear}.`}
            action={
              <Button variant="outline" size="xs" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            }
          />
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        ) : (
          <DepartmentTable departments={departments} />
        )}
      </div>

      {/* 7. Institutional Attention Required Section */}
      <AttentionRequired items={attentionItems} />
    </div>
  );
};
