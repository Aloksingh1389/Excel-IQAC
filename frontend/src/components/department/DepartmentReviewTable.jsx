import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { SUBMISSION_STATUS_CONFIG } from '../../config/submissionStatuses';

const getSubmissionPill = (status) => {
  const key = String(status || '').toUpperCase();
  const conf = SUBMISSION_STATUS_CONFIG[key];
  if (!conf) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border bg-slate-100 text-slate-700 border-slate-200">
        {status || 'Unknown'}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border ${conf.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} aria-hidden="true" />
      {conf.label}
    </span>
  );
};

const priorityPill = (priority) => {
  const p = String(priority || '').toUpperCase();
  const map = {
    HIGH: 'bg-rose-50 text-rose-700 border-rose-200',
    URGENT: 'bg-rose-50 text-rose-700 border-rose-200',
    MEDIUM: 'bg-amber-50 text-amber-800 border-amber-200',
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  const classes = map[p] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${classes}`}>
      {priority || '—'}
    </span>
  );
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

export const DepartmentReviewTable = ({ submissions, onSelect }) => {
  const rows = Array.isArray(submissions) ? submissions : [];

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No submissions to review"
        description="There are no department submissions awaiting review."
      />
    );
  }

  return (
    <Card className="overflow-hidden" aria-label="Department review table">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Submission</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Staff</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Type</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Submitted</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Evidence</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Priority</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((sub, idx) => {
              const id = sub?.id ?? sub?.submissionId ?? idx;
              const key = sub?.id ?? sub?.submissionId ?? `review-${idx}`;
              const title = sub?.title ?? sub?.name ?? `Submission ${id}`;
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
                  aria-label={`Review submission ${title}`}
                  className={typeof onSelect === 'function' ? 'hover:bg-slate-50 cursor-pointer transition-colors' : ''}
                >
                  <td className="px-4 py-3 min-w-[180px]">
                    <p className="font-semibold text-slate-800 truncate">{title}</p>
                    <p className="text-[11px] text-slate-500">{sub?.id ?? sub?.submissionId ?? ''}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {sub?.staffName ?? sub?.staff ?? sub?.submittedBy ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {sub?.type ?? sub?.category ?? sub?.submissionType ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {formatDate(sub?.submittedAt ?? sub?.submittedDate ?? sub?.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">
                    {sub?.evidenceCount ?? (Array.isArray(sub?.evidence) ? sub.evidence.length : 0)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{priorityPill(sub?.priority)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{getSubmissionPill(sub?.status)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                      Review <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
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
