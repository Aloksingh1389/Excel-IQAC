import React from 'react';
import { Card } from '../common/Card';
import { History, UserCheck, MessageSquare } from 'lucide-react';
import { SubmissionStatusBadge } from './SubmissionStatusBadge';

export const SubmissionHistory = ({ history = [] }) => {
  return (
    <Card className="p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Workflow Audit & Action History
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-100 px-2 py-0.5 rounded">
          Audit Trail Log
        </span>
      </div>

      <div className="space-y-4 relative pl-4 border-l-2 border-slate-200">
        {history.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">
            No workflow action history recorded yet.
          </p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="relative space-y-1.5">
              {/* Dot */}
              <div className="w-3 h-3 rounded-full absolute -left-[23px] top-1 bg-indigo-600 border-2 border-white ring-4 ring-indigo-50" />

              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.action}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="font-semibold text-slate-700">{item.actorName}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{item.timestamp}</span>
              </div>

              {item.previousStatus && item.newStatus && (
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                  <span>Status:</span>
                  <SubmissionStatusBadge status={item.previousStatus} />
                  <span>&rarr;</span>
                  <SubmissionStatusBadge status={item.newStatus} />
                </div>
              )}

              {item.comment && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                    <MessageSquare className="w-3 h-3 text-indigo-500" />
                    <span>Reviewer Comment / Reason:</span>
                  </div>
                  <p className="font-normal leading-relaxed">{item.comment}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
