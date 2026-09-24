import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { X, CheckCircle2, RotateCcw, XCircle, ShieldCheck, AlertCircle } from 'lucide-react';

export const WorkflowActionModal = ({
  isOpen = false,
  onClose,
  actionType = 'APPROVE', // 'APPROVE' | 'RETURN' | 'REJECT' | 'VERIFY'
  submission,
  onConfirm,
}) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !submission) return null;

  const getModalConfig = () => {
    switch (actionType) {
      case 'APPROVE':
        return {
          title: 'Approve Submission',
          desc: 'Confirm that this submission satisfies current review requirements.',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          buttonVariant: 'primary',
          buttonLabel: 'Approve Submission',
          requiresComment: false,
        };
      case 'RETURN':
        return {
          title: 'Return Submission to Submitter',
          desc: 'Specify mandatory correction guidelines or missing evidence details.',
          icon: <RotateCcw className="w-5 h-5 text-amber-600" />,
          buttonVariant: 'warning',
          buttonLabel: 'Return for Correction',
          requiresComment: true,
        };
      case 'REJECT':
        return {
          title: 'Reject Submission',
          desc: 'Specify mandatory reasons for rejecting this submission.',
          icon: <XCircle className="w-5 h-5 text-rose-600" />,
          buttonVariant: 'danger',
          buttonLabel: 'Confirm Rejection',
          requiresComment: true,
        };
      case 'VERIFY':
        return {
          title: 'Official IQAC Verification',
          desc: 'Confirm official quality verification. Verified data will become official dataset.',
          icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
          buttonVariant: 'primary',
          buttonLabel: 'Confirm Official Verification',
          requiresComment: false,
        };
      default:
        return {
          title: 'Workflow Action',
          desc: 'Process submission workflow transition.',
          icon: <AlertCircle className="w-5 h-5 text-indigo-600" />,
          buttonVariant: 'primary',
          buttonLabel: 'Confirm Action',
          requiresComment: false,
        };
    }
  };

  const config = getModalConfig();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (config.requiresComment && (!comment || !comment.trim())) {
      setErrorMessage(`A mandatory comment is required for '${actionType}'.`);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await onConfirm({
        submissionId: submission.id,
        action: actionType,
        comment,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Workflow transition failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <Card className="w-full max-w-lg p-6 space-y-5 bg-white shadow-2xl border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100">{config.icon}</div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{config.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{config.desc}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Target Submission: {submission.submissionId}
            </p>
            <p className="font-bold text-slate-900 text-sm leading-tight">{submission.title}</p>
            <p className="text-[11px] text-slate-500">
              Submitted By: {submission.submittedBy} ({submission.departmentCode})
            </p>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Reviewer Comment / Reason {config.requiresComment && <span className="text-rose-500">*</span>}
            </label>
            <textarea
              rows={3}
              placeholder={
                config.requiresComment
                  ? 'Specify mandatory reason or correction instructions...'
                  : 'Optional reviewer remarks or feedback...'
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required={config.requiresComment}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant={config.buttonVariant} size="md" loading={loading}>
              {config.buttonLabel}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
