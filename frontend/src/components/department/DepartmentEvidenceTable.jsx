import React from 'react';
import { Paperclip } from 'lucide-react';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { EVIDENCE_STATUS_CONFIG } from '../../config/evidenceConfig';

const getEvidencePill = (status) => {
  const key = String(status || '').toUpperCase();
  const conf = EVIDENCE_STATUS_CONFIG[key];
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

export const DepartmentEvidenceTable = ({ evidence, onSelect }) => {
  const rows = Array.isArray(evidence) ? evidence : [];

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Paperclip}
        title="No evidence found"
        description="No department evidence matches the current filters."
      />
    );
  }

  return (
    <Card className="overflow-hidden" aria-label="Department evidence table">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Evidence</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Type</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Uploaded By</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Submission</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((item, idx) => {
              const id = item?.id ?? item?.evidenceId ?? idx;
              const key = item?.id ?? item?.evidenceId ?? `evidence-${idx}`;
              const title = item?.title ?? item?.name ?? item?.fileName ?? `Evidence ${id}`;
              const submissionRef =
                item?.submissionId ?? item?.submission?.id ?? item?.submissionRef ?? '—';
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
                  aria-label={`View evidence ${title}`}
                  className={typeof onSelect === 'function' ? 'hover:bg-slate-50 cursor-pointer transition-colors' : ''}
                >
                  <td className="px-4 py-3 min-w-[180px]">
                    <p className="font-semibold text-slate-800 truncate">{title}</p>
                    <p className="text-[11px] text-slate-500">{item?.id ?? item?.evidenceId ?? ''}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {item?.type ?? item?.evidenceType ?? item?.category ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {item?.uploadedBy ?? item?.uploader ?? item?.staffName ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{submissionRef}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{getEvidencePill(item?.status)}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {formatDate(item?.updatedAt ?? item?.updated ?? item?.createdAt)}
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
