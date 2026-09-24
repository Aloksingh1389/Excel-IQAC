import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import { Card, Badge } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

const statusVariant = (status) => {
  const s = String(status || '').toUpperCase();
  if (s.includes('COMPLETE') || s.includes('VERIFIED') || s.includes('APPROVED') || s.includes('MET')) return 'success';
  if (s.includes('PENDING') || s.includes('PARTIAL') || s.includes('PROGRESS') || s.includes('REVIEW')) return 'warning';
  if (s.includes('OVERDUE') || s.includes('MISSING') || s.includes('FAIL') || s.includes('REJECT')) return 'danger';
  if (s.includes('SUBMIT')) return 'info';
  return 'neutral';
};

const formatDate = (value) => {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString();
  } catch {
    return String(value);
  }
};

export const DepartmentComplianceTable = ({ records, onSelect }) => {
  const rows = Array.isArray(records) ? records : [];

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        title="No compliance records"
        description="No department compliance records found."
      />
    );
  }

  return (
    <Card className="overflow-hidden" aria-label="Department compliance table">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Requirement</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Due Date</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Progress</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Evidence</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((record, idx) => {
              const id = record?.id ?? record?.recordId ?? record?.requirementId ?? idx;
              const key = record?.id ?? record?.recordId ?? `compliance-${idx}`;
              const title =
                record?.title ?? record?.name ?? record?.requirement ?? record?.requirementTitle ?? `Requirement ${id}`;
              const due = record?.dueDate ?? record?.deadline ?? record?.due ?? null;
              const progress =
                record?.progress ?? record?.progressPct ?? record?.completion ?? record?.percent ?? 0;
              const progressNum = Number(progress) || 0;
              const evidenceStatus =
                record?.evidenceStatus ?? record?.evidence ?? record?.evidenceState ?? '—';
              const status = record?.status ?? record?.state ?? 'Unknown';
              return (
                <tr
                  key={key}
                  onClick={() => typeof onSelect === 'function' && onSelect(id)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && typeof onSelect === 'function') {
                      e.preventDefault();
                      onSelect(id);
                    }
                  }}
                  tabIndex={typeof onSelect === 'function' ? 0 : undefined}
                  aria-label={`View compliance record ${title}`}
                  className={typeof onSelect === 'function' ? 'hover:bg-slate-50 cursor-pointer transition-colors' : ''}
                >
                  <td className="px-4 py-3 font-semibold text-slate-800 min-w-[180px]">{title}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(due)}</td>
                  <td className="px-4 py-3 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={progressNum}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${title} progress ${progressNum} percent`}
                      >
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${Math.min(100, Math.max(0, progressNum))}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-10 text-right">{progressNum}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={statusVariant(evidenceStatus)} size="xs">
                      {String(evidenceStatus)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={statusVariant(status)} size="xs">
                      {String(status)}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
