import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Scale,
  BarChart3,
  Award,
  ShieldCheck,
  BadgeCheck,
  FileText,
  ClipboardList,
  ClipboardCheck,
} from 'lucide-react';
import { Card } from '../common/Card';

const ACTIONS = [
  { label: 'Overview', to: '/management/overview', icon: LayoutDashboard, tone: 'bg-slate-100 text-slate-600' },
  { label: 'Comparison', to: '/management/comparison', icon: Scale, tone: 'bg-violet-50 text-violet-600' },
  { label: 'Analytics', to: '/management/analytics', icon: BarChart3, tone: 'bg-blue-50 text-blue-600' },
  { label: 'Quality', to: '/management/quality', icon: Award, tone: 'bg-amber-50 text-amber-600' },
  { label: 'Compliance', to: '/management/compliance', icon: ShieldCheck, tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'Accreditation', to: '/management/accreditation', icon: BadgeCheck, tone: 'bg-teal-50 text-teal-600' },
  { label: 'Reports', to: '/management/reports', icon: FileText, tone: 'bg-indigo-50 text-indigo-600' },
  { label: 'AQAR', to: '/management/aqar', icon: ClipboardList, tone: 'bg-orange-50 text-orange-600' },
  { label: 'Audit', to: '/management/audit', icon: ClipboardCheck, tone: 'bg-rose-50 text-rose-600' },
];

export const ManagementQuickActions = () => {
  return (
    <Card className="p-4 sm:p-5" aria-label="Management quick actions">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
        Quick Navigation
      </h3>
      <nav
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-9 gap-2"
        aria-label="Management sections"
      >
        {ACTIONS.map(({ label, to, icon: Icon, tone }) => (
          <Link
            key={to}
            to={to}
            aria-label={`Go to ${label}`}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 bg-white p-3 hover:border-slate-300 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span className={`p-2 rounded-lg ${tone}`} aria-hidden="true">
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-slate-700">{label}</span>
          </Link>
        ))}
      </nav>
    </Card>
  );
};
