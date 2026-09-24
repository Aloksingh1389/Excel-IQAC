import React from 'react';
import { Card } from '../common/Card';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const IQACProgressCard = ({ title, value, percentage, icon: Icon, color = 'indigo' }) => {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xl sm:text-2xl font-black text-slate-900">{value}</span>
        <span className="text-xs font-bold text-slate-600">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            percentage >= 90
              ? 'bg-emerald-500'
              : percentage >= 70
              ? 'bg-indigo-500'
              : 'bg-amber-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Card>
  );
};
