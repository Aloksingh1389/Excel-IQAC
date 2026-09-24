// Service for IQAC Management & Role-Aware Data Filtering (Stage 5A & 5B)

import {
  MOCK_DEPARTMENTS,
  MOCK_COORDINATORS,
  MOCK_FACULTY_CANDIDATES,
  MOCK_ASSIGNMENT_HISTORY,
  MOCK_COORDINATOR_ACTIVITIES,
  MOCK_COORDINATOR_NOTIFICATIONS,
  MOCK_STAFF_MONITORING,
  MOCK_ATTENTION_ITEMS,
  MOCK_RECENT_ACTIVITIES,
  MOCK_INSTITUTION_IQAC_STATS,
} from '../data/mockIQAC';
import { ROLES } from '../config/roles';
import { storage } from '../utils/storage';

const STORAGE_KEYS = {
  COORDINATORS: 'iqac_coordinators_v1',
  DEPARTMENTS: 'iqac_departments_v1',
  HISTORY: 'iqac_assignment_history_v1',
  ACTIVITIES: 'iqac_activities_v1',
  NOTIFICATIONS: 'iqac_notifications_v1',
  AUDIT_LOGS: 'iqac_audit_logs_v1',
};

// Initialize localStorage fallback state with mock data if not present
const getStoredData = (key, fallback) => {
  const data = storage.get(key);
  if (!data) {
    storage.set(key, fallback);
    return fallback;
  }
  return data;
};

