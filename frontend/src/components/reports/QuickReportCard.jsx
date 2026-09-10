import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

const ICON_MAP = {
  Building2,
  GraduationCap,
  Briefcase,
  BookOpen,
  Sparkles,
  ShieldCheck,
};

export const QuickReportCard = ({ report }) => {
  const IconComponent = ICON_MAP[report.icon] || Building2;

  return (
    <Link
      to={`/director/reports/generate?reportType=${report.id}`}
      className="p-3.5 bg-white hover:bg-indigo-50/50 rounded-xl border border-slate-200 hover:border-indigo-200 shadow-2xs transition flex items-center justify-between gap-3 group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition shrink-0">
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 truncate leading-snug">
            {report.name}
          </h4>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            {report.category}
          </span>
        </div>
      </div>

      <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center shrink-0 transition">
        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600" />
      </div>
    </Link>
  );
};
