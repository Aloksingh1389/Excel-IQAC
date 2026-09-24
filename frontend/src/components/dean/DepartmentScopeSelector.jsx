import React from 'react';
import { Building2 } from 'lucide-react';
import { Card } from '../common/Card';

export const DepartmentScopeSelector = ({
  assigned = [],
  selected = [],
  onChange,
}) => {
  const list = Array.isArray(assigned) ? assigned : [];
  const sel = Array.isArray(selected) ? selected : [];
  const allSelected = sel.length === 0 || (list.length > 0 && sel.length === list.length);

  const toggleAll = () => {
    if (typeof onChange !== 'function') return;
    if (allSelected) {
      // Deselect-all not meaningful for scope; selecting all codes explicitly keeps semantics clear.
      // Empty array = all per contract, so emit full list when currently "all".
      onChange([]);
    } else {
      onChange(list.map((d) => d?.code).filter(Boolean));
    }
  };

  const toggleOne = (code) => {
    if (typeof onChange !== 'function' || !code) return;
    const base = allSelected ? list.map((d) => d?.code).filter(Boolean) : [...sel];
    if (base.includes(code)) {
      const next = base.filter((c) => c !== code);
      onChange(next);
    } else {
      onChange([...base, code]);
    }
  };

  return (
    <Card className="p-5" aria-label="Department scope selector">
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-4 h-4 text-indigo-600" aria-hidden="true" />
        <h3 className="text-sm font-bold text-slate-800">Department Scope</h3>
      </div>

      <label className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors mb-2">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
          className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
          aria-label="All assigned departments"
        />
        <span className="text-sm font-semibold text-slate-700">All assigned departments</span>
        <span className="ml-auto text-xs text-slate-400 font-medium">
          {allSelected ? `${list.length} selected` : `${sel.length} of ${list.length}`}
        </span>
      </label>

      {list.length === 0 ? (
        <p className="text-xs text-slate-500 px-1 py-2">No departments assigned.</p>
      ) : (
        <ul className="space-y-1 max-h-56 overflow-y-auto" role="group" aria-label="Assigned departments">
          {list.map((d, idx) => {
            const code = d?.code ?? `dept-${idx}`;
            const checked = allSelected || sel.includes(d?.code);
            return (
              <li key={d?.code ?? idx}>
                <label className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOne(d?.code)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    aria-label={`Select ${d?.name || d?.code || code}`}
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-700 truncate">
                      {d?.name || d?.code || '—'}
                    </span>
                    {d?.name && d?.code && (
                      <span className="block text-[11px] text-slate-400 font-medium">{d.code}</span>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
        Only assigned departments can be selected.
      </p>
    </Card>
  );
};
