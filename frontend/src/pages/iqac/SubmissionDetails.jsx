import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubmissions } from '../../hooks/useSubmissions';
import { useEvidence } from '../../hooks/useEvidence';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { SubmissionStatusBadge } from '../../components/iqac/SubmissionStatusBadge';
import { SubmissionTimeline } from '../../components/iqac/SubmissionTimeline';
import { SubmissionHistory } from '../../components/iqac/SubmissionHistory';
import { SubmissionEvidenceList } from '../../components/iqac/SubmissionEvidenceList';
import { WorkflowActionModal } from '../../components/iqac/WorkflowActionModal';
import { SubmissionFormModal } from '../../components/iqac/SubmissionFormModal';
import { EvidenceUploadFormModal } from '../../components/iqac/EvidenceUploadFormModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  XCircle,
  ShieldCheck,
  FileText,
  User,
  Building2,
  Calendar,
  Download,
  AlertTriangle,
  Send,
  Edit,
  Plus,
} from 'lucide-react';
import { SUBMISSION_STATUS } from '../../config/submissionStatuses';

export const SubmissionDetails = () => {
  const { submissionId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    getSubmissionDetails,
    approveSubmission,
    returnSubmission,
    rejectSubmission,
    resubmitSubmission,
    verifySubmission,
    createSubmission,
  } = useSubmissions();

  const { getEvidenceBySubmission, uploadEvidence } = useEvidence();

  const [submission, setSubmission] = useState(null);
  const [linkedEvidence, setLinkedEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [actionType, setActionType] = useState('APPROVE');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEvidenceUploadOpen, setIsEvidenceUploadOpen] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const [subRes, evRes] = await Promise.all([
        getSubmissionDetails(submissionId),
        getEvidenceBySubmission(submissionId),
      ]);

      if (subRes.success) setSubmission(subRes.data);
      if (evRes.success) setLinkedEvidence(evRes.data);
    } catch (err) {
      console.error('Error loading submission details:', err);
      toast.error(err.message || 'Failed to load submission.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [submissionId]);

  if (loading || !submission) {
    return <Loader message="Loading Submission Details & Workflow Audit Trail..." />;
  }

  const role = user?.role || ROLES.STAFF;
  const isSubmitter = user?.email === submission.submittedByEmail || user?.name === submission.submittedBy;
  const isHeadOrApex = role === ROLES.IQAC_HEAD || role === ROLES.TECHNICAL_DIRECTOR || role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL || role === ROLES.INSTITUTION_ADMIN;
  const isVerified = submission.status === SUBMISSION_STATUS.VERIFIED;
  const isDraft = submission.status === SUBMISSION_STATUS.DRAFT;
  const isReturned = submission.status === SUBMISSION_STATUS.RETURNED;
  const canReview = !isVerified && !isDraft && (isHeadOrApex || submission.currentReviewerRole === role);

  const handleOpenAction = (act) => {
    setActionType(act);
    setIsActionModalOpen(true);
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
      toast.success(res.message || 'Action executed successfully.');
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Action failed.');
      throw err;
    }
  };

  const handleResubmit = async () => {
    try {
      const res = await resubmitSubmission(submission.id, 'Resubmitted with corrected documentation.');
      toast.success(res.message || 'Resubmitted into review queue.');
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to resubmit.');
    }
  };

  const handleEditSubmit = async (payload) => {
    try {
      const res = await createSubmission({ ...payload, isSubmit: true });
      toast.success(res.message || 'Submission updated and sent.');
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to update.');
    }
  };

  const handleEvidenceUploadSubmit = async (payload) => {
    try {
      const res = await uploadEvidence({
        ...payload,
        submissionId: submission.submissionId,
        submissionTitle: submission.title,
      });
      toast.success(res.message || 'Evidence document linked successfully.');
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Evidence upload failed.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/submissions"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Back to Submissions Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {submission.submissionId}
              </h1>
              <SubmissionStatusBadge status={submission.status} />
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-200">
                {submission.priority} Priority
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {submission.typeLabel} &bull; {submission.departmentName} ({submission.departmentCode})
            </p>
          </div>
        </div>

        {/* Workflow Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {isReturned && isSubmitter && (
            <button
              type="button"
              onClick={handleResubmit}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Resubmit for Review</span>
            </button>
          )}

          {(isDraft || isReturned) && isSubmitter && (
            <button
              type="button"
              onClick={() => setIsFormModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Submission</span>
            </button>
          )}

          {canReview && (
            <>
              {isHeadOrApex && (
                <button
                  type="button"
                  onClick={() => handleOpenAction('VERIFY')}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Official Data</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleOpenAction('APPROVE')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenAction('RETURN')}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Return</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenAction('REJECT')}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Title & Submitter Card */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
            {submission.typeLabel}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            {submission.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <User className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Submitted By</p>
              <p className="font-bold text-slate-900">{submission.submittedBy}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Department</p>
              <p className="font-bold text-slate-900">{submission.departmentName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Submitted Date</p>
              <p className="font-bold text-slate-900">{submission.submittedAt || submission.createdAt}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Returned Reason Alert Banner */}
      {isReturned && submission.returnReason && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Returned by Reviewer: {submission.returnReason}</span>
          </div>
          <p className="text-xs text-amber-800 leading-snug">
            Please edit your submission or upload the missing evidence, then click <strong>Resubmit for Review</strong>.
          </p>
        </div>
      )}

      {/* Module Dynamic Data Payload */}
      <Card className="p-5 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
          Module-Specific Submission Data
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {Object.entries(submission.data || {}).map(([key, val]) => (
            <div key={key} className="space-y-0.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {key.replace(/([A-Z])/g, ' $1')}
              </p>
              <p className="font-semibold text-slate-900 leading-snug">{String(val)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Stage 5D Linked Evidence Documents List (Section 22 & 43 requirement) */}
      <SubmissionEvidenceList
        evidenceList={linkedEvidence}
        submissionId={submission.submissionId}
        onOpenUpload={() => setIsEvidenceUploadOpen(true)}
      />

      {/* Workflow Timeline & History */}
      <SubmissionTimeline submission={submission} />

      <SubmissionHistory history={submission.history || []} />

      {/* Action Modal */}
      <WorkflowActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        actionType={actionType}
        submission={submission}
        onConfirm={handleConfirmAction}
      />

      {/* Edit Form Modal */}
      <SubmissionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleEditSubmit}
        editingSubmission={submission}
      />

      {/* Evidence Upload Modal */}
      <EvidenceUploadFormModal
        isOpen={isEvidenceUploadOpen}
        onClose={() => setIsEvidenceUploadOpen(false)}
        onUpload={handleEvidenceUploadSubmit}
        preselectedSubmissionId={submission.submissionId}
      />
    </div>
  );
};
