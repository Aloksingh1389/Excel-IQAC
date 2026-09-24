import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { X, UserPlus, Shield, Building2 } from 'lucide-react';

export const AssignCoordinatorModal = ({
  isOpen = false,
  onClose,
  unassignedDepartments = [],
  allDepartments = [],
  candidates = [],
  onAssign,
  preselectedDepartment = null,
}) => {
  const [departmentId, setDepartmentId] = useState('');
  const [selectedCandidateUserId, setSelectedCandidateUserId] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (preselectedDepartment) {
      setDepartmentId(preselectedDepartment.id || preselectedDepartment.code);
    } else if (unassignedDepartments.length > 0) {
      setDepartmentId(unassignedDepartments[0].id);
    } else if (allDepartments.length > 0) {
      setDepartmentId(allDepartments[0].id);
    }
  }, [preselectedDepartment, unassignedDepartments, allDepartments, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentId) {
      setErrorMessage('Please select a department.');
      return;
    }
    if (!selectedCandidateUserId) {
      setErrorMessage('Please select an eligible faculty candidate.');
      return;
    }

    const candidate = candidates.find((c) => c.userId === selectedCandidateUserId) || {
      userId: selectedCandidateUserId,
      name: 'Dr. Selected Candidate',
      email: 'candidate@iqac.demo',
      employeeId: 'FAC-NEW-01',
    };

    setLoading(true);
    setErrorMessage('');

    try {
      await onAssign({
        departmentId,
        candidate,
        startDate,
        notes,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to assign coordinator.');
    } finally {
      setLoading(false);
    }
  };

  const targetDepts = unassignedDepartments.length > 0 ? unassignedDepartments : allDepartments;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <Card className="w-full max-w-lg p-6 space-y-5 bg-white shadow-2xl border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Assign Department IQAC Coordinator
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Appoint an active faculty lead to oversee department quality compliance
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Select Department <span className="text-rose-500">*</span>
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
              required
            >
              {targetDepts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} — {d.name} {!d.iqacCoordinatorId ? '(Unassigned)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Select Faculty Candidate <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedCandidateUserId}
              onChange={(e) => setSelectedCandidateUserId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
              required
            >
              <option value="">-- Choose eligible faculty candidate --</option>
              {candidates.map((c) => (
                <option key={c.userId} value={c.userId}>
                  {c.name} ({c.employeeId} - {c.designation})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400">
              Note: Excludes faculty members already serving as active department coordinators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Assignment Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Appointment Notes / Reason
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Appointed as IQAC Coordinator for Academic Year 2026-27..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading}>
              Confirm Assignment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