const SIMULATED_LATENCY_MS = 120;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const iqacService = {
  /**
   * Helper utility for determining accessible departments for a user based on Role & Scope
   */
  getAccessibleDepartments: (user) => {
    if (!user) return [];

    const depts = getStoredData(STORAGE_KEYS.DEPARTMENTS, MOCK_DEPARTMENTS);
    const role = user.role;

    const isApexOrHead =
      role === ROLES.TECHNICAL_DIRECTOR ||
      role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
      role === ROLES.INSTITUTION_ADMIN ||
      role === ROLES.IQAC_HEAD;

    if (isApexOrHead) {
      return depts;
    }

    if (role === ROLES.DEAN) {
      const assignedCodes = user.assignedDepartments || ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
      return depts.filter(
        (dept) => assignedCodes.includes(dept.code) || dept.deanId === user.id
      );
    }

    if (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) {
      const deptCode = user.departmentCode || 'CSE';
      const deptId = user.departmentId || 'dept_cse';
      return depts.filter(
        (dept) => dept.id === deptId || dept.code === deptCode
      );
    }

    if (role === ROLES.STAFF) {
      const deptCode = user.departmentCode || 'CSE';
      const deptId = user.departmentId || 'dept_cse';
      return depts.filter(
        (dept) => dept.id === deptId || dept.code === deptCode
      );
    }

    return depts;
  },

  /**
   * Main IQAC Dashboard summary fetcher with full scope calculation
   */
  getIQACDashboard: async (user, academicYear = '2026-27') => {
    await delay();

    const accessibleDepts = iqacService.getAccessibleDepartments(user);
    const accessibleCodes = accessibleDepts.map((d) => d.code);
    const coords = getStoredData(STORAGE_KEYS.COORDINATORS, MOCK_COORDINATORS);

    const totalStaff = accessibleDepts.reduce((acc, d) => acc + d.staffCount, 0);
    const totalSubmissions = accessibleDepts.reduce((acc, d) => acc + (d.completedSubmissions + d.pendingSubmissions), 0);
    const completedSubmissions = accessibleDepts.reduce((acc, d) => acc + d.completedSubmissions, 0);
    const pendingReview = accessibleDepts.reduce((acc, d) => acc + d.pendingSubmissions, 0);
    const verifiedSubmissions = accessibleDepts.reduce((acc, d) => acc + d.verifiedSubmissions, 0);
    const totalEvidence = accessibleDepts.reduce((acc, d) => acc + d.evidenceUploaded, 0);
    const pendingEvidence = accessibleDepts.reduce((acc, d) => acc + d.evidencePending, 0);

    const statistics = {
      academicYear,
      institutionScore: MOCK_INSTITUTION_IQAC_STATS.institutionScore,
      departmentsCount: accessibleDepts.length,
      coordinatorsCount: coords.filter((c) => accessibleCodes.includes(c.departmentCode) && c.status === 'ACTIVE').length,
      totalStaffCount: totalStaff,
      totalSubmissions,
      completedSubmissions,
      pendingReviewCount: pendingReview,
      verifiedSubmissionsCount: verifiedSubmissions,
      totalEvidenceUploaded: totalEvidence,
      pendingEvidenceCount: pendingEvidence,
      departmentsOnTrack: accessibleDepts.filter((d) => d.overallStatus === 'ON_TRACK').length,
      departmentsAttention: accessibleDepts.filter((d) => d.overallStatus === 'ATTENTION_REQUIRED').length,
      departmentsOverdue: accessibleDepts.filter((d) => d.overallStatus === 'OVERDUE').length,
      overallCompletionPercentage: Math.round(
        (completedSubmissions / (totalSubmissions || 1)) * 100
      ),
    };

    return {
      success: true,
      data: {
        statistics,
        departments: accessibleDepts,
        coordinators: coords.filter((c) => accessibleCodes.includes(c.departmentCode)),
        staffMonitoring: MOCK_STAFF_MONITORING.filter((s) => accessibleCodes.includes(s.departmentCode)),
        attentionRequired: MOCK_ATTENTION_ITEMS,
        recentActivities: MOCK_RECENT_ACTIVITIES,
      },
    };
  },

  /**
   * STAGE 5B: Fetch list of coordinators filtered by user role & scope
   */
  getCoordinators: async (user) => {
    await delay();
    const coords = getStoredData(STORAGE_KEYS.COORDINATORS, MOCK_COORDINATORS);
    const accessibleDepts = iqacService.getAccessibleDepartments(user);
    const accessibleCodes = accessibleDepts.map((d) => d.code);

    const filteredCoords = coords.filter((c) => accessibleCodes.includes(c.departmentCode));
    const deptsWithoutCoordinator = accessibleDepts.filter((d) => !d.iqacCoordinatorId);

    const stats = {
      total: coords.length,
      active: coords.filter((c) => c.status === 'ACTIVE').length,
      suspended: coords.filter((c) => c.status === 'SUSPENDED').length,
      deactivated: coords.filter((c) => c.status === 'DEACTIVATED').length,
      pendingAssignment: deptsWithoutCoordinator.length,
      unassignedDepartmentsCount: deptsWithoutCoordinator.length,
    };

    return {
      success: true,
      data: filteredCoords,
      departments: accessibleDepts,
      unassignedDepartments: deptsWithoutCoordinator,
      stats,
    };
  },

  /**
   * STAGE 5B: Fetch single coordinator details with assignment history & activities
   */
  getCoordinatorById: async (id, user) => {
    await delay();
    const coords = getStoredData(STORAGE_KEYS.COORDINATORS, MOCK_COORDINATORS);
    const history = getStoredData(STORAGE_KEYS.HISTORY, MOCK_ASSIGNMENT_HISTORY);
    const activities = getStoredData(STORAGE_KEYS.ACTIVITIES, MOCK_COORDINATOR_ACTIVITIES);
    const depts = getStoredData(STORAGE_KEYS.DEPARTMENTS, MOCK_DEPARTMENTS);

    let coordinator = null;

    if (id === 'me' && user) {
      coordinator = coords.find(
        (c) => c.email === user.email || c.departmentCode === user.departmentCode
      ) || coords[0];
    } else {
      coordinator = coords.find(
        (c) => c.id === id || c.userId === id || c.employeeId === id
      ) || coords[0];
    }

    const dept = depts.find((d) => d.id === coordinator.departmentId || d.code === coordinator.departmentCode);
    const coordHistory = history.filter((h) => h.departmentId === coordinator.departmentId || h.coordinatorId === coordinator.id);
    const coordActivities = activities.filter((a) => a.coordinatorId === coordinator.id || a.departmentCode === coordinator.departmentCode);

    const performance = {
      staffMonitoringPct: 92,
      submissionTrackingPct: 88,
      evidenceCompletionPct: 81,
      notificationResponsePct: 90,
      overallDeptIQACHealthPct: 87,
    };

    return {
      success: true,
      data: {
        coordinator,
        department: dept,
        history: coordHistory,
        activities: coordActivities,
        performance,
      },
    };
  },

  /**
   * STAGE 5B: Get eligible candidate users to assign as new Coordinator
   */
  getEligibleFacultyCandidates: async (departmentId = null) => {
    await delay();
    const coords = getStoredData(STORAGE_KEYS.COORDINATORS, MOCK_COORDINATORS);
    const assignedUserIds = coords.filter((c) => c.status === 'ACTIVE').map((c) => c.userId);

    let candidates = MOCK_FACULTY_CANDIDATES.filter((f) => !assignedUserIds.includes(f.userId));
    if (departmentId) {
      candidates = candidates.filter((f) => f.departmentId === departmentId || f.departmentCode === departmentId);
    }

    return { success: true, data: candidates };
  },

  /**
   * STAGE 5B: Assign a coordinator to an unassigned department
   */
  assignCoordinator: async ({
    departmentId,
    candidate,
    startDate,
    notes,
    actorUser,
  }) => {
    await delay();
    const coords = getStoredData(STORAGE_KEYS.COORDINATORS, MOCK_COORDINATORS);
    const depts = getStoredData(STORAGE_KEYS.DEPARTMENTS, MOCK_DEPARTMENTS);
    const history = getStoredData(STORAGE_KEYS.HISTORY, MOCK_ASSIGNMENT_HISTORY);

    const deptIndex = depts.findIndex((d) => d.id === departmentId || d.code === departmentId);
    if (deptIndex === -1) throw new Error('Department not found.');

    const targetDept = depts[deptIndex];

    // Rule 1: One department can have only one active coordinator
    if (targetDept.iqacCoordinatorId) {
      throw new Error(`Department ${targetDept.name} already has an assigned active coordinator.`);
    }

    // Rule 2: One coordinator can have only one active department assignment
    const alreadyAssigned = coords.find((c) => c.email === candidate.email && c.status === 'ACTIVE');
    if (alreadyAssigned) {
      throw new Error(`Faculty member ${candidate.name} is already assigned to ${alreadyAssigned.departmentName}.`);
    }

    const newCoordId = `coord_${Date.now()}`;
    const newCoordObj = {
      id: newCoordId,
      userId: candidate.userId || newCoordId,
      employeeId: candidate.employeeId || `IQAC-CORD-${targetDept.code}`,
      name: candidate.name,
      designation: candidate.designation || 'Associate Professor',
      email: candidate.email,
      phone: candidate.phone || '+91 98765 00000',
      departmentId: targetDept.id,
      departmentCode: targetDept.code,
      departmentName: targetDept.name,
      assignedDate: startDate || new Date().toISOString().split('T')[0],
      assignedBy: actorUser ? `${actorUser.name} (${actorUser.role})` : 'IQAC Head',
      status: 'ACTIVE',
      lastActivityAt: 'Just now',
    };

    // Update department reference
    depts[deptIndex].iqacCoordinatorId = newCoordId;

    // Create assignment history entry
    const newHistory = {
      id: `hist_${Date.now()}`,
      departmentId: targetDept.id,
      departmentCode: targetDept.code,
      coordinatorId: newCoordId,
      coordinatorName: candidate.name,
      employeeId: newCoordObj.employeeId,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: null,
      assignedBy: actorUser ? `${actorUser.name} (${actorUser.role})` : 'IQAC Head',
      reason: notes || 'New Department Coordinator Assignment',
      status: 'CURRENT',
    };

    const updatedCoords = [newCoordObj, ...coords];
    const updatedHistory = [newHistory, ...history];

    storage.set(STORAGE_KEYS.COORDINATORS, updatedCoords);
    storage.set(STORAGE_KEYS.DEPARTMENTS, depts);
    storage.set(STORAGE_KEYS.HISTORY, updatedHistory);

    // Audit record
    iqacService.logAuditRecord({
      actorId: actorUser?.id,
      actorName: actorUser?.name,
      actorRole: actorUser?.role,
      action: 'ASSIGN_COORDINATOR',
      targetId: newCoordId,
      departmentId: targetDept.id,
      timestamp: new Date().toISOString(),
      reason: notes || 'New Assignment',
    });

    return {
      success: true,
      message: `Successfully assigned ${candidate.name} as IQAC Coordinator for ${targetDept.name}.`,
      data: newCoordObj,
    };
  },

  /**
   * STAGE 5B: Reassign a department coordinator (ends old assignment, starts new)
   */
  reassignCoordinator: async ({
    departmentId,
    oldCoordinatorId,
    newCandidate,
    effectiveDate,
    reason,
    actorUser,
  }) => {
    await delay();
    if (!reason || !reason.trim()) {
      throw new Error('A valid mandatory reason is required for reassignment.');
    }

    const coords = getStoredData(STORAGE_KEYS.COORDINATORS, MOCK_COORDINATORS);
    const depts = getStoredData(STORAGE_KEYS.DEPARTMENTS, MOCK_DEPARTMENTS);
    const history = getStoredData(STORAGE_KEYS.HISTORY, MOCK_ASSIGNMENT_HISTORY);

    const deptIndex = depts.findIndex((d) => d.id === departmentId || d.code === departmentId);
    if (deptIndex === -1) throw new Error('Department not found.');
    const targetDept = depts[deptIndex];

    // End previous assignment in history
    const oldCoordIndex = coords.findIndex((c) => c.id === oldCoordinatorId || c.departmentId === targetDept.id);
    if (oldCoordIndex !== -1) {
      coords[oldCoordIndex].status = 'DEACTIVATED';
    }

    const endDate = effectiveDate || new Date().toISOString().split('T')[0];
    const updatedHistory = history.map((h) => {
      if (h.departmentId === targetDept.id && h.status === 'CURRENT') {
        return {
          ...h,
          endDate,
          status: 'COMPLETED',
          reason: `Reassigned: ${reason}`,
        };
      }
      return h;
    });

    // Create new coordinator record
    const newCoordId = `coord_${Date.now()}`;
    const newCoordObj = {
      id: newCoordId,
      userId: newCandidate.userId || newCoordId,
      employeeId: newCandidate.employeeId || `IQAC-CORD-${targetDept.code}`,
      name: newCandidate.name,
      designation: newCandidate.designation || 'Associate Professor',
      email: newCandidate.email,
      phone: newCandidate.phone || '+91 98765 00000',
      departmentId: targetDept.id,
      departmentCode: targetDept.code,
      departmentName: targetDept.name,
      assignedDate: endDate,
      assignedBy: actorUser ? `${actorUser.name} (${actorUser.role})` : 'IQAC Head',
      status: 'ACTIVE',
      lastActivityAt: 'Just now',
    };

    // Update department reference
    depts[deptIndex].iqacCoordinatorId = newCoordId;

    const newHistItem = {
      id: `hist_${Date.now()}`,
      departmentId: targetDept.id,
      departmentCode: targetDept.code,
      coordinatorId: newCoordId,
      coordinatorName: newCandidate.name,
      employeeId: newCoordObj.employeeId,
      startDate: endDate,
      endDate: null,
      assignedBy: actorUser ? `${actorUser.name} (${actorUser.role})` : 'IQAC Head',
      reason: reason,
      status: 'CURRENT',
    };

    const finalCoords = [newCoordObj, ...coords];
    const finalHistory = [newHistItem, ...updatedHistory];

    storage.set(STORAGE_KEYS.COORDINATORS, finalCoords);
    storage.set(STORAGE_KEYS.DEPARTMENTS, depts);
    storage.set(STORAGE_KEYS.HISTORY, finalHistory);

    // Audit record
    iqacService.logAuditRecord({
      actorId: actorUser?.id,
      actorName: actorUser?.name,
      actorRole: actorUser?.role,
      action: 'REASSIGN_COORDINATOR',
      targetId: newCoordId,
      departmentId: targetDept.id,
      timestamp: new Date().toISOString(),
      reason,
    });

    return {
      success: true,
      message: `Reassigned ${targetDept.name} coordinator to ${newCandidate.name}.`,
      data: newCoordObj,
    };
  },

  /**
   * STAGE 5B: Update Coordinator Status (Activate / Suspend / Deactivate)
   */
  updateCoordinatorStatus: async ({ coordinatorId, status, reason, actorUser }) => {
    await delay();
    if ((status === 'SUSPENDED' || status === 'DEACTIVATED') && (!reason || !reason.trim())) {
      throw new Error(`A mandatory reason is required to ${status.toLowerCase()} a coordinator.`);
    }

    const coords = getStoredData(STORAGE_KEYS.COORDINATORS, MOCK_COORDINATORS);
    const depts = getStoredData(STORAGE_KEYS.DEPARTMENTS, MOCK_DEPARTMENTS);

    const coordIndex = coords.findIndex((c) => c.id === coordinatorId);
    if (coordIndex === -1) throw new Error('Coordinator record not found.');

    const targetCoord = coords[coordIndex];
    coords[coordIndex].status = status;
    coords[coordIndex].statusReason = reason || null;

    if (status === 'DEACTIVATED') {
      const deptIndex = depts.findIndex((d) => d.id === targetCoord.departmentId);
      if (deptIndex !== -1 && depts[deptIndex].iqacCoordinatorId === targetCoord.id) {
        depts[deptIndex].iqacCoordinatorId = null;
      }
    }

    storage.set(STORAGE_KEYS.COORDINATORS, coords);
    storage.set(STORAGE_KEYS.DEPARTMENTS, depts);

    // Audit record
    iqacService.logAuditRecord({
      actorId: actorUser?.id,
      actorName: actorUser?.name,
      actorRole: actorUser?.role,
      action: `STATUS_CHANGE_${status}`,
      targetId: coordinatorId,
      departmentId: targetCoord.departmentId,
      timestamp: new Date().toISOString(),
      reason: reason || 'Status updated',
    });

    return {
      success: true,
      message: `Coordinator status updated to ${status}.`,
      data: coords[coordIndex],
    };
  },

  /**
   * STAGE 5B: Send Notification to Department Staff
   */
  sendCoordinatorNotification: async ({
    senderUser,
    recipientScope,
    selectedStaffIds = [],
    title,
    message,
    priority = 'MEDIUM',
    dueDate,
  }) => {
    await delay();
    if (!title || !title.trim() || !message || !message.trim()) {
      throw new Error('Title and message are required.');
    }

    // Permission Scope Rule: Coordinator can only send to own department staff
    const deptId = senderUser?.departmentId || 'dept_cse';
    const deptCode = senderUser?.departmentCode || 'CSE';

    const notifs = getStoredData(STORAGE_KEYS.NOTIFICATIONS, MOCK_COORDINATOR_NOTIFICATIONS);

    const newNotif = {
      id: `notif_${Date.now()}`,
      senderId: senderUser?.id || 'coord_user',
      senderName: senderUser?.name || 'IQAC Coordinator',
      senderRole: senderUser?.role || 'IQAC_COORDINATOR',
      departmentId: deptId,
      departmentCode: deptCode,
      recipientScope: recipientScope || 'ALL_STAFF',
      recipientCount: selectedStaffIds.length || 12,
      title,
      message,
      priority,
      dueDate: dueDate || null,
      createdAt: new Date().toLocaleString(),
      respondedCount: 0,
      status: 'SENT',
    };

    const updated = [newNotif, ...notifs];
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);

    // Audit record
    iqacService.logAuditRecord({
      actorId: senderUser?.id,
      actorName: senderUser?.name,
      actorRole: senderUser?.role,
      action: 'SEND_NOTIFICATION',
      targetId: newNotif.id,
      departmentId: deptId,
      timestamp: new Date().toISOString(),
      reason: title,
    });

    return {
      success: true,
      message: 'Notification broadcasted successfully.',
      data: newNotif,
    };
  },

  /**
   * STAGE 5B: Fetch sent notifications history
   */
  getNotificationHistory: async (user) => {
    await delay();
    const notifs = getStoredData(STORAGE_KEYS.NOTIFICATIONS, MOCK_COORDINATOR_NOTIFICATIONS);
    const accessibleDepts = iqacService.getAccessibleDepartments(user);
    const accessibleCodes = accessibleDepts.map((d) => d.code);

    const filtered = notifs.filter((n) => accessibleCodes.includes(n.departmentCode) || user?.role === ROLES.IQAC_HEAD || user?.role === ROLES.TECHNICAL_DIRECTOR);

    return { success: true, data: filtered };
  },

  /**
   * Log action into audit storage
   */
  logAuditRecord: (record) => {
    const logs = storage.get(STORAGE_KEYS.AUDIT_LOGS) || [];
    logs.unshift(record);
    storage.set(STORAGE_KEYS.AUDIT_LOGS, logs);
  },

  getAuditLogs: async () => {
    await delay();
    const logs = storage.get(STORAGE_KEYS.AUDIT_LOGS) || [];
    return { success: true, data: logs };
  },
};
