import React from 'react';
import { StatCard } from '../dashboard/StatCard';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Calendar,
  Award,
  Briefcase,
  BookOpen,
  Sparkles,
  FlaskConical,
  Scale
} from 'lucide-react';

export const InstitutionStatGrid = ({ institution, academic, academicYear }) => {
  if (!institution || !academic) return null;

  return (
    <div className="space-y-6">
      {/* 1. Key Institutional Structure Numbers */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Key Institutional Numbers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          <StatCard
            title="Total Departments"
            value={institution.departments}
            subtitle="12 Engg & Tech Depts"
            icon={Building2}
            color="indigo"
          />

          <StatCard
            title="Total Students"
            value={Number(institution.students).toLocaleString()}
            subtitle="Regular UG / PG Enrolled"
            icon={GraduationCap}
            color="blue"
          />

          <StatCard
            title="Total Faculty"
            value={institution.faculty}
            subtitle={`${academic.facultyPhDPct || 78.5}% Doctorates`}
            icon={Users}
            color="emerald"
          />

          <StatCard
            title="Department HODs"
            value={institution.hods}
            subtitle="Academic Heads of Dept"
            icon={UserCheck}
            color="amber"
          />

          <StatCard
            title="Institutional Deans"
            value={institution.deans}
            subtitle="Academic & Research Deans"
            icon={ShieldCheck}
            color="indigo"
          />

          <StatCard
            title="Active Assessment AY"
            value={academicYear}
            subtitle="Current Monitoring Cycle"
            icon={Calendar}
            color="blue"
          />
        </div>
      </div>

      {/* 2. Basic Academic & Performance Overview */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Academic & Innovation Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Overall Pass Percentage"
            value={`${academic.passPercentage}%`}
            subtitle="Autonomous Semester Exams"
            icon={Award}
            color="emerald"
          />

          <StatCard
            title="Overall Placement"
            value={`${academic.placementPercentage}%`}
            subtitle="Graduating Batch Placed"
            icon={Briefcase}
            color="blue"
          />

          <StatCard
            title="Total Publications"
            value={academic.publications}
            subtitle="Scopus / SCI Indexed Papers"
            icon={BookOpen}
            color="indigo"
          />

          <StatCard
            title="Total Patents"
            value={academic.patents}
            subtitle="IPR Cell Filed & Granted"
            icon={Sparkles}
            color="amber"
          />
        </div>
      </div>
    </div>
  );
};
