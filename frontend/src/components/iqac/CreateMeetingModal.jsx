import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { X, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { MEETING_TYPES, MEETING_TYPE_LABELS, MEETING_MODES } from '../../config/meetingConfig';
import { useAuth } from '../../context/AuthContext';

export const CreateMeetingModal = ({ isOpen = false, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [meetingType, setMeetingType] = useState(MEETING_TYPES.IQAC_REVIEW);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:30 AM');
  const [venue, setVenue] = useState('IQAC Boardroom (Block A)');
  const [mode, setMode] = useState(MEETING_MODES.PHYSICAL);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter a meeting title.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await onSubmit({
        title,
        meetingType,
        date,
        startTime,
        endTime,
        venue,
        mode,
        departmentCode: user?.departmentCode || 'CSE',
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to schedule meeting.');
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
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Schedule IQAC Quality Meeting
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Create new meeting agenda, set venue, mode & invite participants
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
              Meeting Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Q3 Department Quality & Scopus Proof Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Meeting Type</label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none"
              >
                {Object.keys(MEETING_TYPES).map((k) => (
                  <option key={k} value={k}>
                    {MEETING_TYPE_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Meeting Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none"
              >
                <option value="PHYSICAL">Physical Meeting</option>
                <option value="ONLINE">Online Meeting</option>
                <option value="HYBRID">Hybrid Meeting</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Meeting Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              label="Start Time"
              placeholder="10:00 AM"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              label="End Time"
              placeholder="11:30 AM"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <Input
            label="Venue / Online Link"
            placeholder="e.g. Conference Room 302 or Google Meet link"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading} icon={Calendar}>
              Schedule Meeting
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
