// Notifications Service for IQAC Management System

import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';
import { storage, STORAGE_KEYS } from '../utils/storage';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredNotifications = () => {
  const stored = storage.get(STORAGE_KEYS.NOTIFICATIONS);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  // Initialize from mock
  storage.set(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
  return MOCK_NOTIFICATIONS;
};

export const notificationService = {
  getNotifications: async () => {
    await delay();
    return {
      success: true,
      data: getStoredNotifications(),
    };
  },

  markNotificationRead: async (notificationId) => {
    await delay(100);
    const notifications = getStoredNotifications();
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
    return {
      success: true,
      data: updated,
    };
  },

  markAllNotificationsRead: async () => {
    await delay(100);
    const notifications = getStoredNotifications();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
    return {
      success: true,
      data: updated,
    };
  },

  deleteNotification: async (notificationId) => {
    await delay(100);
    const notifications = getStoredNotifications();
    const updated = notifications.filter((n) => n.id !== notificationId);
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
    return {
      success: true,
      data: updated,
    };
  },
};
