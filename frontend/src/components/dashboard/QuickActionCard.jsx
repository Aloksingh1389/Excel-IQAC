import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  BarChart3, 
  FileText, 
  Bell, 
  ArrowRight 
} from 'lucide-react';
import { Card } from '../common/Card';

const ICON_MAP = {
  Building2,
  BarChart3,
  FileText,
  Bell,
};

export const QuickActionCard = ({
  title,
  description,
  path,
  icon = 'Building2',
  className = '',
}) => {
  const IconComponent = typeof icon === 'string' ? ICON_MAP[icon] || Building2 : icon;

  return (
    <Link to={path} className="block group">
      <Card
        hover
        className={`p-4 flex items-center justify-between gap-3 border-slate-200 group-hover:border-indigo-300 group-hover:shadow-xs transition-all ${className}`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
            <IconComponent className="w-5 h-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {title}
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {description}
            </p>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
      </Card>
    </Link>
  );
};
