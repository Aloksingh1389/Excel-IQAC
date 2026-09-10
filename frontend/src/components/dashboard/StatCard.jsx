import React from 'react';
import { 
  GraduationCap, 
  Users, 
  Building2, 
  Clock, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';
import { Card } from '../common/Card';

const ICON_MAP = {
  GraduationCap,
  Users,
  Building2,
  Clock,
};

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50 text-blue-600 border-blue-100',
    text: 'text-blue-600',
  },
  indigo: {
    bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    text: 'text-indigo-600',
  },
  emerald: {
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    text: 'text-emerald-600',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-600 border-amber-100',
    text: 'text-amber-600',
  },
};

export const StatCard = ({
  title,
  value,
  subtitle = null,
  icon = 'GraduationCap',
  color = 'indigo',
  onClick = null,
  className = '',
}) => {
  const IconComponent = typeof icon === 'string' ? ICON_MAP[icon] || GraduationCap : icon;
  const colorStyles = COLOR_MAP[color] || COLOR_MAP.indigo;

  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={`p-5 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`p-2.5 rounded-xl border shrink-0 ${colorStyles.bg}`}
          aria-hidden="true"
        >
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium line-clamp-1">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};
