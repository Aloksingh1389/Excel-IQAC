import React from 'react';
import { Search, Filter, RotateCcw, Building2, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';

export const ReportFilterBar = ({
  search = '',
  onSearchChange = () => {},
  category = 'ALL',
  onCategoryChange = () => {},
  academicYear = 'ALL',
  onAcademicYearChange = () => {},
  department = 'ALL',
  onDepartmentChange = () => {},
  status = 'ALL',
  onStatusChange = () => {},
  onClear = () => {},
  categories = [],
  showDepartment = true,
  showStatus = false,
  className = '',
}) => {
  const DEPARTMENTS = [
    { value: 'ALL', label: 'All Departments' },
    { value: 'CSE', label: 'Computer Science (CSE)' },
    { value: 'AIDS', label: 'AI & Data Science' },
    { value: 'AIML', label: 'CSE (AI & ML)' },
    { value: 'CSBS', label: 'CS & Business Systems' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'ECE', label: 'Electronics & Comm (ECE)' },
    { value: 'EEE', label: 'Electrical & Electronics' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' },
    { value: 'BT', label: 'Biotechnology' },
    { value: 'BME', label: 'Biomedical Engineering' },
    { value: 'CHEM', label: 'Chemical Engineering' },
  ];

  const ACADEMIC_YEARS = [
    { value: 'ALL', label: 'All Academic Years' },
    { value: '2026-27', label: 'AY 2026-27 (Current)' },
    { value: '2025-26', label: 'AY 2025-26' },
    { value: '2024-25', label: 'AY 2024-25' },
    { value: '2023-24', label: 'AY 2023-24' },
  ];

  const STATUSES = [
    { value: 'ALL', label: 'All Statuses (Excl. Archived)' },
    { value: 'GENERATED', label: 'Generated & Active' },
    { value: 'ARCHIVED', label: 'Archived Dossiers' },
    { value: 'DRAFT', label: 'Draft Reports' },
  ];

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'ALL' ||
    academicYear !== 'ALL' ||
    department !== 'ALL' ||
    status !== 'ALL';

  return (
    <div className={`bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3 ${className}`}>
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports by title, category, keyword or ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by Category"
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="INSTITUTIONAL">Institutional</option>
            <option value="ACADEMIC">Academic</option>
            <option value="RESEARCH">Research & IPR</option>
            <option value="PLACEMENT">Placement</option>
            <option value="FACULTY">Faculty & HR</option>
            <option value="STUDENT">Student Affairs</option>
            <option value="IQAC">IQAC & Quality</option>
          </select>

          {/* Academic Year Dropdown */}
          <select
            value={academicYear}
            onChange={(e) => onAcademicYearChange(e.target.value)}
            aria-label="Filter by Academic Year"
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {ACADEMIC_YEARS.map((y) => (
              <option key={y.value} value={y.value}>
                {y.label}
              </option>
            ))}
          </select>

          {/* Department Filter (if enabled) */}
          {showDepartment && (
            <select
              value={department}
              onChange={(e) => onDepartmentChange(e.target.value)}
              aria-label="Filter by Department"
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          )}

          {/* Status Filter (if enabled) */}
          {showStatus && (
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by Status"
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="xs"
              icon={RotateCcw}
              onClick={onClear}
              className="text-slate-600 hover:text-indigo-600"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
