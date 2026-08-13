import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  CheckCheck, 
  ExternalLink,
  ChevronRight 
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

export const NotificationItem = ({ notif, onMarkRead }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'REJECTED':
      case 'CORRECTION':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'APPROVAL_REQUEST':
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div
      onClick={() => onMarkRead(notif.id)}
      className={`p-3 rounded-lg flex items-start gap-3 transition cursor-pointer ${
        notif.read ? 'bg-transparent hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50/80 border-l-2 border-blue-600'
      }`}
    >
      <div className="mt-0.5">{getIcon(notif.type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h5 className={`text-xs truncate ${notif.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
            {notif.title}
          </h5>
          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">{notif.message}</p>
      </div>
    </div>
  );
};

export const NotificationDropdown = ({ onClose }) => {
  const { role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await notificationService.getNotifications(role);
        setNotifications(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role]);

  const handleMarkAllRead = async () => {
    const res = await notificationService.markAllAsRead();
    setNotifications(res.data);
  };

  const handleMarkRead = async (id) => {
    const res = await notificationService.markAsRead(id);
    setNotifications(res.data);
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
          <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
            {notifications.filter((n) => !n.read).length} new
          </span>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100">
        {loading ? (
          <div className="py-6 text-center text-xs text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">No notifications found</div>
        ) : (
          notifications.slice(0, 5).map((notif) => (
            <NotificationItem key={notif.id} notif={notif} onMarkRead={handleMarkRead} />
          ))
        )}
      </div>

      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          View all notifications <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
