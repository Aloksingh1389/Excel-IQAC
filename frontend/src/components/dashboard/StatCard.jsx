import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Card } from '../layout/PageContainer';

export const StatCard = ({
  title,
  value,
  subtitle = null,
  trend = null, // e.g. { value: '+12.4%', isPositive: true, label: 'vs last AY' }
  icon: Icon,
  iconBg = 'bg-blue-50 text-blue-600',
  onClick = null,
  className = '',
}) => {
  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={`p-5 relative flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${iconBg} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 text-xs">
          <span
            className={`inline-flex items-center font-bold ${
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
            )}
            {trend.value}
          </span>
          <span className="text-slate-400 font-medium">{trend.label}</span>
        </div>
      )}
    </Card>
  );
};

export const ChartCard = ({
  title,
  subtitle,
  actions = null,
  children,
  className = '',
}) => {
  return (
    <Card className={`p-5 flex flex-col ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      <div className="flex-1 w-full min-h-[260px]">{children}</div>
    </Card>
  );
};

export const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  iconBg = 'bg-blue-100 text-blue-700',
  to,
  onClick,
}) => {
  const content = (
    <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition flex items-center justify-between gap-3 group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${iconBg} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
            {title}
          </h4>
          <p className="text-[11px] text-slate-500 line-clamp-1">{description}</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
    </div>
  );

  return onClick ? (
    <div onClick={onClick}>{content}</div>
  ) : (
    <a href={to}>{content}</a>
  );
};
