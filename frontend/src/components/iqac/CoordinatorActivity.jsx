import React from 'react';
import { Card } from '../common/Card';
import { Clock, FileText, CheckCircle2, Bell, AlertTriangle } from 'lucide-react';

export const CoordinatorActivity = ({ activities = [] }) => {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Recent Coordinator Activity
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">Audit Activity Trail</span>
      </div>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">
            No activity records logged yet.
          </p>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{act.title}</span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {act.createdAt}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-snug">
                {act.description}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
