import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { X, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ReassignCoordinatorModal = ({
  isOpen = false,
  onClose,
  coordinator,
  candidates = [],
  onReassign,
}) => {
  const [newCandidateUserId, setNewCandidateUserId] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (candidates.length > 0) {
      setNewCandidateUserId(candidates[0].userId);
    }
  }, [candidates, isOpen]);

  if (!isOpen || !coordinator) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCandidateUserId) {
      setErrorMessage('Please select a new coordinator candidate.');
      return;
    }
    if (!reason || !reason.trim()) {
      setErrorMessage('A mandatory reason is required for coordinator reassignment.');
      return;
    }

    const newCandidate = candidates.find((c) => c.userId === newCandidateUserId) || {
      userId: newCandidateUserId,
      name: 'Dr. New Candidate',
      email: 'new.coord@iqac.demo',
      employeeId: 'FAC-REASSIGN-01',
    };

    setLoading(true);
    setErrorMessage('');

    try {
      await onReassign({
        departmentId: coordinator.departmentId,
        oldCoordinatorId: coordinator.id,
        newCandidate,
        effectiveDate,
        reason,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to reassign coordinator.');
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
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Reassign Department IQAC Coordinator
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Transfer department quality management authority to a new faculty lead
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
          {/* Current Coordinator Info Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Current Coordinator ({coordinator.departmentCode})
            </p>
            <p className="font-bold text-slate-900 text-sm">
              {coordinator.name}
            </p>
            <p className="text-[11px] text-slate-500">
              {coordinator.employeeId} &bull; Assigned: {coordinator.assignedDate}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Select New Coordinator Candidate <span className="text-rose-500">*</span>
            </label>
            <select
              value={newCandidateUserId}
              onChange={(e) => setNewCandidateUserId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
              required
            >
              <option value="">-- Select new faculty candidate --</option>
              {candidates.map((c) => (
                <option key={c.userId} value={c.userId}>
                  {c.name} ({c.employeeId} - {c.designation})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Effective Reassignment Date"
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Mandatory Reassignment Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Specify structural or administrative reason for reassignment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading}>
              Confirm Reassignment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
