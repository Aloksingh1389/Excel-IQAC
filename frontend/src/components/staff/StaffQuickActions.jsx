import React from 'react';
import { Card } from '../common/Card';
import { Plus, Upload, UserCheck, RotateCcw, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StaffQuickActions = () => {
  return (
    <Card className="p-4 sm:p-5 space-y-3 bg-white border-slate-200">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Quick Actions & Shortcuts
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <Link
          to="/staff/submissions/create"
          className="p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold transition flex flex-col items-center justify-center gap-1.5 text-center group"
        >
          <Plus className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          <span>New Submission</span>
        </Link>

        <Link
          to="/staff/evidence"
          className="p-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold transition flex flex-col items-center justify-center gap-1.5 text-center group"
        >
          <Upload className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
          <span>Upload Evidence</span>
        </Link>

        <Link
          to="/staff/profile"
          className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold transition flex flex-col items-center justify-center gap-1.5 text-center group"
        >
          <UserCheck className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
          <span>Update Profile</span>
        </Link>

        <Link
          to="/staff/submissions?status=RETURNED"
          className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-bold transition flex flex-col items-center justify-center gap-1.5 text-center group"
        >
          <RotateCcw className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
          <span>Returned Items</span>
        </Link>
      </div>
    </Card>
  );
};
