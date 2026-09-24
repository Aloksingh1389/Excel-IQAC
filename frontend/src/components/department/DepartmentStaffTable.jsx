import React from 'react';
import { Users } from 'lucide-react';
import { Card, Badge, Avatar } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

const statusVariant = (status) => {
  const s = String(status || '').toUpperCase();
  if (s.includes('ACTIVE') || s.includes('COMPLETE') || s.includes('VERIFIED')) return 'success';
  if (s.includes('PENDING') || s.includes('PARTIAL')) return 'warning';
  if (s.includes('INACTIVE') || s.includes('BLOCK') || s.includes('DUE')) return 'danger';
  if (s.includes('REVIEW')) return 'info';
  return 'neutral';
};

export const DepartmentStaffTable = ({ staff, onSelect }) => {
  const rows = Array.isArray(staff) ? staff : [];

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No staff found"
        description="No department staff match the current filters."
      />
    );
  }

  return (
    <Card className="overflow-hidden" aria-label="Department staff table">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Staff</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Designation</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Submissions</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Pending</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Verified</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Tasks</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Profile %</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((member, idx) => {
              const id = member?.id ?? member?.staffId ?? member?.employeeId ?? idx;
              const name = member?.name ?? member?.staffName ?? '—';
              const employeeId = member?.employeeId ?? member?.empId ?? member?.code ?? '';
              const key = member?.id ?? member?.staffId ?? `staff-${idx}`;
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
                  aria-label={`View staff ${name}`}
                  className={typeof onSelect === 'function' ? 'hover:bg-slate-50 cursor-pointer transition-colors' : ''}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5 min-w-[160px]">
                      <Avatar name={name} size="sm" />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{name}</p>
                        {employeeId && <p className="text-[11px] text-slate-500">{employeeId}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {member?.designation ?? member?.role ?? member?.title ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">
                    {member?.submissions ?? member?.submissionCount ?? member?.totalSubmissions ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-amber-700">
                    {member?.pending ?? member?.pendingCount ?? member?.pendingSubmissions ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-700">
                    {member?.verified ?? member?.verifiedCount ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">
                    {member?.tasks ?? member?.taskCount ?? member?.openTasks ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-bold text-slate-700">
                      {member?.profileCompletion ?? member?.profilePercent ?? member?.profilePct ?? '—'}
                      {typeof (member?.profileCompletion ?? member?.profilePercent ?? member?.profilePct) === 'number' ? '%' : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={statusVariant(member?.status)} size="xs">
                      {member?.status || 'Unknown'}
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
