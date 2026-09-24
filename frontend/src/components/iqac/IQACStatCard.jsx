import React from 'react';
import { Card } from '../common/Card';

export const IQACStatCard = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  color = 'indigo',
  badgeText,
}) => {
  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-50/80',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-600',
      iconColor: 'text-indigo-600',
      valueColor: 'text-indigo-950',
    },
    emerald: {
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-600',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-950',
    },
    amber: {
      bg: 'bg-amber-50/80',
      border: 'border-amber-100',
      iconBg: 'bg-amber-600',
      iconColor: 'text-amber-600',
      valueColor: 'text-amber-950',
    },
    rose: {
      bg: 'bg-rose-50/80',
      border: 'border-rose-100',
      iconBg: 'bg-rose-600',
      iconColor: 'text-rose-600',
      valueColor: 'text-rose-950',
    },
    blue: {
      bg: 'bg-blue-50/80',
      border: 'border-blue-100',
      iconBg: 'bg-blue-600',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-950',
    },
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <Card className={`p-4 sm:p-5 transition-all duration-200 hover:shadow-md ${style.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </p>
          <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${style.valueColor}`}>
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl text-white shadow-sm shrink-0 ${style.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
        <span className="text-slate-500 truncate">{subtitle}</span>

        {change && (
          <span
            className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
              isPositive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {change}
          </span>
        )}

        {badgeText && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
            {badgeText}
          </span>
        )}
      </div>
    </Card>
  );
};
