import React from 'react';
import { Building2, CalendarClock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, Badge } from '../common/Card';
import { ManagementStatusBadge } from './ManagementStatusBadge';

const TrendGlyph = ({ trend }) => {
  const t = String(trend || '').toLowerCase();
  if (t === 'up' || t === 'improving' || t === 'rising')
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
        <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> {trend}
      </span>
    );
  if (t === 'down' || t === 'declining' || t === 'falling')
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
        <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" /> {trend}
      </span>
    );
  if (trend)
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
        <Minus className="w-3.5 h-3.5" aria-hidden="true" /> {trend}
      </span>
    );
  return null;
};

export const ExecutiveDecisionPanel = ({ items }) => {
  const list = Array.isArray(items) ? items : [];

  if (list.length === 0) {
    return (
      <Card className="p-6 text-center" aria-label="Executive decision items">
        <p className="text-sm font-medium text-slate-600">No decision items.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="Executive decision items">
      {list.map((item, i) => {
        const depts = Array.isArray(item?.departments) ? item.departments : [];
        return (
          <Card key={item?.id ?? `${item?.area}-${i}`} className="p-4 sm:p-5" role="listitem">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {item?.area && (
                <Badge variant="info" size="xs">
                  {item.area}
                </Badge>
              )}
              {item?.status && <ManagementStatusBadge status={item.status} />}
              <TrendGlyph trend={item?.trend} />
            </div>
            {item?.issue && (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">Observed: </span>
                {item.issue}
              </p>
            )}
            {depts.length > 0 && (
              <p className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px] text-slate-500 font-medium">
                <Building2 className="w-3 h-3" aria-hidden="true" />
                {depts.join(', ')}
              </p>
            )}
            {item?.followUp && (
              <div className="mt-2.5 rounded-lg bg-slate-50 border border-slate-100 p-2.5 flex items-start gap-2">
                <CalendarClock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700">Suggested follow-up option: </span>
                  {item.followUp}
                </p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
