import React from 'react';
import { Filter, RotateCcw, Building2, BookOpen, Layers } from 'lucide-react';
import { Button } from '../common/Button';

export const AnalyticsFilterBar = ({
  filters = {},
  onFilterChange = () => {},
  onReset = () => {},
  showDepartment = true,
  showProgram = false,
  showSemester = false,
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

  const PROGRAMS = [
    { value: 'ALL', label: 'All Programs' },
    { value: 'UG', label: 'Undergraduate (B.Tech / B.E.)' },
    { value: 'PG', label: 'Postgraduate (M.Tech / M.E.)' },
    { value: 'PHD', label: 'Doctoral (Ph.D.)' },
  ];

  const SEMESTERS = [
    { value: 'ALL', label: 'All Semesters' },
    { value: 'Sem 1', label: 'Semester 1' },
    { value: 'Sem 2', label: 'Semester 2' },
    { value: 'Sem 3', label: 'Semester 3' },
    { value: 'Sem 4', label: 'Semester 4' },
    { value: 'Sem 5', label: 'Semester 5' },
    { value: 'Sem 6', label: 'Semester 6' },
    { value: 'Sem 7', label: 'Semester 7' },
    { value: 'Sem 8', label: 'Semester 8' },
  ];

  const hasActiveFilters =
    (filters.department && filters.department !== 'ALL') ||
    (filters.program && filters.program !== 'ALL') ||
    (filters.semester && filters.semester !== 'ALL');

  return (
    <div className={`bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 pr-1 select-none">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          <span>Analytics Filters:</span>
        </div>

        {/* Department Filter */}
        {showDepartment && (
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.department || 'ALL'}
              onChange={(e) => onFilterChange('department', e.target.value)}
              aria-label="Filter by Department"
              className="bg-transparent border-0 font-semibold text-slate-800 text-xs focus:ring-0 focus:outline-none cursor-pointer"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Program Filter */}
        {showProgram && (
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.program || 'ALL'}
              onChange={(e) => onFilterChange('program', e.target.value)}
              aria-label="Filter by Program"
              className="bg-transparent border-0 font-semibold text-slate-800 text-xs focus:ring-0 focus:outline-none cursor-pointer"
            >
              {PROGRAMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Semester Filter */}
        {showSemester && (
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.semester || 'ALL'}
              onChange={(e) => onFilterChange('semester', e.target.value)}
              aria-label="Filter by Semester"
              className="bg-transparent border-0 font-semibold text-slate-800 text-xs focus:ring-0 focus:outline-none cursor-pointer"
            >
              {SEMESTERS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="xs"
          icon={RotateCcw}
          onClick={onReset}
          className="text-slate-600 hover:text-indigo-600"
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
};
