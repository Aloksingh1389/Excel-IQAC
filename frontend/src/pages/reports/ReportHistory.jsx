import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReports } from '../../hooks/useReports';
import { ReportFilterBar } from '../../components/reports/ReportFilterBar';
import { ReportHistoryTable } from '../../components/reports/ReportHistoryTable';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { History, Plus, ArrowLeft, Archive } from 'lucide-react';

export const ReportHistory = () => {
  const {
    history,
    categories,
    loading,
    error,
    archiveReport,
    filterHistory,
  } = useReports();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [academicYear, setAcademicYear] = useState('ALL');
  const [department, setDepartment] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  const applyFilters = (newFilters) => {
    filterHistory(newFilters);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    applyFilters({ search: val, category, academicYear, department, status });
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    applyFilters({ search, category: val, academicYear, department, status });
  };

  const handleAcademicYearChange = (val) => {
    setAcademicYear(val);
    applyFilters({ search, category, academicYear: val, department, status });
  };

  const handleDepartmentChange = (val) => {
    setDepartment(val);
    applyFilters({ search, category, academicYear, department: val, status });
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    applyFilters({ search, category, academicYear, department, status: val });
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('ALL');
    setAcademicYear('ALL');
    setDepartment('ALL');
    setStatus('ALL');
    applyFilters({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <Link to="/director/reports">
            <Button variant="ghost" size="xs" icon={ArrowLeft}>
              Report Center
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Report Generation Historical Ledger
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Complete institutional archive of compiled statutory reports, audit dossiers, and compliance records.
            </p>
          </div>
        </div>

        <Link to="/director/reports/generate">
          <Button variant="primary" size="sm" icon={Plus}>
            Generate New Report
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <ReportFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        academicYear={academicYear}
        onAcademicYearChange={handleAcademicYearChange}
        department={department}
        onDepartmentChange={handleDepartmentChange}
        status={status}
        onStatusChange={handleStatusChange}
        onClear={handleClearFilters}
        categories={categories}
        showDepartment
        showStatus
      />

      {/* History Table */}
      {loading ? (
        <Loader message="Loading institutional report archives..." />
      ) : (
        <ReportHistoryTable
          history={history}
          onArchive={archiveReport}
        />
      )}
    </div>
  );
};
