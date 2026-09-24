import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { X, Send, Bell, Shield, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SendCoordinatorNotificationModal = ({
  isOpen = false,
  onClose,
  onSend,
  staffList = [],
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientScope, setRecipientScope] = useState('ALL_STAFF');
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [priority, setPriority] = useState('HIGH');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const toggleStaffSelection = (id) => {
    setSelectedStaffIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter a notification title.');
      return;
    }
    if (!message.trim()) {
      setErrorMessage('Please enter notification content message.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await onSend({
        senderUser: user,
        recipientScope,
        selectedStaffIds: recipientScope === 'ALL_STAFF' ? staffList.map((s) => s.id) : selectedStaffIds,
        title,
        message,
        priority,
        dueDate,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send notification.');
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
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Send Department Staff Notification
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Broadcast IQAC quality reminders & action deadlines ({user?.department || 'CSE Department'})
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
              Notification Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. FDP Information & Certificate Upload Required"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-semibold"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Recipient Scope <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRecipientScope('ALL_STAFF')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                  recipientScope === 'ALL_STAFF'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Department Staff ({staffList.length || 42})
              </button>

              <button
                type="button"
                onClick={() => setRecipientScope('SELECTED_STAFF')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                  recipientScope === 'SELECTED_STAFF'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Selected Staff Only
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Scope rule: Notifications are automatically restricted to faculty in {user?.department || 'your department'}.
            </p>
          </div>

          {recipientScope === 'SELECTED_STAFF' && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 max-h-36 overflow-y-auto space-y-1.5 custom-scroll">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Select Target Faculty:</p>
              {staffList.map((st) => (
                <label key={st.id} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={selectedStaffIds.includes(st.id)}
                    onChange={() => toggleStaffSelection(st.id)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{st.name} ({st.employeeId})</span>
                </label>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent Deadline</option>
              </select>
            </div>

            <Input
              label="Action Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Notification Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Enter detailed notification body, instructions, or evidence submission links..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading} icon={Send}>
              Broadcast Notification
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
