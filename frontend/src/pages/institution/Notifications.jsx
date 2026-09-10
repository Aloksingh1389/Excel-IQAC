import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from '../../components/notifications/NotificationItem';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'READ'
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    const res = await notificationService.markNotificationRead(id);
    if (res.success) setNotifications(res.data);
  };

  const handleMarkAllRead = async () => {
    const res = await notificationService.markAllNotificationsRead();
    if (res.success) setNotifications(res.data);
  };

  const handleDelete = async (id) => {
    const res = await notificationService.deleteNotification(id);
    if (res.success) setNotifications(res.data);
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'READ') return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Institutional Notifications
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Review activity alerts, departmental submissions, and verification requests.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={handleMarkAllRead}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
            filter === 'ALL'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
            filter === 'UNREAD'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>

        <button
          type="button"
          onClick={() => setFilter('READ')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
            filter === 'READ'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading alerts...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications found"
          description={
            filter === 'UNREAD'
              ? 'You have caught up with all institutional notifications.'
              : 'There are no notifications in this category.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
