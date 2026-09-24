import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  ClipboardCheck,
  FileWarning,
  ListTodo,
  AlarmClock,
  ShieldCheck,
  Award,
  Gauge,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../common/Card';

const DEFAULT_LINKS = {
  assignedDepartments: '/dean/dashboard',
  totalStaff: '/dean/dashboard',
  pendingReviews: '/dean/review',
  evidencePending: '/dean/evidence',
  openActions: '/dean/dashboard',
  overdueActions: '/dean/dashboard',
  complianceRate: '/dean/compliance',
  accreditationReadiness: '/dean/accreditation',
  qualityScore: '/dean/quality',
};

const TILES = [
  { key: 'assignedDepartments', title: 'Assigned Departments', icon: Building2, tone: 'bg-indigo-50 text-indigo-600 border-indigo-100', suffix: '' },
  { key: 'totalStaff', title: 'Total Staff', icon: Users, tone: 'bg-blue-50 text-blue-600 border-blue-100', suffix: '' },
  { key: 'pendingReviews', title: 'Pending Reviews', icon: ClipboardCheck, tone: 'bg-amber-50 text-amber-600 border-amber-100', suffix: '' },
  { key: 'evidencePending', title: 'Evidence Pending', icon: FileWarning, tone: 'bg-violet-50 text-violet-600 border-violet-100', suffix: '' },
  { key: 'openActions', title: 'Open Actions', icon: ListTodo, tone: 'bg-teal-50 text-teal-600 border-teal-100', suffix: '' },
  { key: 'overdueActions', title: 'Overdue Actions', icon: AlarmClock, tone: 'bg-rose-50 text-rose-600 border-rose-100', suffix: '' },
  { key: 'complianceRate', title: 'Compliance Rate', icon: ShieldCheck, tone: 'bg-emerald-50 text-emerald-600 border-emerald-100', suffix: '%' },
  { key: 'accreditationReadiness', title: 'Accreditation Readiness', icon: Award, tone: 'bg-emerald-50 text-emerald-600 border-emerald-100', suffix: '%' },
  { key: 'qualityScore', title: 'Quality Score', icon: Gauge, tone: 'bg-indigo-50 text-indigo-600 border-indigo-100', suffix: '' },
];

export const DeanKpiGrid = ({ kpis, links }) => {
  const data = kpis && typeof kpis === 'object' ? kpis : {};
  const linkMap = links && typeof links === 'object' ? links : {};

  // Spec asks for 8 clickable tiles; qualityScore renders as the 9th optional tile when provided.
  const visible = TILES.filter((t) => {
    if (t.key === 'qualityScore') return data[t.key] !== undefined && data[t.key] !== null;
    return true;
  });
  const tiles = visible.length >= 8 ? visible : TILES.slice(0, 8);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      aria-label="Dean key metrics"
    >
      {tiles.map((t) => {
        const raw = data[t.key];
        const display = raw === undefined || raw === null ? '—' : `${raw}${t.suffix}`;
        const to = linkMap[t.key] || DEFAULT_LINKS[t.key] || '/dean/dashboard';
        const IconComponent = t.icon;
        return (
          <Card key={t.key} hover className="p-5">
            <Link to={to} aria-label={`${t.title}: ${display} — view details`} className="block">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t.title}
                </span>
                <div className={`p-2.5 rounded-xl border shrink-0 ${t.tone}`} aria-hidden="true">
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {display}
              </div>
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-indigo-600">
                View details <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </Link>
          </Card>
        );
      })}
    </div>
  );
};
