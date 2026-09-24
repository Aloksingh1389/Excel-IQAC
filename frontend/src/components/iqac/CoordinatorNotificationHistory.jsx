import React from 'react';
import { Card } from '../common/Card';
import { Bell, Send, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const CoordinatorNotificationHistory = ({ notifications = [], onOpenSendModal }) => {
  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'URGENT':
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Department Broadcast Notifications
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Sent IQAC reminders, due dates & response tracking
            </p>
          </div>
        </div>

        {onOpenSendModal && (
          <button
            type="button"
            onClick={onOpenSendModal}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Notification</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80 custom-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
              <th className="p-3">Date</th>
              <th className="p-3">Title & Message</th>
              <th className="p-3 text-center">Recipients</th>
              <th className="p-3 text-center">Priority</th>
              <th className="p-3 text-center">Due Date</th>
              <th className="p-3 text-center">Response Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {notifications.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400 font-medium">
                  No notifications sent yet for this department scope.
                </td>
              </tr>
            ) : (
              notifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 text-slate-500 whitespace-nowrap">
                    {notif.createdAt}
                  </td>

                  <td className="p-3">
                    <div className="space-y-0.5 max-w-xs">
                      <p className="font-bold text-slate-900 leading-tight">
                        {notif.title}
                      </p>
                      <p className="text-[10px] text-slate-500 font-normal truncate">
                        {notif.message}
                      </p>
                    </div>
                  </td>

                  <td className="p-3 text-center font-bold text-slate-700">
                    {notif.recipientCount} Staff
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase ${getPriorityBadge(
                        notif.priority
                      )}`}
                    >
                      {notif.priority}
                    </span>
                  </td>

                  <td className="p-3 text-center text-slate-600 font-semibold">
                    {notif.dueDate || 'N/A'}
                  </td>

                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>
                        {notif.respondedCount}/{notif.recipientCount} Responded
                      </span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
