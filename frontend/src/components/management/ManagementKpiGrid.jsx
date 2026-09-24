import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  GraduationCap,
  Award,
  ShieldCheck,
  BadgeCheck,
  Clock,
  FolderOpen,
  FileCheck2,
  CheckCircle2,
  ClipboardList,
  AlertTriangle,
  Target,
} from 'lucide-react';
import { Card } from '../common/Card';

const TONE_MAP = {
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  violet: 'bg-violet-50 text-violet-600 border-violet-100',
  teal: 'bg-teal-50 text-teal-600 border-teal-100',
};

const pct = (v) => (v === null || v === undefined || v === '' ? '—' : `${v}%`);
const num = (v) => (v === null || v === undefined || v === '' ? '—' : v);

const Tile = ({ title, value, subtitle, icon: Icon, tone = 'slate', to }) => (
  <Card hover className="p-4 sm:p-5">
    <Link to={to} aria-label={`${title}: ${value} — view details`} className="block">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`p-2 rounded-xl border shrink-0 ${TONE_MAP[tone] || TONE_MAP.slate}`}
          aria-hidden="true"
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
        {value}
      </div>
      {subtitle && (
        <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-1">{subtitle}</p>
      )}
    </Link>
  </Card>
);

export const ManagementKpiGrid = ({ kpis }) => {
  const k = kpis || {};
  const tiles = [
    { title: 'Departments', value: num(k.totalDepartments), subtitle: 'Across institution', icon: Building2, tone: 'slate', to: '/management/comparison' },
    { title: 'Students', value: num(k.totalStudents), subtitle: 'Total enrolment', icon: Users, tone: 'blue', to: '/management/comparison' },
    { title: 'Faculty', value: num(k.totalFaculty), subtitle: 'Teaching staff', icon: GraduationCap, tone: 'violet', to: '/management/comparison' },
    { title: 'Quality Score', value: pct(k.qualityScore), subtitle: 'Institutional average', icon: Award, tone: 'amber', to: '/management/quality' },
    { title: 'Compliance Rate', value: pct(k.complianceRate), subtitle: 'Mandatory requirements', icon: ShieldCheck, tone: 'emerald', to: '/management/compliance' },
    { title: 'Accreditation Readiness', value: pct(k.accreditationReadiness), subtitle: 'Criteria coverage', icon: BadgeCheck, tone: 'teal', to: '/management/accreditation' },
    { title: 'Pending Reviews', value: num(k.pendingReviews), subtitle: 'Awaiting assessment', icon: Clock, tone: 'amber', to: '/management/quality' },
    { title: 'Evidence Pending', value: num(k.evidencePending), subtitle: 'Items outstanding', icon: FolderOpen, tone: 'rose', to: '/management/analytics' },
    { title: 'Evidence Completeness', value: pct(k.evidenceCompleteness), subtitle: 'Repository coverage', icon: FileCheck2, tone: 'blue', to: '/management/analytics' },
    { title: 'Verified Records', value: num(k.verifiedRecords), subtitle: 'Approved evidence', icon: CheckCircle2, tone: 'emerald', to: '/management/analytics' },
    { title: 'Open Actions', value: num(k.openActions), subtitle: 'Improvement items', icon: ClipboardList, tone: 'violet', to: '/management/overview' },
    { title: 'Overdue Actions', value: num(k.overdueActions), subtitle: 'Past due date', icon: AlertTriangle, tone: 'rose', to: '/management/overview' },
  ];

  // Active improvement plans shown as a footer strip when present
  const plans = k.activeImprovementPlans;

  return (
    <div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
        role="list"
        aria-label="Institution key indicators"
      >
        {tiles.map((t) => (
          <Tile key={t.title} {...t} />
        ))}
      </div>
      {(plans !== null && plans !== undefined && plans !== '') && (
        <Link
          to="/management/overview"
          className="mt-3 flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <Target className="w-4 h-4" aria-hidden="true" />
          {plans} active improvement plan{Number(plans) === 1 ? '' : 's'} — view overview
        </Link>
      )}
    </div>
  );
};
