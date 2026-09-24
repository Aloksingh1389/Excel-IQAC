import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubmissions } from '../../hooks/useSubmissions';
import { useIQAC } from '../../hooks/useIQAC';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { SubmissionTable } from '../../components/iqac/SubmissionTable';
import { PendingActionsCard } from '../../components/iqac/PendingActionsCard';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { SubmissionFormModal } from '../../components/iqac/SubmissionFormModal';
import { Loader } from '../../components/common/Loader';
import { FileText, Clock, CheckCircle2, RotateCcw, ShieldCheck, Plus, AlertCircle, XCircle } from 'lucide-react';

export const SubmissionCenter = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { departments } = useIQAC();
  const {
    submissions,
    statistics,
    pendingReviews,
    loading,
    createSubmission,
  } = useSubmissions();

  const [isFormOpen, setIsFormOpen] = useState(false);

  if (loading || !statistics) {
    return <Loader message="Loading Institutional Submission Center..." />;
  }

  const handleCreateSubmit = async (payload) => {
    try {
      const res = await createSubmission(payload);
      toast.success(res.message || 'Submission created successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to create submission.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Institutional Submission Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Centralized portal for creating, updating, reviewing & verifying institutional quality submissions
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Submission</span>
        </button>
      </div>

      {/* Top Statistics KPI Grid (Section 10 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        <IQACStatCard
          title="Total Submissions"
          value={statistics.total}
          subtitle="Portfolio Scope"
          icon={FileText}
          color="indigo"
        />
        <IQACStatCard
          title="Drafts"
          value={statistics.draft}
          subtitle="Unsubmitted Portfolios"
          icon={Clock}
          color="blue"
        />
        <IQACStatCard
          title="Pending Review"
          value={statistics.pendingReview}
          subtitle="In Review Workflow"
          icon={Clock}
          color="amber"
        />
        <IQACStatCard
          title="Returned"
          value={statistics.returned}
          subtitle="Awaiting Correction"
          icon={RotateCcw}
          color="rose"
        />
        <IQACStatCard
          title="Approved"
          value={statistics.approved}
          subtitle="Reviewer Accepted"
          icon={CheckCircle2}
          color="emerald"
        />
        <IQACStatCard
          title="Verified"
          value={statistics.verified}
          subtitle="Official Dataset"
          icon={ShieldCheck}
          color="emerald"
          badgeText="OFFICIAL"
        />
      </div>

      {/* Role-Specific Action Queue Card (Section 33 requirement) */}
      <PendingActionsCard user={user} submissions={submissions} pendingReviews={pendingReviews} />

      {/* Main Submissions Table (Section 11 requirement) */}
      <SubmissionTable
        submissions={submissions}
        departments={departments}
      />

      {/* Create / Edit Form Modal */}
      <SubmissionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};
