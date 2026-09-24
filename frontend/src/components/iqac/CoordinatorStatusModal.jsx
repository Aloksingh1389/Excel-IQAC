import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { X, ShieldAlert, CheckCircle2, PauseCircle, XCircle } from 'lucide-react';

export const CoordinatorStatusModal = ({
  isOpen = false,
  onClose,
  coordinator,
  onUpdateStatus,
}) => {
  const [targetStatus, setTargetStatus] = useState('SUSPENDED');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !coordinator) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((targetStatus === 'SUSPENDED' || targetStatus === 'DEACTIVATED') && (!reason || !reason.trim())) {
      setErrorMessage(`A mandatory reason is required to ${targetStatus.toLowerCase()} a coordinator.`);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await onUpdateStatus({
        coordinatorId: coordinator.id,
        status: targetStatus,
        reason,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <Card className="w-full max-w-lg p-6 space-y-5 bg-white shadow-2xl border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Update Coordinator Governance Status
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Manage active status, temporary suspension, or permanent deactivation
              </p>
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
          {/* Target Summary */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="font-bold text-slate-900 text-sm">{coordinator.name}</p>
            <p className="text-[11px] text-slate-500">
              {coordinator.employeeId} &bull; Department: {coordinator.departmentName || coordinator.departmentCode}
            </p>
            <p className="text-[11px] font-bold text-indigo-600 mt-1">
              Current Status: {coordinator.status}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-slate-700">
              Select Action / New Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetStatus('ACTIVE')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  targetStatus === 'ACTIVE'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span>Activate</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetStatus('SUSPENDED')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  targetStatus === 'SUSPENDED'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <PauseCircle className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span>Suspend</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetStatus('DEACTIVATED')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  targetStatus === 'DEACTIVATED'
                    ? 'border-rose-500 bg-rose-50 text-rose-950 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-600 mx-auto mb-1" />
                <span>Deactivate</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Mandatory Action Reason {(targetStatus === 'SUSPENDED' || targetStatus === 'DEACTIVATED') && <span className="text-rose-500">*</span>}
            </label>
            <textarea
              rows={3}
              placeholder="State reason for status update or suspension..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              required={targetStatus !== 'ACTIVE'}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={targetStatus === 'DEACTIVATED' ? 'danger' : 'primary'}
              size="md"
              loading={loading}
            >
              Confirm Status Change
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
