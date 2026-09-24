import React from 'react';
import { Card } from '../common/Card';
import { SUBMISSION_STATUS } from '../../config/submissionStatuses';
import { CheckCircle2, Clock, RotateCcw, XCircle, ShieldCheck } from 'lucide-react';

export const SubmissionTimeline = ({ submission }) => {
  if (!submission) return null;

  const currentStatus = submission.status;

  const steps = [
    { key: 'SUBMITTED', label: 'Submitted', desc: submission.submittedAt || 'Initial Submission' },
    { key: 'UNDER_REVIEW', label: 'Under Review', desc: submission.currentReviewerName || 'Review In Progress' },
    { key: 'APPROVED', label: 'Approved', desc: submission.approvedAt ? `Approved by ${submission.approvedBy}` : 'Pending Reviewer Approval' },
    { key: 'VERIFIED', label: 'Verified', desc: submission.verifiedAt ? `Verified by ${submission.verifiedBy}` : 'Pending IQAC Verification' },
  ];

  const getStepStatus = (key, idx) => {
    if (currentStatus === SUBMISSION_STATUS.REJECTED) {
      if (key === 'UNDER_REVIEW') return 'REJECTED';
    }
    if (currentStatus === SUBMISSION_STATUS.RETURNED) {
      if (key === 'UNDER_REVIEW') return 'RETURNED';
    }
    if (currentStatus === SUBMISSION_STATUS.VERIFIED) return 'COMPLETED';
    if (currentStatus === SUBMISSION_STATUS.APPROVED) {
      if (idx <= 2) return 'COMPLETED';
      return 'PENDING';
    }
    if (currentStatus === SUBMISSION_STATUS.UNDER_REVIEW || currentStatus === SUBMISSION_STATUS.SUBMITTED || currentStatus === SUBMISSION_STATUS.RESUBMITTED) {
      if (idx === 0) return 'COMPLETED';
      if (idx === 1) return 'CURRENT';
      return 'PENDING';
    }
    if (currentStatus === SUBMISSION_STATUS.DRAFT) {
      return 'PENDING';
    }
    return 'PENDING';
  };

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">
          Workflow Progression Lifecycle
        </h3>
        <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
          Stage 5C Workflow Engine
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {steps.map((st, idx) => {
          const state = getStepStatus(st.key, idx);

          let bg = 'bg-slate-50 border-slate-200 text-slate-400';
          let icon = <Clock className="w-4 h-4 text-slate-400" />;

          if (state === 'COMPLETED') {
            bg = 'bg-emerald-50 border-emerald-200 text-emerald-950';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
          } else if (state === 'CURRENT') {
            bg = 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold ring-2 ring-indigo-500/20';
            icon = <Clock className="w-4 h-4 text-indigo-600" />;
          } else if (state === 'RETURNED') {
            bg = 'bg-amber-50 border-amber-200 text-amber-950 font-bold';
            icon = <RotateCcw className="w-4 h-4 text-amber-600" />;
          } else if (state === 'REJECTED') {
            bg = 'bg-rose-50 border-rose-200 text-rose-950 font-bold';
            icon = <XCircle className="w-4 h-4 text-rose-600" />;
          }

          return (
            <div key={st.key} className={`p-3 rounded-xl border space-y-1.5 ${bg}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold truncate">{st.label}</span>
                {icon}
              </div>
              <p className="text-[10px] text-slate-500 leading-tight truncate">
                {st.desc}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
