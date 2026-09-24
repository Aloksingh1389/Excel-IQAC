import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useActionItems } from '../../hooks/useActionItems';
import { useEvidence } from '../../hooks/useEvidence';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { ActionItemStatusBadge } from '../../components/iqac/ActionItemStatusBadge';
import { SubmissionEvidenceList } from '../../components/iqac/SubmissionEvidenceList';
import { EvidenceUploadFormModal } from '../../components/iqac/EvidenceUploadFormModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  ArrowLeft,
  CheckSquare,
  Clock,
  User,
  Building2,
  Calendar,
  AlertTriangle,
  History,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { ACTION_STATUS } from '../../config/activityConfig';

export const ActionItemDetails = () => {
  const { actionItemId } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const { getActionItemDetails, updateActionProgress } = useActionItems();
  const { uploadEvidence } = useEvidence();

  const [actionItem, setActionItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateComment, setUpdateComment] = useState('');
  const [isEvidenceUploadOpen, setIsEvidenceUploadOpen] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await getActionItemDetails(actionItemId);
      if (res.success) setActionItem(res.data);
    } catch (err) {
      console.error('Error loading action item details:', err);
      toast.error(err.message || 'Failed to load action item.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [actionItemId]);

  if (loading || !actionItem) {
    return <Loader message="Loading Action Item Progress & Evidence Traceability..." />;
  }

  const role = user?.role || ROLES.STAFF;
  const isAssignedOwner = user?.email === actionItem.assignedToEmail || user?.name === actionItem.assignedTo;
  const isHeadOrCoordinator = role === ROLES.IQAC_HEAD || role === ROLES.IQAC_COORDINATOR || role === ROLES.HOD || role === ROLES.TECHNICAL_DIRECTOR;
  const canUpdateProgress = isAssignedOwner || isHeadOrCoordinator;

  const handleProgressChange = async (val) => {
    try {
      const res = await updateActionProgress(actionItem.id, val, updateComment);
      toast.success(res.message || `Progress updated to ${val}%.`);
      setUpdateComment('');
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to update progress.');
    }
  };

  const handleEvidenceUploadSubmit = async (payload) => {
    try {
      const res = await uploadEvidence({
        ...payload,
        recordType: 'ACTION_ITEM',
        recordId: actionItem.actionItemId,
      });
      toast.success(res.message || 'Completion evidence attached.');
      await fetchDetails();
    } catch (err) {
      toast.error('Failed to attach evidence.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/action-items"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {actionItem.actionItemId}
              </h1>
              <ActionItemStatusBadge status={actionItem.status} />
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-200">
                {actionItem.priority} Priority
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Assigned to {actionItem.assignedTo} ({actionItem.departmentCode})
            </p>
          </div>
        </div>
      </div>

      {/* Main Action Item Card */}
      <Card className="p-5 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
          {actionItem.title}
        </h2>

        {actionItem.description && (
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {actionItem.description}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <User className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned Owner</p>
              <p className="font-bold text-slate-900">{actionItem.assignedTo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Department</p>
              <p className="font-bold text-slate-900">{actionItem.departmentName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Target Due Date</p>
              <p className="font-bold text-slate-900">{actionItem.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Originating Meeting & Resolution Card */}
        {actionItem.meetingTitle && (
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-indigo-900 uppercase">Originating Meeting / Resolution</p>
              <p className="font-bold text-indigo-950">{actionItem.meetingTitle}</p>
              {actionItem.resolutionTitle && (
                <p className="text-[11px] text-indigo-800">Resolution: {actionItem.resolutionTitle}</p>
              )}
            </div>
            {actionItem.meetingId && (
              <Link
                to={`/iqac/meetings/${actionItem.meetingId}`}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shrink-0 inline-flex items-center gap-1"
              >
                <span>Inspect Meeting</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}
      </Card>

      {/* Progress Tracker Control (Section 35 requirement) */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Action Completion Progress ({actionItem.progress}%)
            </h3>
          </div>
          <span className="text-xs font-black text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            {actionItem.status}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${actionItem.progress}%` }}
            />
          </div>
        </div>

        {canUpdateProgress && actionItem.status !== ACTION_STATUS.COMPLETED && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Progress Remark / Update Comment</label>
              <input
                type="text"
                placeholder="Describe current implementation milestone..."
                value={updateComment}
                onChange={(e) => setUpdateComment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="font-bold text-slate-700 mr-2">Set Progress Stage:</span>
              <button
                type="button"
                onClick={() => handleProgressChange(25)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                25% (Initiated)
              </button>
              <button
                type="button"
                onClick={() => handleProgressChange(50)}
                className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs transition cursor-pointer"
              >
                50% (Halfway)
              </button>
              <button
                type="button"
                onClick={() => handleProgressChange(75)}
                className="px-3 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-xs transition cursor-pointer"
              >
                75% (Near Completion)
              </button>
              <button
                type="button"
                onClick={() => handleProgressChange(100)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
              >
                100% (Mark Completed)
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Linked Evidence Documents Component (Stage 5D integration) */}
      <SubmissionEvidenceList
        evidenceList={[]}
        submissionId={actionItem.actionItemId}
        onOpenUpload={() => setIsEvidenceUploadOpen(true)}
      />

      {/* History Log */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Action Implementation Audit Log
          </h3>
        </div>

        <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 text-xs">
          {(actionItem.history || []).map((h) => (
            <div key={h.id} className="relative space-y-1">
              <div className="w-2.5 h-2.5 rounded-full absolute -left-[21px] top-1 bg-indigo-600" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{h.action} &bull; {h.actorName}</span>
                <span className="text-[10px] text-slate-400">{h.timestamp}</span>
              </div>
              {h.comment && <p className="text-slate-600 leading-snug">{h.comment}</p>}
            </div>
          ))}
        </div>
      </Card>

      {/* Evidence Upload Modal */}
      <EvidenceUploadFormModal
        isOpen={isEvidenceUploadOpen}
        onClose={() => setIsEvidenceUploadOpen(false)}
        onUpload={handleEvidenceUploadSubmit}
        preselectedSubmissionId={actionItem.actionItemId}
      />
    </div>
  );
};
