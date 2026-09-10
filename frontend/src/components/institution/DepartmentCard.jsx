import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { getDepartmentStatus } from '../../utils/institutionUtils';
import { 
  Users, 
  GraduationCap, 
  Award, 
  Briefcase, 
  BookOpen, 
  FlaskConical, 
  ArrowRight,
  User 
} from 'lucide-react';

export const DepartmentCard = ({ department }) => {
  if (!department) return null;
  const status = getDepartmentStatus(department.passPercentage);

  return (
    <Card
      hover
      className="p-5 flex flex-col justify-between space-y-4 border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all group"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 font-mono">
            {department.code}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.colorClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
            {status.label}
          </span>
        </div>

        <div>
          <Link
            to={`/director/institution/departments/${department.id}`}
            className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 block"
          >
            {department.name}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 truncate">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">HOD: {department.hod?.name || 'In-Charge'}</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-semibold">Students &bull; Faculty</span>
          <span className="font-bold text-slate-800">
            {Number(department.students).toLocaleString()} &bull; {department.faculty}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-semibold">Pass % &bull; Placement</span>
          <span className="font-bold text-slate-800">
            {department.passPercentage}% &bull; {department.placementPercentage}%
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 col-span-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Publications &bull; Research</span>
            <span className="font-bold text-indigo-700">
              {department.publications} Papers &bull; {department.researchProjects || 0} Grants
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Est. {department.established || 2001}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2">
        <Link to={`/director/institution/departments/${department.id}`} className="block">
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-between text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors"
          >
            <span>View Department Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
