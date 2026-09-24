import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { X, Award, Calendar } from 'lucide-react';
import { ACTIVITY_CATEGORIES, ACTIVITY_CATEGORY_LABELS } from '../../config/activityConfig';
import { useAuth } from '../../context/AuthContext';

export const CreateActivityModal = ({ isOpen = false, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ACTIVITY_CATEGORIES.ACADEMIC_QUALITY);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [priority, setPriority] = useState('HIGH');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter an activity title.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await onSubmit({
        title,
        category,
        description,
        startDate,
        endDate,
        priority,
        departmentCode: user?.departmentCode || 'CSE',
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create activity.');
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
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Launch New IQAC Quality Activity
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Create quality initiative, set objectives & assign target department scope
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
              Activity Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Scopus Publication & Patent Filing Acceleration Drive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Activity Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none"
              >
                {Object.keys(ACTIVITY_CATEGORIES).map((k) => (
                  <option key={k} value={k}>
                    {ACTIVITY_CATEGORY_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none"
              >
                <option value="NORMAL">Normal Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent Benchmark</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Description & Objectives</label>
            <textarea
              rows={3}
              placeholder="Provide strategic goals, target KPIs and department guidelines..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading} icon={Award}>
              Launch Activity
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
