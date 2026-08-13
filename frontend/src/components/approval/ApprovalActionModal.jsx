import React, { useState } from 'react';
import { Modal } from '../overlay/Modal';
import { Button } from '../common/Button';
import { Textarea } from '../forms/Input';
import { CheckCircle2, XCircle, AlertTriangle, FileText } from 'lucide-react';

export const ApprovalActionModal = ({
  isOpen,
  onClose,
  approvalItem,
  actionType = 'APPROVE', // 'APPROVE' | 'REJECT' | 'CORRECTION'
  onConfirm,
  loading = false,
}) => {
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !approvalItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((actionType === 'REJECT' || actionType === 'CORRECTION') && !remarks.trim()) {
      setError('Please provide detailed feedback / reason.');
      return;
    }
    setError('');
    onConfirm(actionType, remarks);
  };

  const getActionConfig = () => {
    switch (actionType) {
      case 'APPROVE':
        return {
          title: 'Approve Submission',
          subtitle: 'Verify and grant formal institutional approval',
          btnText: 'Confirm Approval',
          btnVariant: 'success',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600 bg-emerald-100',
          placeholder: 'Optional commendation or approval remarks...',
          required: false,
        };
      case 'REJECT':
        return {
          title: 'Reject Submission',
          subtitle: 'Formal rejection notification will be dispatched to submitter',
          btnText: 'Confirm Rejection',
          btnVariant: 'danger',
          icon: XCircle,
          iconColor: 'text-rose-600 bg-rose-100',
          placeholder: 'Specify reason for rejection (mandatory)...',
          required: true,
        };
      case 'CORRECTION':
        return {
          title: 'Request Correction / Resubmission',
          subtitle: 'Item will be sent back to submitter for modifications',
          btnText: 'Send Correction Request',
          btnVariant: 'warning',
          icon: AlertTriangle,
          iconColor: 'text-amber-600 bg-amber-100',
          placeholder: 'Specify what documents or fields require amendment...',
          required: true,
        };
      default:
        return {};
    }
  };

  const config = getActionConfig();
  const IconComponent = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      subtitle={config.subtitle}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Summary Card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span>{approvalItem.type} &bull; {approvalItem.departmentName}</span>
            <span>{approvalItem.submissionDate}</span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm leading-snug">{approvalItem.title}</h4>
          <p className="text-slate-600">{approvalItem.summary}</p>
          <div className="text-slate-500 pt-1">
            Submitted by: <strong className="text-slate-800">{approvalItem.submittedBy}</strong>
          </div>
        </div>

        {/* Remarks Input */}
        <div>
          <Textarea
            label={actionType === 'APPROVE' ? 'Remarks (Optional)' : 'Reason / Actionable Feedback'}
            required={config.required}
            rows={4}
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              if (error) setError('');
            }}
            placeholder={config.placeholder}
            error={error}
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={config.btnVariant}
            size="sm"
            loading={loading}
          >
            {config.btnText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const EvidenceViewerModal = ({ isOpen, onClose, evidenceName, title, category }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Evidence Document Viewer"
      subtitle={title}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{evidenceName || 'Dossier_Evidence.pdf'}</div>
              <div className="text-xs text-slate-500">{category || 'Institutional Verification'} &bull; 2.4 MB</div>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
            Validated File
          </span>
        </div>

        {/* Document Simulated Preview Pane */}
        <div className="p-8 bg-slate-100 border border-slate-300 rounded-xl text-center flex flex-col items-center justify-center min-h-[220px]">
          <FileText className="w-12 h-12 text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-800">Digital Document Preview</p>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            This simulated document is stored securely in the institutional repository. In production, embedded PDF preview or signed AWS S3 pre-signed URL will load here.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  );
};
