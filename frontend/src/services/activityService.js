// Centralized IQAC Activity Management Service (Stage 5E)

import { MOCK_ACTIVITIES } from '../data/mockActivities';
import { ACTIVITY_STATUS, ACTIVITY_CATEGORIES, ACTIVITY_CATEGORY_LABELS } from '../config/activityConfig';
import { ROLES } from '../config/roles';
import { storage } from '../utils/storage';

const STORAGE_KEY = 'iqac_activities_v1';

const getStoredActivities = () => {
  const data = storage.get(STORAGE_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) {
    storage.set(STORAGE_KEY, MOCK_ACTIVITIES);
    return MOCK_ACTIVITIES;
  }
  return data;
};

const SIMULATED_LATENCY_MS = 150;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const activityService = {
  /**
   * Scope filter for activities
   */
  getAccessibleActivities: (user, activitiesList = null) => {
    if (!user) return [];
    const list = activitiesList || getStoredActivities();
    const role = user.role;

    const isApexOrHead =
      role === ROLES.TECHNICAL_DIRECTOR ||
      role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
      role === ROLES.INSTITUTION_ADMIN ||
      role === ROLES.IQAC_HEAD;

    if (isApexOrHead) return list;

    if (role === ROLES.DEAN) {
      const assignedCodes = user.assignedDepartments || ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
      return list.filter((act) => act.departmentCode === 'INSTITUTION' || assignedCodes.includes(act.departmentCode));
    }

    if (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) {
      const userDeptCode = user.departmentCode || 'CSE';
      return list.filter((act) => act.departmentCode === 'INSTITUTION' || act.departmentCode === userDeptCode);
    }

    if (role === ROLES.STAFF) {
      return list.filter((act) => act.departmentCode === user.departmentCode || act.ownerId === user.id);
    }

    return list;
  },

  getActivities: async (filters = {}, user) => {
    await delay();
    const accessible = activityService.getAccessibleActivities(user);
    const { searchQuery, statusFilter, categoryFilter, deptFilter } = filters;

    let result = accessible;

    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((act) => act.status === statusFilter);
    }

    if (categoryFilter && categoryFilter !== 'ALL') {
      result = result.filter((act) => act.category === categoryFilter);
    }

    if (deptFilter && deptFilter !== 'ALL') {
      result = result.filter((act) => act.departmentCode === deptFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (act) =>
          act.activityId.toLowerCase().includes(q) ||
          act.title.toLowerCase().includes(q) ||
          act.ownerName.toLowerCase().includes(q)
      );
    }

    const stats = {
      total: accessible.length,
      planned: accessible.filter((act) => act.status === ACTIVITY_STATUS.PLANNED).length,
      inProgress: accessible.filter((act) => act.status === ACTIVITY_STATUS.IN_PROGRESS).length,
      completed: accessible.filter((act) => act.status === ACTIVITY_STATUS.COMPLETED).length,
      overdue: accessible.filter((act) => act.status === ACTIVITY_STATUS.OVERDUE).length,
    };

    return { success: true, data: result, stats };
  },

  getActivityById: async (id, user) => {
    await delay();
    const accessible = activityService.getAccessibleActivities(user);
    const item = accessible.find((act) => act.id === id || act.activityId === id);
    if (!item) throw new Error('Activity record not found or access denied.');
    return { success: true, data: item };
  },

  createActivity: async (payload, user) => {
    await delay();
    if (!payload.title || !payload.title.trim()) {
      throw new Error('Activity title is required.');
    }
    if (!payload.category) {
      throw new Error('Activity category is required.');
    }

    const list = getStoredActivities();
    const actNum = String(list.length + 101).padStart(5, '0');
    const activityId = `ACT-2026-${actNum}`;
    const timestamp = new Date().toLocaleString();

    const newActivity = {
      id: `actv_${Date.now()}`,
      activityId,
      title: payload.title,
      category: payload.category,
      categoryLabel: ACTIVITY_CATEGORY_LABELS[payload.category] || 'IQAC Activity',
      description: payload.description || '',
      departmentCode: payload.departmentCode || user?.departmentCode || 'CSE',
      departmentName: payload.departmentName || 'Computer Science & Engineering',
      coordinatorId: user?.id || 'user_coord_cse',
      coordinatorName: user?.name || 'Prof. Priya Nair',
      ownerId: user?.id,
      ownerName: `${user?.name} (${user?.role.replace(/_/g, ' ')})`,
      startDate: payload.startDate || '2026-09-15',
      endDate: payload.endDate || '2026-10-30',
      status: ACTIVITY_STATUS.PLANNED,
      progress: 0,
      priority: payload.priority || 'NORMAL',
      objectives: payload.objectives || ['Ensure institutional quality compliance.'],
      outcomes: [],
      participantCount: payload.participantCount || 30,
      meetingIds: [],
      submissionIds: [],
      evidenceIds: [],
      createdAt: timestamp,
      updatedAt: timestamp,
      history: [
        {
          id: `ach_${Date.now()}`,
          action: 'CREATED',
          actorName: user?.name,
          timestamp,
          comment: 'Created new IQAC activity initiative.',
        },
      ],
    };

    const updated = [newActivity, ...list];
    storage.set(STORAGE_KEY, updated);

    return { success: true, message: 'IQAC Activity initiative created.', data: newActivity };
  },

  updateActivityProgress: async (id, progressVal, user, comment = '') => {
    await delay();
    const list = getStoredActivities();
    const index = list.findIndex((act) => act.id === id || act.activityId === id);
    if (index === -1) throw new Error('Activity record not found.');

    const act = list[index];
    const timestamp = new Date().toLocaleString();
    const isDone = progressVal >= 100;
    const newStatus = isDone ? ACTIVITY_STATUS.COMPLETED : ACTIVITY_STATUS.IN_PROGRESS;

    const historyItem = {
      id: `ach_${Date.now()}`,
      action: isDone ? 'COMPLETED' : 'PROGRESS_UPDATED',
      actorName: user?.name,
      timestamp,
      comment: comment || `Progress updated to ${progressVal}%.`,
    };

    const updatedAct = {
      ...act,
      progress: progressVal,
      status: newStatus,
      updatedAt: timestamp,
      history: [historyItem, ...(act.history || [])],
    };

    list[index] = updatedAct;
    storage.set(STORAGE_KEY, list);

    return { success: true, message: `Activity progress updated to ${progressVal}%.`, data: updatedAct };
  },
};
