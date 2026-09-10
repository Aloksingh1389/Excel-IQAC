import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInstitution } from '../../hooks/useInstitution';
import { storage } from '../../utils/storage';
import { DepartmentFilters } from '../../components/institution/DepartmentFilters';
import { DepartmentTable } from '../../components/institution/DepartmentTable';
import { DepartmentCard } from '../../components/institution/DepartmentCard';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Building2, ArrowLeft, RefreshCw } from 'lucide-react';

export const Departments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState(() => storage.get('iqac_dept_view_mode', 'table'));

  const {
    departments,
    institution,
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

  if (loading && (!departments || departments.length === 0)) {
    return <Loader message={`Loading departments for Academic Year ${selectedYear}...`} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Link to="/director/institution">
              <Button variant="ghost" size="xs" icon={ArrowLeft}>
                Overview
              </Button>
            </Link>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Academic Departments
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Directory of all 12 academic and engineering departments, faculty strength, and pass metrics for AY {selectedYear}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            AY: {selectedYear}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
            {departments.length} Departments
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
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

      {/* Presentation: Table or Card Grid */}
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
  );
};
