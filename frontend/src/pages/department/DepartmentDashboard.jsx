import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, ClipboardCheck, Undo2, FolderCheck, BadgeCheck,
  CheckSquare, AlertTriangle, Star, ShieldCheck, Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDepartmentPortal } from '../../hooks/useDepartmentPortal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DepartmentHeader, DepartmentKpiCard, DepartmentAttentionCard } from '../../components/department';

export const DepartmentDashboard = () => {
  const { user, academicYear } = useAuth();
  const { department, kpis, attentionItems, recentActivity, health, trends, loading, error } = useDepartmentPortal(user, academicYear);

  if (loading) return <Loader message="Loading department dashboard..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  const cards = [
    { title: 'Staff', value: kpis?.staffCount, subtitle: 'Department members', icon: Users, to: '/department/staff', tone: 'indigo' },
    { title: 'Pending Review', value: kpis?.pendingReview, subtitle: 'Awaiting your review', icon: ClipboardCheck, to: '/department/review?status=UNDER_REVIEW', tone: 'amber' },
    { title: 'Returned', value: kpis?.returned, subtitle: 'Awaiting staff correction', icon: Undo2, to: '/department/review?status=RETURNED', tone: 'blue' },
    { title: 'Pending Evidence', value: kpis?.pendingEvidence, subtitle: 'Evidence under review', icon: FolderCheck, to: '/department/evidence', tone: 'amber' },
    { title: 'Verified Records', value: kpis?.verifiedRecords, subtitle: 'Verified submissions', icon: BadgeCheck, to: '/department/review?status=VERIFIED', tone: 'emerald' },
    { title: 'Open Actions', value: kpis?.openActions, subtitle: 'Open action items', icon: CheckSquare, to: '/department/action-items', tone: 'indigo' },
    { title: 'Overdue', value: kpis?.overdueActions, subtitle: 'Overdue actions', icon: AlertTriangle, to: '/department/action-items?status=OVERDUE', tone: 'rose' },
    { title: 'Quality Score', value: kpis?.qualityScore, subtitle: 'Department quality', icon: Star, to: '/department/quality', tone: 'teal' },
    { title: 'Compliance', value: kpis?.complianceRate != null ? `${kpis.complianceRate}%` : '—', subtitle: 'Compliance rate', icon: ShieldCheck, to: '/department/compliance', tone: 'emerald' },
    { title: 'NAAC Readiness', value: kpis?.accreditationReadiness != null ? `${kpis.accreditationReadiness}%` : '—', subtitle: 'Accreditation readiness', icon: Award, to: '/department/accreditation', tone: 'blue' },
  ];

  const submissionTrend = trends?.submissionsByMonth || [];
  const qualityTrend = trends?.qualityTrend || [];
  const activity = Array.isArray(recentActivity) ? recentActivity : [];
  const attention = Array.isArray(attentionItems) ? attentionItems : [];

  return (
    <div className="space-y-6">
      <DepartmentHeader department={department} academicYear={academicYear} />
      <p className="text-xs text-slate-500 font-medium -mt-3">HOD &amp; IQAC Coordinator workspace — click any metric to drill down.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map((c) => <DepartmentKpiCard key={c.title} {...c} />)}
      </div>

      <DepartmentAttentionCard items={attention} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900">Submission Trend</h3>
          {submissionTrend.length === 0 ? (
            <p className="text-xs text-slate-500 font-medium">No trend data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={submissionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="submitted" stroke="#4f46e5" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="verified" stroke="#059669" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900">Quality Trend</h3>
          {qualityTrend.length === 0 ? (
            <p className="text-xs text-slate-500 font-medium">No quality trend available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={qualityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900">Health Summary</h3>
          {!health ? (
            <p className="text-xs text-slate-500 font-medium">No health data available.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[['Quality', health.qualityScore], ['Compliance', health.compliance != null ? `${health.compliance}%` : '—'], ['Evidence Rate', health.evidenceRate != null ? `${health.evidenceRate}%` : '—'], ['Readiness', health.readiness != null ? `${health.readiness}%` : '—'], ['Pending Reviews', health.pendingReviews], ['Evidence Gaps', health.evidenceGaps], ['Overdue Actions', health.overdueActions], ['Critical Gaps', health.criticalGaps]].map(([label, value]) => (
                <div key={label} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="text-base font-black text-slate-900">{value ?? '—'}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
          {activity.length === 0 ? (
            <EmptyState title="No recent activity" description="Department activity will appear here." />
          ) : (
            <ul className="space-y-2">
              {activity.slice(0, 6).map((a) => (
                <li key={a.id} className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <p className="font-semibold text-slate-800">{a.text}</p>
                  <p className="text-[10px] text-slate-400">{a.time}{a.category ? ` · ${a.category}` : ''}</p>
                </li>
              ))}
            </ul>
          )}
          <Link to="/director/reports" className="inline-block text-xs font-bold text-indigo-700 hover:underline">View Department Report</Link>
        </Card>
      </div>
    </div>
  );
};
