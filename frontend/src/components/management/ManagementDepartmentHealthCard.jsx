import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award, ShieldCheck, BadgeCheck, Users, GraduationCap, Crown, UserCheck, Building } from 'lucide-react';
import { Card } from '../common/Card';

const Metric = ({ icon: Icon, label, value, suffix = '%', tone }) => (
  <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className={`w-3.5 h-3.5 ${tone}`} aria-hidden="true" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
    </div>
    <div className="text-lg font-extrabold text-slate-900 tabular-nums">
      {value === null || value === undefined || value === '' ? '—' : `${value}${suffix}`}
    </div>
  </div>
);

export const ManagementDepartmentHealthCard = ({ department, onView }) => {
  const navigate = useNavigate();
  const d = department || {};
  const id = d.id ?? d.code;

  const handleView = () => {
    if (typeof onView === 'function') {
      onView(id);
    } else if (id !== null && id !== undefined) {
      navigate(`/management/departments/${id}`);
    }
  };

  return (
    <Card className="p-5 sm:p-6" aria-label={`Health summary for ${d.name || d.code || 'department'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
            {d.code || 'Department'}
          </p>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
            {d.name || 'Unnamed department'}
          </h3>
          <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-500 font-medium">
            {d.hodName && (
              <p className="inline-flex items-center gap-1 mr-3">
                <Crown className="w-3 h-3" aria-hidden="true" /> HOD: {d.hodName}
              </p>
            )}
            {d.coordinatorName && (
              <p className="inline-flex items-center gap-1 mr-3">
                <UserCheck className="w-3 h-3" aria-hidden="true" /> Coordinator: {d.coordinatorName}
              </p>
            )}
            {d.deanName && (
              <p className="inline-flex items-center gap-1">
                <Building className="w-3 h-3" aria-hidden="true" /> Dean: {d.deanName}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleView}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shrink-0"
          aria-label={`View details for ${d.name || d.code || 'department'}`}
        >
          View <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        <Metric icon={Award} label="Quality" value={d.qualityScore} tone="text-amber-500" />
        <Metric icon={ShieldCheck} label="Compliance" value={d.complianceRate} tone="text-emerald-500" />
        <Metric icon={BadgeCheck} label="Readiness" value={d.accreditationReadiness} tone="text-teal-500" />
        <Metric icon={Users} label="Staff" value={d.staffCount} suffix="" tone="text-violet-500" />
        <Metric icon={GraduationCap} label="Students" value={d.studentCount} suffix="" tone="text-blue-500" />
      </div>
    </Card>
  );
};
