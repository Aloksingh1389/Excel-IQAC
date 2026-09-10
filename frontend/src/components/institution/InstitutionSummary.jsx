import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Building2, Award, Calendar, GraduationCap, Users, Layers } from 'lucide-react';

export const InstitutionSummary = ({ institution, academicYear }) => {
  if (!institution) return null;

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 border-slate-200/90 shadow-xs relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Institutional Master Profile
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> NAAC Grade A++
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Est. {institution.established || 2001} &bull; {institution.campusArea || '120 Acres'}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {institution.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {institution.subtitle || 'Internal Quality Assurance Cell & Executive Management System'}
            </p>
          </div>

          {institution.accreditations && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {institution.accreditations.map((acc, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] font-semibold text-slate-700 bg-white/80 border border-slate-200 rounded-md shadow-2xs"
                >
                  {acc}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Highlight Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-0.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-400 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Departments</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {institution.departments}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Active Programs</div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-0.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-400 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Students</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {Number(institution.students).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">UG & PG Cohort</div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-0.5 text-center sm:text-left col-span-2 sm:col-span-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-400 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Faculty</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {institution.faculty}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Teaching Staff</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
