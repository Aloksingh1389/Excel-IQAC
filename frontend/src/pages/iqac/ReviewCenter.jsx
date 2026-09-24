import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubmissions } from '../../hooks/useSubmissions';
import { useIQAC } from '../../hooks/useIQAC';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { SubmissionTable } from '../../components/iqac/SubmissionTable';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { WorkflowActionModal } from '../../components/iqac/WorkflowActionModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Clock, ShieldCheck, AlertTriangle, CheckCircle2, RotateCcw, XCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReviewCenter = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { departments } = useIQAC();
  const {
    pendingReviews,
    reviewStats,
    loading,
    approveSubmission,
    returnSubmission,
    rejectSubmission,
    verifySubmission,
  } = useSubmissions();

  const [selectedSub, setSelectedSub] = useState(null);
  const [actionType, setActionType] = useState('APPROVE');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading || !reviewStats) {
    return <Loader message="Loading Operational Review Center..." />;
  }

  const handleOpenAction = (sub, action) => {
    setSelectedSub(sub);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async ({ submissionId, action, comment }) => {
    try {
      let res;
      if (action === 'APPROVE') {
        res = await approveSubmission(submissionId, comment);
      } else if (action === 'RETURN') {
        res = await returnSubmission(submissionId, comment);
      } else if (action === 'REJECT') {
        res = await rejectSubmission(submissionId, comment);
      } else if (action === 'VERIFY') {
        res = await verifySubmission(submissionId, comment);
      }
      toast.success(res.message || 'Workflow action completed.');
    } catch (err) {
      toast.error(err.message || 'Action failed.');
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
              Operational Review Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Active review queue for submissions requiring your approval, return, rejection, or verification action
          </p>
        </div>
      </div>

      {/* Top Review Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <IQACStatCard
          title="Pending My Review"
          value={reviewStats.pendingMyReview}
          subtitle="Submissions Awaiting Action"
          icon={Clock}
          color="indigo"
        />
        <IQACStatCard
          title="High Priority Reviews"
          value={reviewStats.highPriority}
          subtitle="Urgent Accreditation Targets"
          icon={AlertTriangle}
          color="rose"
        />
        <IQACStatCard
          title="Overdue Reviews"
          value={reviewStats.overdue}
          subtitle="Past Target Due Date"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Pending Reviews Table with Quick Actions */}
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Action Queue ({pendingReviews.length} Pending)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Submissions in your department scope and current review stage
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 custom-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                <th className="p-3">Submission ID</th>
                <th className="p-3">Type & Title</th>
                <th className="p-3">Submitted By</th>
                <th className="p-3 text-center">Dept</th>
                <th className="p-3 text-center">Priority</th>
                <th className="p-3 text-center">Submitted Date</th>
                <th className="p-3 text-right">Review Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {pendingReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                    No submissions currently waiting for your review. Your action queue is clear!
                  </td>
                </tr>
              ) : (
                pendingReviews.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-indigo-900 whitespace-nowrap">
                      {sub.submissionId}
                    </td>

                    <td className="p-3">
                      <div className="space-y-0.5 max-w-xs">
                        <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                          {sub.typeLabel || sub.type}
                        </span>
                        <p className="font-bold text-slate-900 leading-tight truncate">
                          {sub.title}
                        </p>
                      </div>
                    </td>

                    <td className="p-3">
                      <p className="font-semibold text-slate-800 leading-tight">{sub.submittedBy}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{sub.submittedByRole.replace(/_/g, ' ')}</p>
                    </td>

                    <td className="p-3 text-center font-bold text-slate-800">
                      {sub.departmentCode}
                    </td>

                    <td className="p-3 text-center font-bold">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black bg-blue-50 text-blue-800 border border-blue-200">
                        {sub.priority}
                      </span>
                    </td>

                    <td className="p-3 text-center text-slate-500 text-[11px]">
                      {sub.submittedAt || sub.createdAt}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/iqac/submissions/${sub.id}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                          title="View Full Details"
                        >
                          View
                        </Link>

                        {user?.role === ROLES.IQAC_HEAD || user?.role === ROLES.TECHNICAL_DIRECTOR ? (
                          <button
                            type="button"
                            onClick={() => handleOpenAction(sub, 'VERIFY')}
                            className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer"
                          >
                            Verify
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenAction(sub, 'APPROVE')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                          >
                            Approve
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenAction(sub, 'RETURN')}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Return
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenAction(sub, 'REJECT')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Modal */}
      <WorkflowActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        actionType={actionType}
        submission={selectedSub}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};
