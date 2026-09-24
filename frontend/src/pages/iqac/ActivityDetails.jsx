import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useActivities } from '../../hooks/useActivities';
import { useEvidence } from '../../hooks/useEvidence';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { ActivityStatusBadge } from '../../components/iqac/ActivityStatusBadge';
import { SubmissionEvidenceList } from '../../components/iqac/SubmissionEvidenceList';
import { EvidenceUploadFormModal } from '../../components/iqac/EvidenceUploadFormModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  ArrowLeft,
  Award,
  Calendar,
  Clock,
  User,
  Building2,
  CheckCircle2,
  FileText,
  Users,
  ExternalLink,
  History,
  Target,
} from 'lucide-react';
import { ACTIVITY_STATUS } from '../../config/activityConfig';

export const ActivityDetails = () => {
  const { activityId } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const { getActivityDetails, updateActivityProgress } = useActivities();
  const { uploadEvidence } = useEvidence();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateComment, setUpdateComment] = useState('');
  const [isEvidenceUploadOpen, setIsEvidenceUploadOpen] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await getActivityDetails(activityId);
      if (res.success) setActivity(res.data);
    } catch (err) {
      console.error('Error loading activity details:', err);
      toast.error(err.message || 'Failed to load activity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [activityId]);

  if (loading || !activity) {
    return <Loader message="Loading Activity Objectives, Inter-connected Meetings & Evidence..." />;
  }

  const role = user?.role || ROLES.STAFF;
  const isOwner = user?.id === activity.ownerId || user?.name === activity.coordinatorName;
  const isHeadOrCoordinator = role === ROLES.IQAC_HEAD || role === ROLES.IQAC_COORDINATOR || role === ROLES.HOD || role === ROLES.TECHNICAL_DIRECTOR;
  const canUpdateProgress = isOwner || isHeadOrCoordinator;

  const handleProgressChange = async (val) => {
    try {
      const res = await updateActivityProgress(activity.id, val, updateComment);
      toast.success(res.message || `Activity progress updated to ${val}%.`);
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
        recordType: 'ACTIVITY',
        recordId: activity.activityId,
      });
      toast.success(res.message || 'Supporting evidence attached.');
      await fetchDetails();
    } catch (err) {
      toast.error('Failed to attach evidence.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/activities"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activity.activityId}
              </h1>
              <ActivityStatusBadge status={activity.status} />
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-200">
                {activity.categoryLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Owner: {activity.ownerName} ({activity.departmentCode})
            </p>
          </div>
        </div>
      </div>

      {/* Main Title & Overview Card */}
      <Card className="p-5 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
          {activity.title}
        </h2>

        {activity.description && (
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {activity.description}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <User className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Activity Owner</p>
              <p className="font-bold text-slate-900 truncate">{activity.coordinatorName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Target Scope</p>
              <p className="font-bold text-slate-900">{activity.departmentName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Timeline</p>
              <p className="font-bold text-slate-900">{activity.startDate} to {activity.endDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Users className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Participants Target</p>
              <p className="font-bold text-indigo-900">{activity.participantCount} Faculty / Staff</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Bar & Stage Setter */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Initiative Progress ({activity.progress}%)
            </h3>
          </div>
          <span className="text-xs font-black text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            {activity.status}
          </span>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${activity.progress}%` }}
          />
        </div>

        {canUpdateProgress && activity.status !== ACTIVITY_STATUS.COMPLETED && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Update Activity Progress Milestone</label>
              <input
                type="text"
                placeholder="Describe current implementation milestone..."
                value={updateComment}
                onChange={(e) => setUpdateComment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <button
                type="button"
                onClick={() => handleProgressChange(25)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold text-xs transition cursor-pointer"
              >
                25% (Initiated)
              </button>
              <button
                type="button"
                onClick={() => handleProgressChange(50)}
                className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs transition cursor-pointer"
              >
                50% (Drive Active)
              </button>
              <button
                type="button"
                onClick={() => handleProgressChange(75)}
                className="px-3 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-xs transition cursor-pointer"
              >
                75% (Submissions Verified)
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

      {/* Objectives & Outcomes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <Card className="p-5 space-y-3">
          <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">
            Strategic Activity Objectives
          </h3>
          <ul className="space-y-2 list-disc list-inside text-slate-700 font-medium">
            {(activity.objectives || []).map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">
            Measured Quality Outcomes & Results
          </h3>
          {(!activity.outcomes || activity.outcomes.length === 0) ? (
            <p className="text-slate-400 italic">Outcomes being measured in current drive stage.</p>
          ) : (
            <ul className="space-y-2 list-disc list-inside text-emerald-800 font-semibold">
              {activity.outcomes.map((out, i) => (
                <li key={i}>{out}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Linked Supporting Evidence Component (Stage 5D integration) */}
      <SubmissionEvidenceList
        evidenceList={[]}
        submissionId={activity.activityId}
        onOpenUpload={() => setIsEvidenceUploadOpen(true)}
      />

      {/* Activity Timeline History */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Activity Progression Audit Trail
          </h3>
        </div>

        <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 text-xs">
          {(activity.history || []).map((h) => (
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

      {/* Upload Evidence Modal */}
      <EvidenceUploadFormModal
        isOpen={isEvidenceUploadOpen}
        onClose={() => setIsEvidenceUploadOpen(false)}
        onUpload={handleEvidenceUploadSubmit}
        preselectedSubmissionId={activity.activityId}
      />
    </div>
  );
};
