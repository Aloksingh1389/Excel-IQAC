import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Filter, 
  RotateCcw 
} from 'lucide-react';
import { Loader } from '../common/Loader';
import { EmptyState } from '../common/Loader';
import { Button } from '../common/Button';

export const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-600">
      <div className="flex items-center gap-2">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span>
          entries &bull; Showing <strong className="font-semibold text-slate-900">{startItem}</strong> to{' '}
          <strong className="font-semibold text-slate-900">{endItem}</strong> of{' '}
          <strong className="font-semibold text-slate-900">{totalItems}</strong> entries
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="px-3 py-1 font-semibold text-slate-800 bg-white border border-slate-200 rounded">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
          title="Next Page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  filters = null,
  emptyTitle = 'No records available',
  emptyDescription = 'No entries match the selected parameters.',
  onRowClick = null,
  actions = null,
  pageSize = 10,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase().trim();
    return data.filter((row) => {
      if (searchKeys.length > 0) {
        return searchKeys.some((k) => {
          const val = row[k];
          return val != null && String(val).toLowerCase().includes(term);
        });
      }
      return Object.values(row).some((val) => {
        return val != null && String(val).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchKeys]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, safePage, rowsPerPage]);

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        if (prev.direction === 'asc') return { key: columnKey, direction: 'desc' };
        return { key: null, direction: 'asc' };
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Bar with Search and Actions */}
      <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          {filters}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${
                    col.sortable ? 'cursor-pointer select-none hover:bg-slate-100' : ''
                  } ${col.className || ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 ${
                      col.align === 'right' ? 'justify-end w-full' : col.align === 'center' ? 'justify-center w-full' : ''
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-300" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <Loader message="Loading data..." />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-blue-50/40' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3.5 px-4 text-slate-700 align-middle ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      } ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Bar */}
      {!loading && totalItems > 0 && (
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          pageSize={rowsPerPage}
          totalItems={totalItems}
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(sz) => {
            setRowsPerPage(sz);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
};
