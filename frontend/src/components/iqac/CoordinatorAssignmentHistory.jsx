import React from 'react';
import { Card } from '../common/Card';
import { History, UserCheck, Calendar } from 'lucide-react';

export const CoordinatorAssignmentHistory = ({ history = [], departmentName = '' }) => {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Coordinator Assignment History
            </h3>
            {departmentName && (
              <p className="text-[10px] text-slate-400 font-medium">{departmentName}</p>
            )}
          </div>
        </div>
        <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
          Audit Trail
        </span>
      </div>

      <div className="space-y-3 relative pl-4 border-l-2 border-slate-200">
        {history.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-2">
            No previous assignment history recorded.
          </p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="relative group space-y-1">
              {/* Dot */}
              <div
                className={`w-3 h-3 rounded-full absolute -left-[23px] top-1 border-2 border-white ${
                  item.status === 'CURRENT' ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-300'
                }`}
              />

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{item.coordinatorName}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    item.status === 'CURRENT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.status === 'CURRENT' ? 'Active / Current' : 'Completed'}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 font-medium">
                <span>Start: <strong>{item.startDate}</strong></span>
                {item.endDate ? (
                  <span> &bull; Ended: <strong>{item.endDate}</strong></span>
                ) : (
                  <span> &bull; <strong>Present</strong></span>
                )}
              </div>

              {item.reason && (
                <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug">
                  Note: {item.reason}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
