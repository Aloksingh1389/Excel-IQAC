import React from 'react';
import { Search, Filter, X, Table2, Grid2X2, ArrowUpDown } from 'lucide-react';
import { Button } from '../common/Button';

export const DepartmentFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  sortOrder,
  onToggleSortOrder,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  onClearFilters,
}) => {
  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'ALL';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by department name, code, or HOD..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50/70 hover:bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none pl-9 pr-3 py-2 transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls & View Mode Toggle */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          {/* Performance Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by performance status"
              className="bg-transparent border-0 font-semibold text-slate-800 text-xs focus:ring-0 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Performance</option>
              <option value="Excellent">Excellent (90%+)</option>
              <option value="Good">Good (80-89%)</option>
              <option value="Needs Attention">Needs Attention (&lt;80%)</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort departments by"
              className="bg-transparent border-0 font-semibold text-slate-800 text-xs focus:ring-0 focus:outline-none cursor-pointer"
            >
              <option value="name">Sort: Department Name</option>
              <option value="students">Sort: Student Count</option>
              <option value="faculty">Sort: Faculty Count</option>
              <option value="passPercentage">Sort: Pass %</option>
              <option value="placementPercentage">Sort: Placement %</option>
              <option value="publications">Sort: Publications</option>
            </select>
          </div>

          {/* View Mode Toggle Button Group */}
          <div className="inline-flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              title="Table View"
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Table2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('card')}
              title="Card Grid View"
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Indicators & Reset */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> departments
          </span>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
