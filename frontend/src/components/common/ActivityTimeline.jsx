import React from 'react';
import { CheckCircle, Clock, FileText, Send, Award, AlertCircle } from 'lucide-react';

const TYPE_ICONS = {
  PUBLICATION: FileText,
  RESEARCH: Award,
  APPROVAL: CheckCircle,
  SUBMISSION: Send,
  ALERT: AlertCircle,
  DEFAULT: Clock,
};

export const ActivityTimeline = ({ activities = [], className = '' }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-400">
        No recent activities recorded.
      </div>
    );
  }

  return (
    <div className={`relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 ${className}`}>
      {activities.map((item, index) => {
        const IconComponent = TYPE_ICONS[item.type] || TYPE_ICONS.DEFAULT;
        return (
          <div key={index} className="relative group">
            {/* Timeline Dot/Icon */}
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            </div>

            {/* Content */}
            <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-lg p-3 transition">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-800">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {item.timestamp || item.time}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description || item.message}
              </p>
              {item.badge && (
                <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-800 rounded">
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
