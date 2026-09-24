import React from 'react';
import { Card } from '../common/Card';
import { CoordinatorStatusBadge } from './CoordinatorStatusBadge';
import { UserPlus, AlertCircle, Building2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DepartmentCoverageCard = ({
  departments = [],
  coordinators = [],
  canManage = false,
  onOpenAssign,
}) => {
  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            IQAC Department Coverage & Monitoring Overview
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Monitor coordinator coverage, unassigned departments, staff submission rates & evidence readiness
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const coord = coordinators.find((c) => c.departmentId === dept.id || c.departmentCode === dept.code);
          const isUnassigned = !dept.iqacCoordinatorId || !coord;

          const totalSub = dept.completedSubmissions + dept.pendingSubmissions;
          const subPct = Math.round((dept.completedSubmissions / (totalSub || 1)) * 100);
          const evidencePct = Math.round((dept.evidenceVerified / (dept.evidenceUploaded || 1)) * 100);

          return (
            <div
              key={dept.id}
              className={`p-4 rounded-2xl border transition-all ${
                isUnassigned
                  ? 'border-amber-300 bg-amber-50/40'
                  : 'border-slate-200/80 bg-white hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-900 font-black text-xs flex items-center justify-center shrink-0">
                    {dept.code}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {dept.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Staff: {dept.staffCount} &bull; Students: {dept.studentCount}
                    </p>
                  </div>
                </div>

                {isUnassigned ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                    UNASSIGNED
                  </span>
                ) : (
                  <CoordinatorStatusBadge status={coord.status} />
                )}
              </div>

              {/* Coordinator Detail / Unassigned Banner */}
              <div className="py-3 space-y-2">
                {isUnassigned ? (
                  <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>No Coordinator Assigned</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-tight">
                      This department requires a designated IQAC Coordinator to oversee submissions and evidence review.
                    </p>
                    {canManage && onOpenAssign && (
                      <button
                        type="button"
                        onClick={() => onOpenAssign(dept)}
                        className="w-full mt-1 py-1.5 px-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Assign Coordinator Now</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      IQAC Coordinator
                    </p>
                    <p className="text-xs font-bold text-slate-900">
                      {coord.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {coord.employeeId} &bull; Assigned: {coord.assignedDate}
                    </p>
                  </div>
                )}

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Submissions</p>
                    <p className="font-extrabold text-emerald-700">{subPct}%</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Evidence</p>
                    <p className="font-extrabold text-indigo-700">{evidencePct}%</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium truncate">
                  Activity: {dept.lastActivityAt || 'Recent'}
                </span>
                {!isUnassigned && coord && (
                  <Link
                    to={`/iqac/coordinators/${coord.id}`}
                    className="font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
