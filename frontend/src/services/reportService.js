import { REPORT_TEMPLATES, INITIAL_GENERATED_REPORTS } from '../data/reports';
import { getItem, setItem, STORAGE_KEYS } from './localStorageHelper';
import { mockResponse } from './api';

export const reportService = {
  async getTemplates() {
    return mockResponse(REPORT_TEMPLATES);
  },

  async getGeneratedReports() {
    const list = getItem(STORAGE_KEYS.REPORTS) || INITIAL_GENERATED_REPORTS;
    return mockResponse(list);
  },

  async generateReport(templateId, options = {}, currentUser = {}) {
    const template = REPORT_TEMPLATES.find((t) => t.id === templateId) || {
      title: 'Custom Institutional Quality Report',
    };

    const newReport = {
      id: `gen_rep_${Date.now()}`,
      title: `${template.title} - ${options.department || 'Consolidated'}`,
      academicYear: options.academicYear || '2026 - 2027',
      department: options.department || currentUser.departmentName || 'All Departments',
      generatedBy: currentUser.name || 'IQAC Officer',
      generatedAt: new Date().toLocaleString(),
      status: 'READY',
      fileSize: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      format: options.format || 'PDF',
      summaryStats: {
        totalRecords: Math.floor(Math.random() * 80 + 20),
        verifiedPercentage: '94.6%',
        accreditationScore: '3.62 / 4.00 (Grade A++)',
      },
    };

    const list = getItem(STORAGE_KEYS.REPORTS) || [];
    setItem(STORAGE_KEYS.REPORTS, [newReport, ...list]);

    return mockResponse(newReport, 400); // slight delay to show report generation spinner
  },
};

export const notificationService = {
  async getNotifications(role = null) {
    let list = getItem(STORAGE_KEYS.NOTIFICATIONS) || [];
    if (role) {
      list = list.filter(
        (n) => !n.recipientRoles || n.recipientRoles.includes(role)
      );
    }
    return mockResponse(list);
  },

  async markAsRead(id) {
    const list = getItem(STORAGE_KEYS.NOTIFICATIONS) || [];
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    return mockResponse(updated);
  },

  async markAllAsRead() {
    const list = getItem(STORAGE_KEYS.NOTIFICATIONS) || [];
    const updated = list.map((n) => ({ ...n, read: true }));
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    return mockResponse(updated);
  },

  async addNotification(notif) {
    const list = getItem(STORAGE_KEYS.NOTIFICATIONS) || [];
    const newNotif = {
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false,
      ...notif,
    };
    setItem(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...list]);
    return mockResponse(newNotif);
  },
};
