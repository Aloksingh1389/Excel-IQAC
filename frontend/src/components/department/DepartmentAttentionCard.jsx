import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';

const SEVERITY_CONFIG = {
  critical: {
    icon: AlertCircle,
    wrapper: 'bg-rose-50 border-rose-200 text-rose-700',
    label: 'Critical',
    pill: 'bg-rose-100 text-rose-800 border border-rose-200',
  },
  warning: {
    icon: AlertTriangle,
    wrapper: 'bg-amber-50 border-amber-200 text-amber-700',
    label: 'Warning',
    pill: 'bg-amber-100 text-amber-900 border border-amber-200',
  },
  info: {
    icon: Info,
    wrapper: 'bg-blue-50 border-blue-200 text-blue-700',
    label: 'Info',
    pill: 'bg-blue-100 text-blue-800 border border-blue-200',
  },
};

export const DepartmentAttentionCard = ({ items }) => {
  const list = Array.isArray(items) ? items : [];

  return (
    <Card className="p-5" aria-label="Department attention items">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900">Needs Attention</h2>
        <span className="text-xs font-semibold text-slate-500" aria-label={`${list.length} attention items`}>
          {list.length} item{list.length === 1 ? '' : 's'}
        </span>
      </div>

      {list.length === 0 ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <p className="text-xs font-medium text-emerald-800">
            No attention items. Department is on track.
          </p>
        </div>
      ) : (
        <ul className="space-y-2" aria-label="Attention items list">
          {list.map((item, idx) => {
            const conf = SEVERITY_CONFIG[item?.severity] || SEVERITY_CONFIG.info;
            const SeverityIcon = conf.icon;
            const key = item?.id ?? `attention-${idx}`;
            const content = (
              <>
                <span
                  className={`p-1.5 rounded-lg border shrink-0 ${conf.wrapper}`}
                  aria-hidden="true"
                >
                  <SeverityIcon className="w-4 h-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${conf.pill}`}>
                    {conf.label}
                  </span>
                  <span className="block text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                    {item?.text || 'Attention required.'}
                  </span>
                </span>
                {item?.link && (
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                )}
              </>
            );
            const rowClass =
              'w-full flex items-start gap-2.5 rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 text-left transition-all hover:border-slate-300 hover:shadow-xs';
            return (
              <li key={key}>
                {item?.link ? (
                  <Link to={item.link} aria-label={`${conf.label}: ${item?.text || ''}`} className={rowClass}>
                    {content}
                  </Link>
                ) : (
                  <div className={rowClass}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};
