import React from 'react';
import { Search } from 'lucide-react';
import { Card } from '../common/Card';

const normalizeOptions = (options) => {
  if (!Array.isArray(options)) return [];
  return options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );
};

export const DepartmentFilterBar = ({
  search,
  onSearchChange,
  filters = [],
  onFilterChange,
  searchPlaceholder = 'Search...',
}) => {
  const filterList = Array.isArray(filters) ? filters : [];

  const handleSearch = (e) => {
    if (typeof onSearchChange === 'function') onSearchChange(e.target.value);
  };

  const handleFilter = (key, value) => {
    if (typeof onFilterChange === 'function') onFilterChange(key, value);
  };

  return (
    <Card className="p-4" aria-label="Department filters">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="dept-search" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Search
          </label>
          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="dept-search"
              type="search"
              value={search ?? ''}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {filterList.map((filter) => {
          const opts = normalizeOptions(filter?.options);
          const key = filter?.key || filter?.name || 'filter';
          return (
            <div key={key} className="min-w-[150px] flex-1 sm:flex-none">
              <label
                htmlFor={`dept-filter-${key}`}
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 capitalize"
              >
                {filter?.label || key}
              </label>
              <select
                id={`dept-filter-${key}`}
                value={filter?.value ?? ''}
                onChange={(e) => handleFilter(key, e.target.value)}
                aria-label={filter?.label || key}
                className="w-full sm:w-auto px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">{filter?.placeholder || 'All'}</option>
                {opts.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
