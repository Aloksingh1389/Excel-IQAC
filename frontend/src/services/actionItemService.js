// Centralized Action Items Management Service (Stage 5E)

import { MOCK_ACTION_ITEMS } from '../data/mockActionItems';
import { ACTION_STATUS } from '../config/activityConfig';
import { ROLES } from '../config/roles';
import { storage } from '../utils/storage';
import { iqacService } from './iqacService';

const STORAGE_KEY = 'iqac_action_items_v1';

const getStoredActionItems = () => {
  const data = storage.get(STORAGE_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) {
    storage.set(STORAGE_KEY, MOCK_ACTION_ITEMS);
    return MOCK_ACTION_ITEMS;
  }
  return data;
};

const SIMULATED_LATENCY_MS = 150;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const actionItemService = {
  /**
   * Filter action items by user role & scope (Section 34 requirement)
   */
  getAccessibleActionItems: (user, actionItemsList = null) => {
    if (!user) return [];
    const list = actionItemsList || getStoredActionItems();
    const role = user.role;

    const isApexOrHead =
      role === ROLES.TECHNICAL_DIRECTOR ||
      role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
      role === ROLES.INSTITUTION_ADMIN ||
      role === ROLES.IQAC_HEAD;

    if (isApexOrHead) return list;

    if (role === ROLES.DEAN) {
      const assignedCodes = user.assignedDepartments || ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
      return list.filter((ai) => assignedCodes.includes(ai.departmentCode));
    }

    if (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) {
      const userDeptCode = user.departmentCode || 'CSE';
      return list.filter((ai) => ai.departmentCode === userDeptCode);
    }

    if (role === ROLES.STAFF) {
      // Staff sees ONLY action items assigned to them
      return list.filter(
        (ai) =>
          ai.assignedToEmail === user.email ||
          ai.assignedTo === user.name ||
          ai.assignedToId === user.id
      );
    }

    return list;
  },

  getActionItems: async (filters = {}, user) => {
    await delay();
    const accessible = actionItemService.getAccessibleActionItems(user);
    const { searchQuery, statusFilter, priorityFilter, deptFilter } = filters;

    const todayStr = new Date().toISOString().split('T')[0];

    // Compute dynamic overdue status
    let processed = accessible.map((ai) => {
      let isOverdue = false;
      if (ai.status !== ACTION_STATUS.COMPLETED && ai.status !== ACTION_STATUS.CANCELLED) {
        if (ai.dueDate && ai.dueDate < todayStr) {
          isOverdue = true;
        }
      }
      return {
        ...ai,
        status: isOverdue ? ACTION_STATUS.OVERDUE : ai.status,
      };
    });

    if (statusFilter && statusFilter !== 'ALL') {
      processed = processed.filter((ai) => ai.status === statusFilter);
    }

    if (priorityFilter && priorityFilter !== 'ALL') {
      processed = processed.filter((ai) => ai.priority === priorityFilter);
    }

    if (deptFilter && deptFilter !== 'ALL') {
      processed = processed.filter((ai) => ai.departmentCode === deptFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      processed = processed.filter(
        (ai) =>
          ai.actionItemId.toLowerCase().includes(q) ||
          ai.title.toLowerCase().includes(q) ||
          ai.assignedTo.toLowerCase().includes(q) ||
          (ai.meetingTitle && ai.meetingTitle.toLowerCase().includes(q))
      );
    }

    const stats = {
      total: accessible.length,
      open: processed.filter((ai) => ai.status === ACTION_STATUS.OPEN).length,
      inProgress: processed.filter((ai) => ai.status === ACTION_STATUS.IN_PROGRESS).length,
      completed: processed.filter((ai) => ai.status === ACTION_STATUS.COMPLETED).length,
      overdue: processed.filter((ai) => ai.status === ACTION_STATUS.OVERDUE).length,
    };

    return { success: true, data: processed, stats };
  },

  getActionItemById: async (id, user) => {
    await delay();
    const accessible = actionItemService.getAccessibleActionItems(user);
    const item = accessible.find((ai) => ai.id === id || ai.actionItemId === id);
    if (!item) throw new Error('Action item not found or access denied.');
    return { success: true, data: item };
  },

  createActionItem: async (payload, user) => {
    await delay();
    if (!payload.title || !payload.title.trim()) {
      throw new Error('Action item title is required.');
    }
    if (!payload.assignedTo) {
      throw new Error('Responsible person assignment is required.');
    }

    const list = getStoredActionItems();
    const aiNum = String(list.length + 101).padStart(5, '0');
    const actionItemId = `AI-2026-${aiNum}`;
    const timestamp = new Date().toLocaleString();

    const newAI = {
      id: `act_${Date.now()}`,
      actionItemId,
      meetingId: payload.meetingId || null,
      meetingTitle: payload.meetingTitle || null,
      resolutionId: payload.resolutionId || null,
      resolutionTitle: payload.resolutionTitle || null,
      title: payload.title,
      description: payload.description || '',
      assignedTo: payload.assignedTo,
      assignedToEmail: payload.assignedToEmail || 'assigned@iqac.demo',
      assignedToRole: payload.assignedToRole || 'STAFF',
      departmentCode: payload.departmentCode || user?.departmentCode || 'CSE',
      departmentName: payload.departmentName || 'Computer Science & Engineering',
      priority: payload.priority || 'NORMAL',
      dueDate: payload.dueDate || '2026-09-30',
      status: ACTION_STATUS.OPEN,
      progress: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: null,
      evidenceIds: payload.evidenceIds || [],
      history: [
        {
          id: `aih_${Date.now()}`,
          action: 'CREATED',
          actorName: user?.name,
          timestamp,
          comment: payload.meetingId ? `Created from Meeting ${payload.meetingId}.` : 'Action item created.',
        },
      ],
    };

    const updated = [newAI, ...list];
    storage.set(STORAGE_KEY, updated);

    // Notify assigned owner
    iqacService.sendCoordinatorNotification({
      senderUser: user,
      recipientScope: 'SUBMITTER',
      title: `New Action Item Assigned: ${actionItemId}`,
      message: `You have been assigned action item "${newAI.title}" due on ${newAI.dueDate}.`,
      priority: newAI.priority,
    });

    return { success: true, message: 'Action item created & assigned.', data: newAI };
  },

  updateActionProgress: async (id, progressVal, user, comment = '') => {
    await delay();
    const list = getStoredActionItems();
    const index = list.findIndex((ai) => ai.id === id || ai.actionItemId === id);
    if (index === -1) throw new Error('Action item not found.');

    const ai = list[index];
    const timestamp = new Date().toLocaleString();
    const isFinished = progressVal >= 100;
    const newStatus = isFinished ? ACTION_STATUS.COMPLETED : ACTION_STATUS.IN_PROGRESS;

    const historyItem = {
      id: `aih_${Date.now()}`,
      action: isFinished ? 'COMPLETED' : 'PROGRESS_UPDATED',
      actorName: user?.name,
      timestamp,
      comment: comment || `Progress updated to ${progressVal}%.`,
    };

    const updatedAI = {
      ...ai,
      progress: progressVal,
      status: newStatus,
      updatedAt: timestamp,
      completedAt: isFinished ? timestamp : ai.completedAt,
      history: [historyItem, ...(ai.history || [])],
    };

    list[index] = updatedAI;
    storage.set(STORAGE_KEY, list);

    return { success: true, message: `Progress updated to ${progressVal}%.`, data: updatedAI };
  },
};
