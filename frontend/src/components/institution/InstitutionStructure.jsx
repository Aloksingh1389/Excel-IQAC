import React from 'react';
import { Card } from '../common/Card';
import { Building2, Users, GraduationCap, ShieldCheck, Network, ArrowDown } from 'lucide-react';

export const InstitutionStructure = ({ institution }) => {
  if (!institution) return null;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Institutional Governance & Structure</h3>
            <p className="text-xs text-slate-500">Hierarchical breakdown across leadership, departments, faculty, and student body</p>
          </div>
        </div>
      </div>

      {/* Visual Hierarchy Diagram */}
      <div className="flex flex-col items-center space-y-4">
        {/* Top Node: Institutional Apex */}
        <div className="w-full max-w-md p-4 rounded-xl bg-indigo-600 text-white shadow-sm text-center space-y-1 relative">
          <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Apex Institutional Management</div>
          <h4 className="text-base font-extrabold">{institution.name}</h4>
          <p className="text-xs text-indigo-100">
            {Number(institution.students).toLocaleString()} Students Enrolled &bull; NAAC Grade A++
          </p>
        </div>

        {/* Connecting Vertical Stem */}
        <div className="w-0.5 h-6 bg-slate-300 relative flex items-center justify-center">
          <ArrowDown className="w-3.5 h-3.5 text-slate-400 absolute top-2" />
        </div>

        {/* Sub-Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {/* Departments Node */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 hover:bg-slate-100/60 transition">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Departments</div>
              <div className="text-2xl font-black text-slate-900">{institution.departments}</div>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Engineering, Tech & Applied Science Divisions headed by HODs
            </p>
          </div>

          {/* Faculty Node */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 hover:bg-slate-100/60 transition">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Faculty Members</div>
              <div className="text-2xl font-black text-slate-900">{institution.faculty}</div>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Professors, Associate & Assistant Professors across departments
            </p>
          </div>

          {/* Deans Node */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 hover:bg-slate-100/60 transition">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Institutional Deans</div>
              <div className="text-2xl font-black text-slate-900">{institution.deans}</div>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Academic Affairs, Research & Innovation, Student Welfare & Placements
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
