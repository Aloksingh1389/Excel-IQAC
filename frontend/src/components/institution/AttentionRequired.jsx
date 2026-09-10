import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export const AttentionRequired = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Institutional Attention Required</h3>
            <p className="text-xs text-slate-500">Critical metrics, departmental audit observations, and compliance alerts</p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
          {items.length} Active Alerts
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((alert) => (
          <Link
            key={alert.id}
            to={`/director/institution/departments/${alert.departmentId}`}
            className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {alert.departmentName || alert.departmentId}
                </span>
                <span className="text-[10px] font-semibold text-amber-700 capitalize">
                  {alert.urgency || 'medium'} priority
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-900 leading-snug">
                {alert.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {alert.description}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end text-xs font-bold text-amber-800 group-hover:text-indigo-600 transition-colors gap-1">
              <span>View Department Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};
