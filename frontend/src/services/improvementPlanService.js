// Centralized Improvement Plan Service for Stage 5F

import { MOCK_IMPROVEMENT_PLANS } from '../data/mockImprovementPlans';
import { ROLES } from '../config/roles';
import { storage } from '../utils/storage';

const STORAGE_KEY = 'excel_iqac_improvement_plans';

const getStoredImprovementPlans = () => {
  const data = storage.get(STORAGE_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) {
    storage.set(STORAGE_KEY, MOCK_IMPROVEMENT_PLANS);
    return MOCK_IMPROVEMENT_PLANS;
  }
  return data;
};

const SIMULATED_LATENCY_MS = 150;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const improvementPlanService = {
  getAccessiblePlans: (user, list = null) => {
    if (!user) return [];
    const plans = list || getStoredImprovementPlans();
    const role = user.role;

    if (
      role === ROLES.TECHNICAL_DIRECTOR ||
      role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
      role === ROLES.INSTITUTION_ADMIN ||
      role === ROLES.IQAC_HEAD
    ) {
      return plans;
    }

    if (role === ROLES.DEAN) {
      const assignedCodes = user.assignedDepartments || ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
      return plans.filter((ip) => assignedCodes.includes(ip.departmentCode));
    }

    if (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) {
      const userDeptCode = user.departmentCode || 'CSE';
      return plans.filter((ip) => ip.departmentCode === userDeptCode);
    }

    if (role === ROLES.STAFF) {
      return plans.filter((ip) => ip.departmentCode === user.departmentCode || ip.ownerId === user.email);
    }

    return plans;
  },

  getImprovementPlans: async (filters = {}, user) => {
    await delay();
    const accessible = improvementPlanService.getAccessiblePlans(user);
    const { searchQuery, statusFilter, deptFilter } = filters;

    let result = accessible;

    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((ip) => ip.status === statusFilter);
    }

    if (deptFilter && deptFilter !== 'ALL') {
      result = result.filter((ip) => ip.departmentCode === deptFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (ip) =>
          ip.planId.toLowerCase().includes(q) ||
          ip.title.toLowerCase().includes(q) ||
          ip.ownerName.toLowerCase().includes(q)
      );
    }

    const stats = {
      total: accessible.length,
      onTrack: accessible.filter((ip) => ip.status === 'ON_TRACK').length,
      atRisk: accessible.filter((ip) => ip.status === 'AT_RISK').length,
      overdue: accessible.filter((ip) => ip.status === 'OVERDUE').length,
      completed: accessible.filter((ip) => ip.status === 'COMPLETED').length,
    };

    return { success: true, data: result, stats };
  },

  getImprovementPlanById: async (id, user) => {
    await delay();
    const accessible = improvementPlanService.getAccessiblePlans(user);
    const item = accessible.find((ip) => ip.id === id || ip.planId === id);
    if (!item) throw new Error('Improvement plan not found.');
    return { success: true, data: item };
  },

  createImprovementPlan: async (payload, user) => {
    await delay();
    if (!payload.title || !payload.title.trim()) throw new Error('Plan title is required.');
    if (!payload.departmentCode) throw new Error('Department selection is required.');

    const list = getStoredImprovementPlans();
    const pNum = String(list.length + 1).padStart(3, '0');
    const planId = `IP-${pNum}`;
    const timestamp = new Date().toLocaleString();

    const newPlan = {
      id: `IP-2026-00${list.length + 101}`,
      planId,
      title: payload.title,
      departmentCode: payload.departmentCode,
      departmentName: payload.departmentName || 'Department',
      indicatorId: payload.indicatorId || 'FACULTY_QUALIFICATION_RATE',
      indicatorName: payload.indicatorName || 'Faculty Qualification',
      problemStatement: payload.problemStatement || '',
      target: payload.target || 90,
      currentValue: payload.currentValue || 50,
      ownerId: user?.email || 'owner@iqac.demo',
      ownerName: `${user?.name} (${user?.role.replace(/_/g, ' ')})`,
      startDate: payload.startDate || '2026-09-15',
      targetDate: payload.targetDate || '2026-10-31',
      progress: 0,
      status: 'ON_TRACK',
      actionItemIds: payload.actionItemIds || [],
      evidenceIds: [],
      createdBy: user?.name,
      createdAt: timestamp,
      history: [{ id: `iph_${Date.now()}`, action: 'CREATED', actorName: user?.name, timestamp, comment: 'Plan launched.' }],
    };

    const updated = [newPlan, ...list];
    storage.set(STORAGE_KEY, updated);

    return { success: true, message: 'Improvement plan created successfully.', data: newPlan };
  },

  updatePlanProgress: async (id, progressVal, user, comment = '') => {
    await delay();
    const list = getStoredImprovementPlans();
    const index = list.findIndex((ip) => ip.id === id || ip.planId === id);
    if (index === -1) throw new Error('Improvement plan not found.');

    const plan = list[index];
    const timestamp = new Date().toLocaleString();
    const isDone = progressVal >= 100;
    const newStatus = isDone ? 'COMPLETED' : plan.status;

    const historyItem = {
      id: `iph_${Date.now()}`,
      action: isDone ? 'COMPLETED' : 'PROGRESS_UPDATED',
      actorName: user?.name,
      timestamp,
      comment: comment || `Progress updated to ${progressVal}%.`,
    };

    const updatedPlan = {
      ...plan,
      progress: progressVal,
      status: newStatus,
      history: [historyItem, ...(plan.history || [])],
    };

    list[index] = updatedPlan;
    storage.set(STORAGE_KEY, list);

    return { success: true, message: `Progress updated to ${progressVal}%.`, data: updatedPlan };
  },
};
