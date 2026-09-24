import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvidence } from '../../hooks/useEvidence';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { EvidenceStatusBadge } from '../../components/iqac/EvidenceStatusBadge';
import { EvidencePreview } from '../../components/iqac/EvidencePreview';
import { EvidenceHistory } from '../../components/iqac/EvidenceHistory';
import { EvidenceReviewModal } from '../../components/iqac/EvidenceReviewModal';
import { EvidenceUploadFormModal } from '../../components/iqac/EvidenceUploadFormModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, ShieldCheck, RotateCcw, XCircle, FileText, User, Building2, Calendar, ExternalLink, Upload } from 'lucide-react';
import { EVIDENCE_STATUS } from '../../config/evidenceConfig';

export const EvidenceDetails = () => {
  const { evidenceId } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const {
    getEvidenceDetails,
    verifyEvidence,
    returnEvidence,
    rejectEvidence,
    resubmitEvidence,
  } = useEvidence();

  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [actionType, setActionType] = useState('VERIFY');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await getEvidenceDetails(evidenceId);
      if (res.success) setEvidence(res.data);
    } catch (err) {
      console.error('Error loading evidence details:', err);
      toast.error(err.message || 'Failed to load evidence document.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [evidenceId]);

  if (loading || !evidence) {
    return <Loader message="Loading Evidence Document Metadata & Version History..." />;
  }

  const role = user?.role || ROLES.STAFF;
  const isUploader = user?.email === evidence.uploadedByEmail || user?.name === evidence.uploadedBy;
  const isHeadOrApex = role === ROLES.IQAC_HEAD || role === ROLES.TECHNICAL_DIRECTOR || role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL || role === ROLES.INSTITUTION_ADMIN;
  const isVerified = evidence.status === EVIDENCE_STATUS.VERIFIED;
  const isReturned = evidence.status === EVIDENCE_STATUS.RETURNED;
  const canReview = !isVerified && (isHeadOrApex || role === ROLES.IQAC_COORDINATOR || role === ROLES.HOD || role === ROLES.DEAN);

  const handleOpenReview = (act) => {
    setActionType(act);
    setIsReviewModalOpen(true);
  };

  const handleConfirmReview = async ({ evidenceId, action, comment }) => {
    try {
      let res;
      if (action === 'VERIFY') {
        res = await verifyEvidence(evidenceId, comment);
      } else if (action === 'RETURN') {
        res = await returnEvidence(evidenceId, comment);
      } else if (action === 'REJECT') {
        res = await rejectEvidence(evidenceId, comment);
      }
      toast.success(res.message || 'Action executed successfully.');
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Action failed.');
      throw err;
    }
  };

  const handleResubmitSubmit = async (payload) => {
    try {
      const res = await resubmitEvidence(evidence.id, payload);
      toast.success(res.message || 'Corrected version uploaded and resubmitted successfully.');
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Resubmission failed.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/evidence"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Back to Evidence Repository"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {evidence.evidenceId}
              </h1>
              <EvidenceStatusBadge status={evidence.status} />
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
                Version v{evidence.version || 1}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {evidence.typeLabel} &bull; {evidence.departmentName} ({evidence.departmentCode})
            </p>
          </div>
        </div>

        {/* Workflow Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {isReturned && isUploader && (
            <button
              type="button"
              onClick={() => setIsResubmitModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Corrected Version (v{(evidence.version || 1) + 1})</span>
            </button>
          )}

          {canReview && (
            <>
              <button
                type="button"
                onClick={() => handleOpenReview('VERIFY')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Document</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenReview('RETURN')}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Return</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenReview('REJECT')}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Metadata Card */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
            {evidence.typeLabel}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            {evidence.title}
          </h2>
          {evidence.description && (
            <p className="text-xs text-slate-600 font-medium pt-1 leading-relaxed">
              {evidence.description}
            </p>
          )}
        </div>

        {/* Ownership & Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <User className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Uploaded By</p>
              <p className="font-bold text-slate-900">{evidence.uploadedBy}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Department</p>
              <p className="font-bold text-slate-900">{evidence.departmentName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Uploaded Date</p>
              <p className="font-bold text-slate-900">{evidence.uploadedAt}</p>
            </div>
          </div>
        </div>

        {/* Relationship Link Card (Section 15 requirement) */}
        {evidence.submissionId && (
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-indigo-900 uppercase">Linked Institutional Submission</p>
              <p className="font-bold text-indigo-950">{evidence.submissionTitle || evidence.submissionId}</p>
              <p className="text-[10px] text-slate-500">ID: {evidence.submissionId}</p>
            </div>
            <Link
              to={`/iqac/submissions/${evidence.submissionId}`}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shrink-0 inline-flex items-center gap-1"
            >
              <span>Inspect Submission</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </Card>

      {/* Returned Warning Banner */}
      {isReturned && evidence.returnReason && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Returned by Reviewer: {evidence.returnReason}</span>
          </div>
          <p className="text-xs text-amber-800 leading-snug">
            Please re-upload a corrected version. A new version number (v{(evidence.version || 1) + 1}) will be generated automatically.
          </p>
        </div>
      )}

      {/* 2-Column Grid: Preview & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EvidencePreview evidence={evidence} />

        <EvidenceHistory history={evidence.history || []} />
      </div>

      {/* Review Modal */}
      <EvidenceReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        actionType={actionType}
        evidence={evidence}
        onConfirm={handleConfirmReview}
      />

      {/* Resubmit Upload Modal */}
      <EvidenceUploadFormModal
        isOpen={isResubmitModalOpen}
        onClose={() => setIsResubmitModalOpen(false)}
        onUpload={handleResubmitSubmit}
        preselectedSubmissionId={evidence.submissionId}
      />
    </div>
  );
};
