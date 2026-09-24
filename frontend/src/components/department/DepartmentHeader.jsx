import React from 'react';
import { Building2, CalendarDays, UserCheck, Users, Crown } from 'lucide-react';
import { Card, Badge } from '../common/Card';

export const DepartmentHeader = ({ department, roleLabel, academicYear }) => {
  const dept = department || {};
  const name = dept.name || dept.departmentName || 'Department';
  const code = dept.code || dept.departmentCode || dept.shortCode || '';
  const hodName = dept.hodName || dept.hod || dept.headName || '—';
  const coordinatorName =
    dept.coordinatorName || dept.coordinator || dept.iqacCoordinator || '—';
  const staffCount = dept.staffCount ?? dept.totalStaff ?? dept.facultyCount ?? null;

  return (
    <Card className="p-5 sm:p-6" aria-label="Department header">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <div
            className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0"
            aria-hidden="true"
          >
            <Building2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
                {name}
              </h1>
              {code && (
                <Badge variant="primary" size="sm" aria-label={`Department code ${code}`}>
                  {code}
                </Badge>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              {academicYear && (
                <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                  <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                  Academic Year: {academicYear}
                </span>
              )}
              {roleLabel && (
                <Badge variant="info" size="sm" aria-label={`Viewing as ${roleLabel}`}>
                  <Crown className="w-3 h-3 mr-1" aria-hidden="true" />
                  {roleLabel}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:text-right">
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1 md:justify-end">
              <UserCheck className="w-3 h-3" aria-hidden="true" /> HOD
            </p>
            <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{hodName}</p>
          </div>
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1 md:justify-end">
              <UserCheck className="w-3 h-3" aria-hidden="true" /> Coordinator
            </p>
            <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{coordinatorName}</p>
          </div>
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1 md:justify-end">
              <Users className="w-3 h-3" aria-hidden="true" /> Staff
            </p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">
              {staffCount ?? '—'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
