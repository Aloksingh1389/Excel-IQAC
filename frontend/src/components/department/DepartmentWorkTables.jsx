import React from 'react';
import { Activity, CalendarDays, ListTodo } from 'lucide-react';
import { Card, Badge } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

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

const formatDateTime = (value) => {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString();
  } catch {
    return String(value);
  }
};

const statusVariant = (status) => {
  const s = String(status || '').toUpperCase();
  if (s.includes('COMPLETE') || s.includes('DONE') || s.includes('APPROV') || s.includes('HELD')) return 'success';
  if (s.includes('PENDING') || s.includes('SCHEDULE') || s.includes('PROGRESS') || s.includes('OPEN')) return 'warning';
  if (s.includes('OVERDUE') || s.includes('MISS') || s.includes('CANCEL') || s.includes('DUE')) return 'danger';
  return 'neutral';
};

export const DepartmentActivityTable = ({ items }) => {
  const rows = Array.isArray(items) ? items : [];

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No activities"
        description="No department activities found."
      />
    );
  }

  return (
    <Card className="overflow-hidden" aria-label="Department activities table">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Activity</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Type</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Date</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((item, idx) => (
              <tr key={item?.id ?? item?.activityId ?? `activity-${idx}`} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 min-w-[180px]">
                  <p className="font-semibold text-slate-800">
                    {item?.title ?? item?.name ?? item?.activity ?? `Activity ${idx + 1}`}
                  </p>
                  {(item?.description || item?.details) && (
                    <p className="text-[11px] text-slate-500 truncate max-w-[280px]">
                      {item?.description ?? item?.details}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {item?.type ?? item?.category ?? '—'}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {formatDate(item?.date ?? item?.activityDate ?? item?.createdAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge variant={statusVariant(item?.status)} size="xs">
                    {item?.status || 'Unknown'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export const DepartmentMeetingTable = ({ items }) => {
  const rows = Array.isArray(items) ? items : [];

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No meetings"
        description="No department meetings scheduled."
      />
    );
  }

  return (
    <Card className="overflow-hidden" aria-label="Department meetings table">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Meeting</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Date & Time</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Venue</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((item, idx) => (
              <tr key={item?.id ?? item?.meetingId ?? `meeting-${idx}`} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 min-w-[180px]">
                  <p className="font-semibold text-slate-800">
                    {item?.title ?? item?.name ?? item?.subject ?? item?.agenda ?? `Meeting ${idx + 1}`}
                  </p>
                  {item?.organizer && (
                    <p className="text-[11px] text-slate-500">By {item.organizer}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {formatDateTime(item?.dateTime ?? item?.date ?? item?.scheduledAt ?? item?.time)}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {item?.venue ?? item?.location ?? item?.room ?? '—'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge variant={statusVariant(item?.status)} size="xs">
                    {item?.status || 'Unknown'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export const DepartmentActionTable = ({ items, onSelect }) => {
  const rows = Array.isArray(items) ? items : [];
  const showOverdueEmpty = rows.length === 0;

  if (showOverdueEmpty) {
    return (
      <EmptyState
        icon={ListTodo}
        title="No action items"
        description="No overdue action items."
      />
    );
  }

  return (
    <Card className="overflow-hidden" aria-label="Department action items table">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Action</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Assigned To</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Due Date</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Priority</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((item, idx) => {
              const id = item?.id ?? item?.actionId ?? item?.taskId ?? idx;
              return (
                <tr
                  key={item?.id ?? item?.actionId ?? `action-${idx}`}
                  onClick={() => typeof onSelect === 'function' && onSelect(id)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && typeof onSelect === 'function') {
                      e.preventDefault();
                      onSelect(id);
                    }
                  }}
                  tabIndex={typeof onSelect === 'function' ? 0 : undefined}
                  aria-label={`View action ${item?.title ?? item?.name ?? id}`}
                  className={typeof onSelect === 'function' ? 'hover:bg-slate-50 cursor-pointer transition-colors' : 'hover:bg-slate-50 transition-colors'}
                >
                  <td className="px-4 py-3 font-semibold text-slate-800 min-w-[180px]">
                    {item?.title ?? item?.name ?? item?.task ?? item?.action ?? `Action ${idx + 1}`}
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {item?.assignedTo ?? item?.assignee ?? item?.owner ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {formatDate(item?.dueDate ?? item?.due ?? item?.deadline)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={statusVariant(item?.priority)} size="xs">
                      {item?.priority || '—'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={statusVariant(item?.status)} size="xs">
                      {item?.status || 'No action items found.'}
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
