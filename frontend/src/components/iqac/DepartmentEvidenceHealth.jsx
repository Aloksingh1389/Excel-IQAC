import React from 'react';
import { Card } from '../common/Card';
import { ShieldCheck, Building2 } from 'lucide-react';

export const DepartmentEvidenceHealth = ({ departments = [] }) => {
  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Department Evidence Verification Health Overview
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Monitor department document upload progress, verification completion & returned items
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const totalEv = dept.evidenceUploaded || 90;
          const verifiedEv = dept.evidenceVerified || 82;
          const pendingEv = dept.evidencePending || 8;
          const verRate = Math.round((verifiedEv / (totalEv || 1)) * 100);

          return (
            <div
              key={dept.id}
              className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3 hover:shadow-xs transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-900 font-black text-xs flex items-center justify-center shrink-0">
                    {dept.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                    {dept.name}
                  </h4>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {verRate}% Verified
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${verRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-semibold text-slate-400 uppercase">Uploaded</p>
                  <p className="font-extrabold text-slate-900">{totalEv}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-semibold text-slate-400 uppercase">Verified</p>
                  <p className="font-extrabold text-emerald-700">{verifiedEv}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-semibold text-slate-400 uppercase">Pending</p>
                  <p className="font-extrabold text-amber-600">{pendingEv}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
