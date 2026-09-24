import React from 'react';
import { Card } from '../common/Card';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AttentionRequiredCard = ({ alerts = [] }) => {
  return (
    <Card className="p-4 sm:p-5 space-y-3 border-amber-200 bg-gradient-to-br from-amber-50/40 via-white to-white">
      <div className="flex items-center justify-between pb-2 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Attention Required & Critical Intervention Alerts ({alerts.length})
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Rule-based notifications for quality indicators below benchmark
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800">
          IQAC Alerts
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className="p-3 rounded-xl border border-amber-200 bg-white flex items-start justify-between gap-3 text-xs shadow-2xs hover:border-amber-300 transition"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{alt.title}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-800">
                  {alt.priority}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                  {alt.departmentCode}
                </span>
              </div>
              <p className="text-slate-600 leading-snug">{alt.description}</p>
            </div>

            {alt.targetRoute && (
              <Link
                to={alt.targetRoute}
                className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 font-bold text-amber-900 text-[11px] transition shrink-0 inline-flex items-center gap-1"
              >
                <span>Action</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
