import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { ArrowLeft, Bell, CheckCircle2, RotateCcw, FileText, ClipboardList, CalendarDays } from 'lucide-react';

const NOTIFICATION_ICONS = {
  SUBMISSION_RETURNED: RotateCcw,
  SUBMISSION_APPROVED: CheckCircle2,
  EVIDENCE_VERIFIED: CheckCircle2,
  TASK_ASSIGNED: ClipboardList,
  MEETING_INVITATION: CalendarDays,
  SYSTEM: Bell,
};

const NOTIFICATION_COLORS = {
  SUBMISSION_RETURNED: 'bg-rose-50 border-rose-200 text-rose-700',
  SUBMISSION_APPROVED: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  EVIDENCE_VERIFIED: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  TASK_ASSIGNED: 'bg-amber-50 border-amber-200 text-amber-700',
  MEETING_INVITATION: 'bg-blue-50 border-blue-200 text-blue-700',
  SYSTEM: 'bg-slate-50 border-slate-200 text-slate-600',
};

export const StaffNotifications = () => {
  // Simulated notifications scoped to this staff member
  const notifications = [
    {
      id: 'notif_001', type: 'SUBMISSION_RETURNED', isRead: false,
      title: 'Publication Submission Returned',
      message: 'Your research publication "Deep Learning for Medical Imaging" was returned by HOD. Please attach the Scopus DOI proof.',
      timestamp: '2 hours ago',
      actionRoute: '/staff/submissions',
      actionLabel: 'View Submission',
    },
    {
      id: 'notif_002', type: 'EVIDENCE_VERIFIED', isRead: false,
      title: 'FDP Certificate Evidence Verified',
      message: 'Your ATAL FDP certificate for "Industry 4.0 Technologies" has been verified by IQAC Head.',
      timestamp: 'Yesterday',
      actionRoute: '/staff/evidence',
      actionLabel: 'View Evidence',
    },
    {
      id: 'notif_003', type: 'TASK_ASSIGNED', isRead: true,
      title: 'New Action Item Assigned',
      message: 'You have been assigned: "Submit NAAC Criterion 3 evidence files by September 30".',
      timestamp: '2 days ago',
      actionRoute: '/staff/tasks',
      actionLabel: 'View Tasks',
    },
    {
      id: 'notif_004', type: 'MEETING_INVITATION', isRead: true,
      title: 'IQAC Department Review Meeting Invitation',
      message: 'You are invited to the Department IQAC Quality Review Meeting on 20 Sep 2026 at 2:00 PM.',
      timestamp: '3 days ago',
      actionRoute: '/staff/meetings',
      actionLabel: 'View Meeting',
    },
    {
      id: 'notif_005', type: 'SYSTEM', isRead: true,
      title: 'Annual Data Submission Reminder',
      message: 'The deadline for Annual Faculty Data Submission (AY 2025-26) is September 30, 2026. Please ensure all submissions are complete.',
      timestamp: '5 days ago',
      actionRoute: '/staff/submissions',
      actionLabel: 'Go to Submissions',
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link to="/staff" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">{unreadCount}</span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Submission updates, task assignments, meeting invitations & announcements</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const Icon = NOTIFICATION_ICONS[notif.type] || Bell;
          const colorClass = NOTIFICATION_COLORS[notif.type] || NOTIFICATION_COLORS.SYSTEM;

          return (
            <Card key={notif.id} className={`p-4 space-y-2 border transition ${colorClass} ${!notif.isRead ? 'shadow-sm' : 'opacity-80'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl bg-white/60 shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-700">{notif.message}</p>
                    <p className="text-[10px] font-bold text-slate-400">{notif.timestamp}</p>
                  </div>
                </div>
              </div>
              <div className="pl-11">
                <Link
                  to={notif.actionRoute}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline transition"
                >
                  {notif.actionLabel} →
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
