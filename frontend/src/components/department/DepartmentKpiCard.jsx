import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';

const TONE_MAP = {
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  violet: 'bg-violet-50 text-violet-600 border-violet-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  teal: 'bg-teal-50 text-teal-600 border-teal-100',
};

export const DepartmentKpiCard = ({
  title,
  value,
  subtitle = null,
  icon: Icon = LayoutDashboard,
  tone = 'indigo',
  to = null,
}) => {
  const toneStyles = TONE_MAP[tone] || TONE_MAP.indigo;
  const IconComponent = Icon || LayoutDashboard;

  const inner = (
    <>
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title || 'Metric'}
        </span>
        <div
          className={`p-2.5 rounded-xl border shrink-0 ${toneStyles}`}
          aria-hidden="true"
        >
          <IconComponent className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value ?? '—'}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium line-clamp-1">{subtitle}</p>
        )}
        {to && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
            View details <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
        )}
      </div>
    </>
  );

  if (to) {
    return (
      <Card hover className="p-5 flex flex-col justify-between">
        <Link to={to} aria-label={`${title || 'Metric'}: ${value ?? ''} — view details`} className="block">
          {inner}
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-5 flex flex-col justify-between" aria-label={`${title || 'Metric'}: ${value ?? ''}`}>
      {inner}
    </Card>
  );
};
