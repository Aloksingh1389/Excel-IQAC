import React from 'react';
import { Link } from 'react-router-dom';
import { BellRing, AlertTriangle, Info, OctagonAlert, ArrowRight } from 'lucide-react';
import { Card, Badge } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

const severityMeta = (severity) => {
  const s = String(severity || 'info').toLowerCase();
  if (s === 'critical') return { variant: 'danger', Icon: OctagonAlert, label: 'Critical' };
  if (s === 'warning') return { variant: 'warning', Icon: AlertTriangle, label: 'Warning' };
  return { variant: 'info', Icon: Info, label: 'Info' };
};

export const DeanAttentionList = ({ items }) => {
  const rows = Array.isArray(items) ? items : [];

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={BellRing}
        title="All clear"
        description="No attention items across assigned departments."
      />
    );
  }

  return (
    <Card className="overflow-hidden" aria-label="Departments needing attention">
      <ul className="divide-y divide-slate-100">
        {rows.map((item, idx) => {
          const meta = severityMeta(item?.severity);
          const MetaIcon = meta.Icon;
          const key = item?.id ?? `attention-${idx}`;
          const body = (
            <div className="flex items-start gap-3 px-4 py-3">
              <span
                className={`mt-0.5 p-1.5 rounded-lg border shrink-0 ${
                  meta.variant === 'danger'
                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                    : meta.variant === 'warning'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}
                aria-hidden="true"
              >
                <MetaIcon className="w-4 h-4" />
              </span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral" size="xs">
                    {item?.departmentCode || item?.departmentName || 'Dept'}
                  </Badge>
                  {item?.departmentName && item?.departmentCode && (
                    <span className="text-[11px] text-slate-400 font-medium truncate">
                      {item.departmentName}
                    </span>
                  )}
                  <Badge variant={meta.variant} size="xs">
                    {meta.label}
                  </Badge>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{item?.text || '—'}</p>
              </div>
              {item?.link && (
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" aria-hidden="true" />
              )}
            </div>
          );
          return (
            <li key={key} className={item?.link ? 'hover:bg-slate-50 transition-colors' : ''}>
              {item?.link ? (
                <Link to={item.link} className="block" aria-label={`${meta.label}: ${item?.text || ''}`}>
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
};
