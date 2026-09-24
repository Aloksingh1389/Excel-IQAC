import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStaff } from '../../hooks/useStaff';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { StaffProfileCard } from '../../components/staff/StaffProfileCard';
import { StaffAttentionCard } from '../../components/staff/StaffAttentionCard';
import { StaffQuickActions } from '../../components/staff/StaffQuickActions';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { UserCheck, FileText, Clock, RotateCcw, CheckCircle2, ShieldCheck, CheckSquare, AlertTriangle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const { profile, dashboard, loading } = useStaff();

  if (loading || !dashboard || !profile) {
    return <Loader message="Loading Faculty & Staff Portal Workspace..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Faculty & Staff Quality Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
              {profile.designation} &bull; {profile.departmentCode}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Institutional quality data submissions, evidence upload, task progress & academic contribution tracking
          </p>
        </div>
      </div>

      {/* Staff Profile Overview Card */}
      <StaffProfileCard profile={profile} />

      {/* Attention Required Banner (Section 11 requirement) */}
      <StaffAttentionCard attentionItems={dashboard.attentionItems} />

      {/* Quick Actions Shortcuts (Section 9 requirement) */}
      <StaffQuickActions />

      {/* KPI Cards Grid (Section 8 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <IQACStatCard
          title="Draft Submissions"
          value={dashboard.draftsCount}
          subtitle="Saved Drafts"
          icon={Clock}
          color="indigo"
        />
        <IQACStatCard
          title="Under Review"
          value={dashboard.underReviewCount}
          subtitle="Reviewer Workspace"
          icon={FileText}
          color="violet"
        />
        <IQACStatCard
          title="Returned Submissions"
          value={dashboard.returnedCount}
          subtitle="Action Required"
          icon={RotateCcw}
          color="rose"
        />
        <IQACStatCard
          title="Verified Submissions"
          value={dashboard.verifiedCount}
          subtitle="Approved & Met"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <IQACStatCard
          title="Profile Completion"
          value={`${dashboard.profileCompletion}%`}
          subtitle="Staff Profile"
          icon={UserCheck}
          color="teal"
        />
        <IQACStatCard
          title="Pending Evidence"
          value={dashboard.pendingEvidenceCount}
          subtitle="Under Review"
          icon={ShieldCheck}
          color="blue"
        />
        <IQACStatCard
          title="Assigned Tasks"
          value={dashboard.assignedTasksCount}
          subtitle="My Action Items"
          icon={CheckSquare}
          color="indigo"
        />
        <IQACStatCard
          title="Overdue Tasks"
          value={dashboard.overdueTasksCount}
          subtitle="Past Target Deadline"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Recent Activity Log (Section 10 requirement) */}
      <Card className="p-5 space-y-3 bg-white border-slate-200 text-xs">
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="font-bold text-slate-900">Recent Personal Activity Log</h3>
          <span className="text-[10px] font-bold text-slate-400">AY 2025-26</span>
        </div>

        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-slate-50 border flex items-center justify-between">
            <span className="font-bold text-slate-900">Research publication submitted &bull; Scopus DOI Proof attached</span>
            <span className="text-[10px] text-slate-400">2 hours ago</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border flex items-center justify-between">
            <span className="font-bold text-slate-900">5-Day ATAL FDP Certificate verified by IQAC Head</span>
            <span className="text-[10px] text-slate-400">Yesterday</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border flex items-center justify-between">
            <span className="font-bold text-slate-900">Faculty profile details updated</span>
            <span className="text-[10px] text-slate-400">2 days ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
