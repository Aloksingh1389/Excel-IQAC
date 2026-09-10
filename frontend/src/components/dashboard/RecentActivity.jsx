import React from 'react';
import { 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  UploadCloud, 
  AlertTriangle 
} from 'lucide-react';
import { Card } from '../common/Card';

const ICON_MAP = {
  CheckCircle2,
  FileText,
  Sparkles,
  UploadCloud,
  AlertTriangle,
};

export const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="space-y-3">
      {activities.map((item, idx) => {
        const IconComponent = ICON_MAP[item.icon] || FileText;
        return (
          <div
            key={item.id || idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition"
          >
            <div className="p-2 rounded-lg bg-white border border-slate-200 text-indigo-600 shrink-0">
              <IconComponent className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 leading-snug truncate">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {item.description}
              </p>
              <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
                {item.timestamp}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const AttentionCard = ({ items = [] }) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.targetPath || '/director/institution'}
          className="block p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 hover:bg-amber-50 hover:border-amber-300 transition group"
        >
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded bg-amber-100 text-amber-700 mt-0.5 shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-900 truncate">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-1">
                {item.description}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
