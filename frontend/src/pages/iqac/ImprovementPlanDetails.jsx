import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useImprovementPlans } from '../../hooks/useImprovementPlans';
import { useEvidence } from '../../hooks/useEvidence';
import { SubmissionEvidenceList } from '../../components/iqac/SubmissionEvidenceList';
import { EvidenceUploadFormModal } from '../../components/iqac/EvidenceUploadFormModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, Target, AlertTriangle, User, Calendar, History, CheckSquare, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ImprovementPlanDetails = () => {
  const { planId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const { getImprovementPlanDetails, updatePlanProgress } = useImprovementPlans();
  const { uploadEvidence } = useEvidence();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateComment, setUpdateComment] = useState('');
  const [isEvidenceUploadOpen, setIsEvidenceUploadOpen] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await getImprovementPlanDetails(planId);
      if (res.success) setPlan(res.data);
    } catch (err) {
      console.error('Error fetching plan details:', err);
      toast.error('Failed to load improvement plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [planId]);

  if (loading || !plan) {
    return <Loader message="Loading Improvement Plan Objectives & Action Items..." />;
  }

  const handleProgressChange = async (val) => {
    try {
      const res = await updatePlanProgress(plan.id, val, updateComment);
      toast.success(res.message || `Progress updated to ${val}%.`);
      setUpdateComment('');
      await fetchDetails();
    } catch (err) {
      toast.error('Failed to update progress.');
    }
  };

  const handleEvidenceUploadSubmit = async (payload) => {
    try {
      const res = await uploadEvidence({
        ...payload,
        recordType: 'IMPROVEMENT_PLAN',
        recordId: plan.planId,
      });
      toast.success(res.message || 'Evidence document linked.');
      await fetchDetails();
    } catch (err) {
      toast.error('Failed to upload evidence.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/improvement-plans"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {plan.planId}: {plan.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
                {plan.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Target Department: {plan.departmentCode} &bull; Owner: {plan.ownerName}
            </p>
          </div>
        </div>
      </div>

      {/* Main Info Card */}
      <Card className="p-5 sm:p-6 space-y-4 text-xs">
        <h2 className="text-base font-bold text-slate-900 leading-snug">
          Problem Statement & Target Indicator Benchmark
        </h2>

        <p className="text-slate-700 font-medium leading-relaxed bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
          <strong>Problem Statement:</strong> {plan.problemStatement}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border">
            <Target className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Target Indicator</p>
              <p className="font-bold text-slate-900">{plan.indicatorName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Target Date</p>
              <p className="font-bold text-slate-900">{plan.targetDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border">
            <User className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Benchmark Gap</p>
              <p className="font-bold text-rose-700">Current: {plan.currentValue}% &rarr; Target: {plan.target}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Controls */}
      <Card className="p-5 sm:p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="font-bold text-slate-900">Intervention Implementation Progress ({plan.progress}%)</h3>
          <span className="font-bold text-indigo-900">{plan.status}</span>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-indigo-600 transition-all duration-300" style={{ width: `${plan.progress}%` }} />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border space-y-3">
          <input
            type="text"
            placeholder="Progress milestone update remark..."
            value={updateComment}
            onChange={(e) => setUpdateComment(e.target.value)}
            className="w-full px-3 py-2 text-xs border rounded-xl bg-white"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={() => handleProgressChange(25)} className="px-3 py-1 rounded bg-slate-200 font-bold">25%</button>
            <button type="button" onClick={() => handleProgressChange(50)} className="px-3 py-1 rounded bg-blue-100 font-bold text-blue-900">50%</button>
            <button type="button" onClick={() => handleProgressChange(75)} className="px-3 py-1 rounded bg-indigo-100 font-bold text-indigo-900">75%</button>
            <button type="button" onClick={() => handleProgressChange(100)} className="px-3.5 py-1 rounded bg-emerald-600 text-white font-bold">100% (Completed)</button>
          </div>
        </div>
      </Card>

      {/* Linked Stage 5E Action Items (Section 32 requirement) */}
      <Card className="p-5 space-y-3 text-xs">
        <h3 className="font-bold text-slate-900 pb-2 border-b">
          Linked Stage 5E Action Items ({plan.actionItemIds?.length || 0})
        </h3>
        {plan.actionItemIds && plan.actionItemIds.length > 0 ? (
          plan.actionItemIds.map((aId) => (
            <div key={aId} className="p-3 rounded-xl border bg-slate-50 flex items-center justify-between">
              <span className="font-bold text-slate-900">Action Item ID: {aId}</span>
              <Link to={`/iqac/action-items/${aId}`} className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-bold text-xs">
                Inspect Action Item
              </Link>
            </div>
          ))
        ) : (
          <p className="text-slate-400">No Stage 5E action items currently linked.</p>
        )}
      </Card>

      {/* Linked Supporting Evidence Component */}
      <SubmissionEvidenceList
        evidenceList={[]}
        submissionId={plan.planId}
        onOpenUpload={() => setIsEvidenceUploadOpen(true)}
      />

      {/* History Log */}
      <Card className="p-5 space-y-3 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900">Improvement Plan Audit Log</h3>
        </div>
        <div className="space-y-2">
          {(plan.history || []).map((h) => (
            <div key={h.id} className="p-2.5 rounded-xl bg-slate-50 border flex justify-between">
              <span className="font-bold text-slate-900">{h.action} &bull; {h.actorName}</span>
              <span className="text-[10px] text-slate-400">{h.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Upload Evidence Modal */}
      <EvidenceUploadFormModal
        isOpen={isEvidenceUploadOpen}
        onClose={() => setIsEvidenceUploadOpen(false)}
        onUpload={handleEvidenceUploadSubmit}
        preselectedSubmissionId={plan.planId}
      />
    </div>
  );
};
