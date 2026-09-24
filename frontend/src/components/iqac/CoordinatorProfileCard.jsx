import React from 'react';
import { Card } from '../common/Card';
import { CoordinatorStatusBadge } from './CoordinatorStatusBadge';
import { User, Mail, Phone, Building2, Calendar, ShieldCheck, Clock } from 'lucide-react';

export const CoordinatorProfileCard = ({ coordinator, department }) => {
  if (!coordinator) return null;

  return (
    <Card className="p-5 sm:p-6 space-y-6">
      {/* Header Profile Summary */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
            {coordinator.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">
              {coordinator.name}
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              {coordinator.designation || 'Department IQAC Coordinator'}
            </p>
            <p className="text-[11px] text-indigo-600 font-bold mt-0.5">
              Employee ID: {coordinator.employeeId}
            </p>
          </div>
        </div>

        <CoordinatorStatusBadge status={coordinator.status} />
      </div>

      {/* Personal Information Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Personal Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
              <p className="font-semibold text-slate-800 truncate">{coordinator.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Phone</p>
              <p className="font-semibold text-slate-800">{coordinator.phone || '+91 98765 43210'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* IQAC Assignment Details */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          IQAC Appointment Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned Department</p>
              <p className="font-semibold text-slate-900">
                {coordinator.departmentName || department?.name || coordinator.departmentCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Assignment Date</p>
              <p className="font-semibold text-slate-900">{coordinator.assignedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Appointed By</p>
              <p className="font-semibold text-slate-900">{coordinator.assignedBy || 'IQAC Head'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Last Activity</p>
              <p className="font-semibold text-slate-900">{coordinator.lastActivityAt || 'Today'}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
