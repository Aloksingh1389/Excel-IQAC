import React from 'react';
import { Card } from '../common/Card';
import { AlertCircle, ChevronRight, Clock, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PendingItemsCard = ({ items = [] }) => {
  const navigate = useNavigate();

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Attention Required
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Actions needing coordinator, head, or dean resolution
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
          {items.length} Pending
        </span>
      </div>

      <div className="space-y-2.5">
        {items.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">
            No items require immediate attention. Everything is up to date.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.module || '/iqac/monitoring')}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition cursor-pointer flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition leading-tight">
                    {item.title}
                  </h4>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider ${getUrgencyBadge(
                      item.urgency
                    )}`}
                  >
                    {item.urgency}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-normal leading-snug">
                  {item.description}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition shrink-0 mt-1" />
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
