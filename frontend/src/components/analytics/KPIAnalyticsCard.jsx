import React from 'react';
import { Card } from '../common/Card';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react';

export const KPIAnalyticsCard = ({
  title,
  value,
  prevValue = null,
  change = null,
  isPositive = true,
  unit = '',
  subtitle = null,
  icon: Icon = null,
  color = 'indigo',
  onClick = null,
  className = '',
}) => {
  const COLOR_MAP = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-800 border-amber-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  const colorStyles = COLOR_MAP[color] || COLOR_MAP.indigo;

  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={`p-5 flex flex-col justify-between border-slate-200/90 hover:border-slate-300 transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border shrink-0 ${colorStyles}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {value}
          </span>
          {unit && <span className="text-xs font-bold text-slate-500">{unit}</span>}
        </div>

        {/* Change Indicator vs Previous Year */}
        {(change !== null || prevValue !== null) && (
          <div className="flex items-center gap-1.5 text-xs pt-1">
            {change !== null && (
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {change}
              </span>
            )}
            {prevValue && (
              <span className="text-slate-400 font-medium">
                (prev: <strong>{prevValue}</strong>)
              </span>
            )}
          </div>
        )}

        {subtitle && (
          <p className="text-[11px] text-slate-500 font-medium pt-0.5 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
};
