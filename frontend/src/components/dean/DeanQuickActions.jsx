import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  ClipboardCheck,
  FileSearch,
  Gauge,
  ShieldCheck,
  Award,
  FileText,
} from 'lucide-react';
import { Card } from '../common/Card';

const ACTIONS = [
  { title: 'Compare Departments', description: 'Side-by-side metrics', to: '/dean/comparison', Icon: Scale, tone: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { title: 'Review Center', description: 'Pending staff reviews', to: '/dean/review', Icon: ClipboardCheck, tone: 'bg-amber-50 text-amber-600 border-amber-100' },
  { title: 'Evidence Health', description: 'Gaps & completeness', to: '/dean/evidence', Icon: FileSearch, tone: 'bg-violet-50 text-violet-600 border-violet-100' },
  { title: 'Quality', description: 'Scores & categories', to: '/dean/quality', Icon: Gauge, tone: 'bg-blue-50 text-blue-600 border-blue-100' },
  { title: 'Compliance', description: 'Criteria status', to: '/dean/compliance', Icon: ShieldCheck, tone: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { title: 'Accreditation', description: 'Readiness tracking', to: '/dean/accreditation', Icon: Award, tone: 'bg-teal-50 text-teal-600 border-teal-100' },
  { title: 'Reports', description: 'Exports & summaries', to: '/dean/reports', Icon: FileText, tone: 'bg-slate-100 text-slate-600 border-slate-200' },
];

export const DeanQuickActions = () => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      aria-label="Dean quick actions"
    >
      {ACTIONS.map(({ title, description, to, Icon, tone }) => (
        <Card key={to} hover className="p-5">
          <Link to={to} aria-label={title} className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border shrink-0 ${tone}`} aria-hidden="true">
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{title}</p>
              <p className="text-[11px] text-slate-500 font-medium truncate">{description}</p>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
};
