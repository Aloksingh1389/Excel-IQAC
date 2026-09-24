import React, { useState } from 'react';
import { Send, Bell } from 'lucide-react';
import { Card } from '../common/Card';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const SCOPES = [
  { value: 'OWN_DEPARTMENT_STAFF', label: 'All department staff' },
  { value: 'SELECTED_STAFF', label: 'Selected staff (choose recipients on next step)' },
  { value: 'ROLE_WITHIN_DEPARTMENT', label: 'Specific role within department' },
];

export const DepartmentNotificationComposer = ({ onSend, sending = false }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [recipientScope, setRecipientScope] = useState('OWN_DEPARTMENT_STAFF');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError('Title and message are required.');
      return;
    }
    setError('');
    if (typeof onSend === 'function') {
      onSend({
        title: title.trim(),
        message: message.trim(),
        priority,
        recipientScope,
        dueDate: dueDate || null,
      });
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-60';
  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1';

  return (
    <Card className="p-5" aria-label="Compose department notification">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100" aria-hidden="true">
          <Bell className="w-4 h-4" />
        </div>
        <h2 className="text-sm font-bold text-slate-900">Notify Department</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="dept-notif-title" className={labelClass}>
            Title <span aria-hidden="true" className="text-rose-500">*</span>
          </label>
          <input
            id="dept-notif-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Evidence submission deadline extended"
            required
            disabled={sending}
            aria-required="true"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="dept-notif-message" className={labelClass}>
            Message <span aria-hidden="true" className="text-rose-500">*</span>
          </label>
          <textarea
            id="dept-notif-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write the notification details..."
            rows={4}
            required
            disabled={sending}
            aria-required="true"
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="dept-notif-priority" className={labelClass}>
              Priority
            </label>
            <select
              id="dept-notif-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={sending}
              className={inputClass}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dept-notif-scope" className={labelClass}>
              Recipients
            </label>
            <select
              id="dept-notif-scope"
              value={recipientScope}
              onChange={(e) => setRecipientScope(e.target.value)}
              disabled={sending}
              className={inputClass}
            >
              {SCOPES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dept-notif-due" className={labelClass}>
              Due Date
            </label>
            <input
              id="dept-notif-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={sending}
              className={inputClass}
            />
          </div>
        </div>

        {recipientScope === 'SELECTED_STAFF' && (
          <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            Note: with SELECTED_STAFF scope, choose individual recipients after sending or from the staff list.
          </p>
        )}

        {error && (
          <p role="alert" className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending}
            aria-label={sending ? 'Sending notification' : 'Send department notification'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {sending ? 'Sending…' : 'Send Notification'}
          </button>
        </div>
      </form>
    </Card>
  );
};
