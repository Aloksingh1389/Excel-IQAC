import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { ManagementStatusBadge } from './ManagementStatusBadge';

const BAR_TONE = {
  Good: 'bg-emerald-500',
  Attention: 'bg-amber-500',
  Critical: 'bg-rose-500',
};

const TrendIcon = ({ trend }) => {
  const t = String(trend || '').toLowerCase();
  if (t === 'up' || t === 'improving' || t === 'rising')
    return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" aria-label="Trend: improving" />;
  if (t === 'down' || t === 'declining' || t === 'falling')
    return <TrendingDown className="w-3.5 h-3.5 text-rose-600" aria-label="Trend: declining" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" aria-label="Trend: stable" />;
};

export const InstitutionHealthOverview = ({ categories }) => {
  const list = Array.isArray(categories) ? categories : [];

  if (list.length === 0) {
    return (
      <EmptyState
        title="No health data"
        description="Institutional health categories have not been reported yet."
      />
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4"
      role="list"
      aria-label="Institutional health by category"
    >
      {list.map((c, i) => {
        const name = c?.name || `Category ${i + 1}`;
        const score = c?.score ?? null;
        const status = c?.status || 'Attention';
        const pct = score === null || score === undefined ? 0 : Math.max(0, Math.min(100, Number(score) || 0));
        return (
          <Card key={`${name}-${i}`} className="p-4 sm:p-5" role="listitem">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-xs font-bold text-slate-800 leading-snug">{name}</h4>
              <TrendIcon trend={c?.trend} />
            </div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {score === null || score === undefined ? '—' : `${score}%`}
              </span>
              <ManagementStatusBadge status={status} />
            </div>
            <div
              className="h-2 rounded-full bg-slate-100 overflow-hidden"
              role="progressbar"
              aria-label={`${name} score`}
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded-full transition-all ${BAR_TONE[status] || 'bg-slate-400'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-500 font-medium">
              Status: <span className="font-semibold text-slate-700">{status}</span>
              {c?.trend ? ` · Trend: ${c.trend}` : ''}
            </p>
          </Card>
        );
      })}
    </div>
  );
};
