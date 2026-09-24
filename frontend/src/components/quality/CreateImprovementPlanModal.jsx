import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { X, Target } from 'lucide-react';
import { QUALITY_INDICATOR_DEFINITIONS } from '../../config/qualityIndicatorConfig';
import { useAuth } from '../../context/AuthContext';

export const CreateImprovementPlanModal = ({ isOpen = false, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [departmentCode, setDepartmentCode] = useState('MECH');
  const [indicatorId, setIndicatorId] = useState('FDP_PARTICIPATION_RATE');
  const [problemStatement, setProblemStatement] = useState('');
  const [target, setTarget] = useState(90);
  const [currentValue, setCurrentValue] = useState(50);
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter an improvement plan title.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const ind = QUALITY_INDICATOR_DEFINITIONS.find((i) => i.id === indicatorId);
      await onSubmit({
        title,
        departmentCode,
        departmentName: `${departmentCode} Department`,
        indicatorId,
        indicatorName: ind ? ind.name : 'Quality Indicator',
        problemStatement,
        target: Number(target),
        currentValue: Number(currentValue),
        targetDate,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to launch improvement plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <Card className="w-full max-w-lg p-6 space-y-5 bg-white shadow-2xl border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Launch Department Improvement Plan
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Establish quality intervention, assign targets & link Stage 5E action items
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
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Plan Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. MECH Department FDP Completion & Evidence Acceleration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Target Department</label>
              <select
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none"
              >
                <option value="MECH">Mechanical Engineering (MECH)</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="CIVIL">Civil Engineering (CIVIL)</option>
                <option value="CSE">Computer Science (CSE)</option>
                <option value="EEE">Electrical & Electronics (EEE)</option>
                <option value="IT">Information Technology (IT)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Target Indicator</label>
              <select
                value={indicatorId}
                onChange={(e) => setIndicatorId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none"
              >
                {QUALITY_INDICATOR_DEFINITIONS.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Current Value (%)"
              type="number"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              required
            />
            <Input
              label="Target Benchmark (%)"
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
            <Input
              label="Target Completion Date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Problem Statement & Requirements</label>
            <textarea
              rows={3}
              placeholder="Describe indicator gap, root cause & required department corrective actions..."
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading} icon={Target}>
              Launch Plan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
