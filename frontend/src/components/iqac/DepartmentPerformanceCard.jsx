import React from 'react';
import { Card } from '../common/Card';
import { IQACStatusBadge } from './IQACStatusBadge';
import { Building2, Users, FileCheck } from 'lucide-react';

export const DepartmentPerformanceCard = ({ department }) => {
  if (!department) return null;

  const total = department.completedSubmissions + department.pendingSubmissions;
  const pct = Math.round((department.completedSubmissions / (total || 1)) * 100);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-900 font-black text-sm flex items-center justify-center">
            {department.code}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              {department.name}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Coordinator: {department.iqacCoordinatorId || 'Assigned Coordinator'}
            </p>
          </div>
        </div>

        <IQACStatusBadge status={department.overallStatus} />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
        <div className="p-2 rounded-lg bg-slate-50">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Staff</p>
          <p className="font-extrabold text-slate-800">{department.staffCount}</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-50">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Done</p>
          <p className="font-extrabold text-emerald-700">{department.completedSubmissions}</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-50">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Evidence</p>
          <p className="font-extrabold text-indigo-700">{department.evidenceVerified}</p>
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
          <span>IQAC Completion</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
