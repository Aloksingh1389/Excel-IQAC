import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, ArrowRight } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from './NotificationItem';

export const NotificationDropdown = ({ onClose, onNotificationsChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    const res = await notificationService.getNotifications();
    if (res.success) {
      setNotifications(res.data);
      if (onNotificationsChange) onNotificationsChange(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    await notificationService.markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllNotificationsRead();
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-700">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {loading ? (
          <div className="p-6 text-center text-xs text-slate-400">Loading alerts...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
        ) : (
          notifications.slice(0, 4).map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              onMarkRead={handleMarkRead}
              compact
            />
          ))
        )}
      </div>

      <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
        <Link
          to="/director/notifications"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 w-full py-1.5 transition"
        >
          <span>View All Notifications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCount = async () => {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setUnreadCount(res.data.filter((n) => !n.read).length);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
        className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      >
        <Bell className="w-4 h-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          onClose={() => setIsOpen(false)}
          onNotificationsChange={(list) =>
            setUnreadCount(list.filter((n) => !n.read).length)
          }
        />
      )}
    </div>
  );
};
