import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { X, ShieldCheck, RotateCcw, XCircle, AlertCircle } from 'lucide-react';

export const EvidenceReviewModal = ({
  isOpen = false,
  onClose,
  actionType = 'VERIFY', // 'VERIFY' | 'RETURN' | 'REJECT'
  evidence,
  onConfirm,
}) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !evidence) return null;

  const getModalConfig = () => {
    switch (actionType) {
      case 'VERIFY':
        return {
          title: 'Verify Official Evidence Document',
          desc: 'Confirm document authenticity for institutional compliance.',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
          buttonVariant: 'primary',
          buttonLabel: 'Confirm Verification',
          requiresComment: false,
        };
      case 'RETURN':
        return {
          title: 'Return Evidence to Uploader',
          desc: 'Specify mandatory correction guidelines or missing pages.',
          icon: <RotateCcw className="w-5 h-5 text-amber-600" />,
          buttonVariant: 'warning',
          buttonLabel: 'Return Document',
          requiresComment: true,
        };
      case 'REJECT':
        return {
          title: 'Reject Evidence Document',
          desc: 'Specify mandatory reasons for rejecting this evidence.',
          icon: <XCircle className="w-5 h-5 text-rose-600" />,
          buttonVariant: 'danger',
          buttonLabel: 'Confirm Rejection',
          requiresComment: true,
        };
      default:
        return {
          title: 'Evidence Review Action',
          desc: 'Process evidence verification transition.',
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
      setErrorMessage(`A mandatory comment is required to ${actionType.toLowerCase()} evidence.`);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await onConfirm({
        evidenceId: evidence.id,
        action: actionType,
        comment,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Evidence review action failed.');
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
              Target Evidence ID: {evidence.evidenceId} (v{evidence.version})
            </p>
            <p className="font-bold text-slate-900 text-sm leading-tight">{evidence.title}</p>
            <p className="text-[11px] text-slate-500">
              Uploaded By: {evidence.uploadedBy} ({evidence.departmentCode}) &bull; File: {evidence.fileName}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Reviewer Reason / Feedback {config.requiresComment && <span className="text-rose-500">*</span>}
            </label>
            <textarea
              rows={3}
              placeholder={
                config.requiresComment
                  ? 'Specify mandatory reason or correction instructions...'
                  : 'Optional verification remarks...'
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
