import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, Card } from '../../components/layout/PageContainer';
import { Button } from '../../components/common/Button';
import { notificationService } from '../../services/reportService';
import { Bell, CheckCheck, Trash2, CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';

export const NotificationsList = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, READ

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications(user?.id);
      setNotifications(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    await notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(user?.id);
    toast.success('All notifications marked as read.');
    loadNotifications();
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'READ') return n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'APPROVAL':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'DEADLINE':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'REJECTION':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Notifications & Activity Alerts"
        subtitle="Real-time institutional approval alerts, submission confirmations and deadline notices"
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={CheckCheck}
            onClick={handleMarkAllRead}
            disabled={notifications.every((n) => n.read)}
          >
            Mark All as Read
          </Button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
            filter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
            filter === 'UNREAD' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
        <button
          onClick={() => setFilter('READ')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
            filter === 'READ' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Read ({notifications.filter((n) => n.read).length})
        </button>
      </div>

      {/* Notification Cards */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No notifications found</h4>
          <p className="text-xs text-slate-400 mt-1">You are all caught up with your institutional alerts.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                !item.read
                  ? 'bg-blue-50/40 border-blue-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-slate-400 font-medium block pt-1">
                    {item.createdAt}
                  </span>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={() => handleMarkAsRead(item.id)}
                  title="Mark as read"
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition cursor-pointer shrink-0"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};
