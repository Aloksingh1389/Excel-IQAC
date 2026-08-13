import { getItem, setItem, STORAGE_KEYS } from './localStorageHelper';
import { mockResponse, mockError } from './api';

export const approvalService = {
  async getApprovals(filters = {}) {
    let list = getItem(STORAGE_KEYS.APPROVALS) || [];
    if (filters.approvalLevel) list = list.filter((a) => a.approvalLevel === filters.approvalLevel);
    if (filters.status) list = list.filter((a) => a.status === filters.status);
    if (filters.type) list = list.filter((a) => a.type === filters.type);
    if (filters.departmentId) list = list.filter((a) => a.departmentId === filters.departmentId);
    return mockResponse(list);
  },

  async approveItem(approvalId, reviewerName = 'HOD', comments = '') {
    const approvals = getItem(STORAGE_KEYS.APPROVALS) || [];
    const item = approvals.find((a) => a.id === approvalId);
    if (!item) return mockError('Approval request not found', 404);

    item.status = 'APPROVED';
    item.approvedBy = reviewerName;
    item.approvedAt = new Date().toISOString().split('T')[0];
    item.remarks = comments;

    setItem(STORAGE_KEYS.APPROVALS, approvals);

    // Synchronize underlying entity
    this._syncTargetEntity(item.type, item.targetId, 'APPROVED', { approvedBy: reviewerName, approvedAt: item.approvedAt });

    // Add notification
    this._notifySubmitter(item, 'APPROVED', `Your submission "${item.title}" has been APPROVED by ${reviewerName}.`);

    return mockResponse(item);
  },

  async rejectItem(approvalId, reviewerName = 'HOD', reason = 'Does not meet institutional standards') {
    const approvals = getItem(STORAGE_KEYS.APPROVALS) || [];
    const item = approvals.find((a) => a.id === approvalId);
    if (!item) return mockError('Approval request not found', 404);

    item.status = 'REJECTED';
    item.rejectedBy = reviewerName;
    item.rejectedAt = new Date().toISOString().split('T')[0];
    item.remarks = reason;

    setItem(STORAGE_KEYS.APPROVALS, approvals);

    this._syncTargetEntity(item.type, item.targetId, 'REJECTED', { rejectionReason: reason });

    this._notifySubmitter(item, 'REJECTED', `Submission "${item.title}" was REJECTED. Reason: ${reason}`);

    return mockResponse(item);
  },

  async requestCorrection(approvalId, reviewerName = 'HOD', notes = '') {
    const approvals = getItem(STORAGE_KEYS.APPROVALS) || [];
    const item = approvals.find((a) => a.id === approvalId);
    if (!item) return mockError('Approval request not found', 404);

    item.status = 'CORRECTION_REQUIRED';
    item.remarks = notes;

    setItem(STORAGE_KEYS.APPROVALS, approvals);

    this._syncTargetEntity(item.type, item.targetId, 'CORRECTION_REQUIRED', { correctionNotes: notes });

    this._notifySubmitter(item, 'CORRECTION', `Action required: Please update "${item.title}". Note: ${notes}`);

    return mockResponse(item);
  },

  _syncTargetEntity(type, targetId, status, extraFields = {}) {
    if (type === 'PUBLICATION') {
      const pubs = getItem(STORAGE_KEYS.PUBLICATIONS) || [];
      setItem(STORAGE_KEYS.PUBLICATIONS, pubs.map((p) => (p.id === targetId ? { ...p, status, ...extraFields } : p)));
    } else if (type === 'RESEARCH') {
      const res = getItem(STORAGE_KEYS.RESEARCH) || [];
      setItem(STORAGE_KEYS.RESEARCH, res.map((r) => (r.id === targetId ? { ...r, approvalStatus: status, ...extraFields } : r)));
    } else if (type === 'FDP') {
      const fdps = getItem(STORAGE_KEYS.FDPS) || [];
      setItem(STORAGE_KEYS.FDPS, fdps.map((f) => (f.id === targetId ? { ...f, status, ...extraFields } : f)));
    } else if (type === 'ACHIEVEMENT') {
      const ach = getItem(STORAGE_KEYS.ACHIEVEMENTS) || [];
      setItem(STORAGE_KEYS.ACHIEVEMENTS, ach.map((a) => (a.id === targetId ? { ...a, status, ...extraFields } : a)));
    } else if (type === 'STAFF_ACCOUNT') {
      const fac = getItem(STORAGE_KEYS.FACULTY) || [];
      setItem(STORAGE_KEYS.FACULTY, fac.map((f) => (f.id === targetId ? { ...f, status, ...extraFields } : f)));
    }
  },

  _notifySubmitter(item, type, message) {
    const notifs = getItem(STORAGE_KEYS.NOTIFICATIONS) || [];
    const newNotif = {
      id: `notif_${Date.now()}`,
      title: `Submission Update: ${item.type}`,
      message,
      timestamp: 'Just now',
      type,
      read: false,
      link: '/dashboard',
      recipientRoles: [item.submitterRole || 'STAFF'],
    };
    setItem(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);
  },
};
