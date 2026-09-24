// Centralized Submissions Service for Stage 5C Workflow Architecture

import { MOCK_SUBMISSIONS } from '../data/mockSubmissions';
import { SUBMISSION_STATUS } from '../config/submissionStatuses';
import { SUBMISSION_TYPES, SUBMISSION_TYPE_LABELS } from '../config/submissionTypes';
import { ROLES } from '../config/roles';
import { storage } from '../utils/storage';
import { workflowService } from './workflowService';
import { iqacService } from './iqacService';

const STORAGE_KEY = 'iqac_submissions_v1';

const getStoredSubmissions = () => {
  const data = storage.get(STORAGE_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) {
    storage.set(STORAGE_KEY, MOCK_SUBMISSIONS);
    return MOCK_SUBMISSIONS;
  }
  return data;
};

const SIMULATED_LATENCY_MS = 150;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const submissionService = {
  /**
   * Centralized utility for filtering submissions by user role & department scope
   * Section 47 requirement
   */
  getAccessibleSubmissions: (user, submissionsList = null) => {
    if (!user) return [];
    const list = submissionsList || getStoredSubmissions();
    const role = user.role;

    const isApexOrHead =
      role === ROLES.TECHNICAL_DIRECTOR ||
      role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
      role === ROLES.INSTITUTION_ADMIN ||
      role === ROLES.IQAC_HEAD;

    if (isApexOrHead) {
      return list;
    }

    if (role === ROLES.DEAN) {
      const assignedCodes = user.assignedDepartments || ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
      return list.filter((sub) => assignedCodes.includes(sub.departmentCode));
    }

    if (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) {
      const userDeptCode = user.departmentCode || 'CSE';
      return list.filter((sub) => sub.departmentCode === userDeptCode || sub.departmentId === user.departmentId);
    }

    if (role === ROLES.STAFF) {
      // Staff sees ONLY own submissions
      return list.filter(
        (sub) =>
          sub.submittedByEmail === user.email ||
          sub.submittedById === user.id ||
          sub.submittedBy === user.name
      );
    }

    return list;
  },

  /**
   * Fetch submissions list with comprehensive filters & search
   */
  getSubmissions: async (filters = {}, user) => {
    await delay();

    const accessible = submissionService.getAccessibleSubmissions(user);
    const { searchQuery, statusFilter, typeFilter, deptFilter, academicYear } = filters;

    let result = accessible;

    if (academicYear && academicYear !== 'ALL') {
      result = result.filter((s) => s.academicYear === academicYear);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((s) => s.status === statusFilter);
    }

    if (typeFilter && typeFilter !== 'ALL') {
      result = result.filter((s) => s.type === typeFilter);
    }

    if (deptFilter && deptFilter !== 'ALL') {
      result = result.filter((s) => s.departmentCode === deptFilter || s.departmentId === deptFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.submissionId.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.submittedBy.toLowerCase().includes(q) ||
          s.departmentCode.toLowerCase().includes(q)
      );
    }

    // Statistics calculations from accessible dataset
    const stats = {
      total: accessible.length,
      draft: accessible.filter((s) => s.status === SUBMISSION_STATUS.DRAFT).length,
      pendingReview: accessible.filter((s) => s.status === SUBMISSION_STATUS.SUBMITTED || s.status === SUBMISSION_STATUS.UNDER_REVIEW || s.status === SUBMISSION_STATUS.RESUBMITTED).length,
      returned: accessible.filter((s) => s.status === SUBMISSION_STATUS.RETURNED).length,
      approved: accessible.filter((s) => s.status === SUBMISSION_STATUS.APPROVED).length,
      rejected: accessible.filter((s) => s.status === SUBMISSION_STATUS.REJECTED).length,
      verified: accessible.filter((s) => s.status === SUBMISSION_STATUS.VERIFIED).length,
    };

    return {
      success: true,
      data: result,
      stats,
    };
  },

  /**
   * Fetch single submission details
   */
  getSubmissionById: async (id, user) => {
    await delay();
    const accessible = submissionService.getAccessibleSubmissions(user);
    const submission = accessible.find((s) => s.id === id || s.submissionId === id);

    if (!submission) {
      throw new Error('Submission not found or access denied for your user role scope.');
    }

    return {
      success: true,
      data: submission,
    };
  },

  /**
   * Operational Review Center queue fetcher (Section 17 requirement)
   */
  getPendingReviews: async (user) => {
    await delay();
    const accessible = submissionService.getAccessibleSubmissions(user);
    const role = user.role;

    // Filter items requiring review by user role
    const pendingQueue = accessible.filter((s) => {
      if (s.status === SUBMISSION_STATUS.DRAFT || s.status === SUBMISSION_STATUS.VERIFIED || s.status === SUBMISSION_STATUS.REJECTED) {
        return false;
      }
      if (role === ROLES.TECHNICAL_DIRECTOR || role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL || role === ROLES.IQAC_HEAD) {
        return true;
      }
      return s.currentReviewerRole === role || s.status === SUBMISSION_STATUS.SUBMITTED || s.status === SUBMISSION_STATUS.RESUBMITTED;
    });

    const stats = {
      pendingMyReview: pendingQueue.length,
      highPriority: pendingQueue.filter((s) => s.priority === 'HIGH' || s.priority === 'URGENT').length,
      overdue: pendingQueue.filter((s) => s.dueStatus === 'OVERDUE').length,
    };

    return {
      success: true,
      data: pendingQueue,
      stats,
    };
  },

  /**
   * Create a new draft or direct submission
   */
  createSubmission: async (payload, user) => {
    await delay();
    if (!payload.title || !payload.title.trim()) {
      throw new Error('Submission title is required.');
    }

    const list = getStoredSubmissions();
    const isDirectSubmit = payload.isSubmit === true;
    const subNumber = String(list.length + 101).padStart(5, '0');
    const submissionId = `SUB-2026-${subNumber}`;

    const deptCode = user?.departmentCode || payload.departmentCode || 'CSE';
    const deptId = user?.departmentId || payload.departmentId || 'dept_cse';
    const deptName = user?.department || payload.departmentName || 'Computer Science & Engineering';

    const timestamp = new Date().toLocaleString();

    const newSub = {
      id: `sub_${Date.now()}`,
      submissionId,
      type: payload.type || SUBMISSION_TYPES.PUBLICATION,
      typeLabel: SUBMISSION_TYPE_LABELS[payload.type] || 'Institutional Submission',
      title: payload.title,
      submittedBy: user?.name || 'Faculty Member',
      submittedByEmail: user?.email || 'staff@iqac.demo',
      submittedByRole: user?.role || ROLES.STAFF,
      departmentId: deptId,
      departmentCode: deptCode,
      departmentName: deptName,
      status: isDirectSubmit ? SUBMISSION_STATUS.SUBMITTED : SUBMISSION_STATUS.DRAFT,
      currentReviewerRole: isDirectSubmit ? ROLES.IQAC_COORDINATOR : ROLES.STAFF,
      currentReviewerName: isDirectSubmit ? `Department IQAC Coordinator` : user?.name,
      priority: payload.priority || 'NORMAL',
      academicYear: payload.academicYear || '2026-27',
      createdAt: timestamp,
      submittedAt: isDirectSubmit ? timestamp : null,
      lastUpdatedAt: timestamp,
      approvedAt: null,
      approvedBy: null,
      verifiedAt: null,
      verifiedBy: null,
      returnReason: null,
      rejectionReason: null,
      reviewDueDate: payload.dueDate || '2026-09-25',
      dueStatus: 'ON_TIME',
      data: payload.data || { description: payload.description || '' },
      evidenceFiles: payload.evidenceFiles || [],
      history: [
        {
          id: `h_${Date.now()}`,
          action: isDirectSubmit ? 'SUBMITTED' : 'DRAFT_SAVED',
          actorId: user?.id,
          actorName: user?.name,
          actorRole: user?.role,
          timestamp,
          comment: isDirectSubmit ? 'Created & submitted into review workflow.' : 'Saved as draft.',
          previousStatus: null,
          newStatus: isDirectSubmit ? SUBMISSION_STATUS.SUBMITTED : SUBMISSION_STATUS.DRAFT,
        },
      ],
    };

    const updated = [newSub, ...list];
    storage.set(STORAGE_KEY, updated);

    // Trigger workflow notification
    if (isDirectSubmit) {
      iqacService.sendCoordinatorNotification({
        senderUser: user,
        recipientScope: 'DEPARTMENT_COORDINATOR',
        title: `New Submission ${submissionId}: ${newSub.title}`,
        message: `${newSub.submittedBy} submitted ${newSub.typeLabel} for review.`,
        priority: newSub.priority,
      });
    }

    return {
      success: true,
      message: isDirectSubmit ? 'Submission created and sent for review.' : 'Draft saved successfully.',
      data: newSub,
    };
  },

  /**
   * Action methods calling workflowService
   */
  approveSubmission: async (id, comment, user) => {
    await delay();
    const list = getStoredSubmissions();
    const index = list.findIndex((s) => s.id === id || s.submissionId === id);
    if (index === -1) throw new Error('Submission record not found.');

    const updated = workflowService.transitionSubmission(list[index], 'APPROVE', user, comment);
    list[index] = updated;
    storage.set(STORAGE_KEY, list);

    iqacService.sendCoordinatorNotification({
      senderUser: user,
      recipientScope: 'SUBMITTER',
      title: `Submission Approved: ${updated.submissionId}`,
      message: `Your submission "${updated.title}" has been approved by ${user.name}.`,
      priority: 'NORMAL',
    });

    return { success: true, message: 'Submission approved successfully.', data: updated };
  },

  returnSubmission: async (id, reason, user) => {
    await delay();
    const list = getStoredSubmissions();
    const index = list.findIndex((s) => s.id === id || s.submissionId === id);
    if (index === -1) throw new Error('Submission record not found.');

    const updated = workflowService.transitionSubmission(list[index], 'RETURN', user, reason);
    list[index] = updated;
    storage.set(STORAGE_KEY, list);

    iqacService.sendCoordinatorNotification({
      senderUser: user,
      recipientScope: 'SUBMITTER',
      title: `Submission Returned for Correction: ${updated.submissionId}`,
      message: `Your submission "${updated.title}" was returned. Reason: ${reason}`,
      priority: 'HIGH',
    });

    return { success: true, message: 'Submission returned to submitter for correction.', data: updated };
  },

  rejectSubmission: async (id, reason, user) => {
    await delay();
    const list = getStoredSubmissions();
    const index = list.findIndex((s) => s.id === id || s.submissionId === id);
    if (index === -1) throw new Error('Submission record not found.');

    const updated = workflowService.transitionSubmission(list[index], 'REJECT', user, reason);
    list[index] = updated;
    storage.set(STORAGE_KEY, list);

    iqacService.sendCoordinatorNotification({
      senderUser: user,
      recipientScope: 'SUBMITTER',
      title: `Submission Rejected: ${updated.submissionId}`,
      message: `Your submission "${updated.title}" was rejected. Reason: ${reason}`,
      priority: 'HIGH',
    });

    return { success: true, message: 'Submission rejected.', data: updated };
  },

  resubmitSubmission: async (id, comment, user) => {
    await delay();
    const list = getStoredSubmissions();
    const index = list.findIndex((s) => s.id === id || s.submissionId === id);
    if (index === -1) throw new Error('Submission record not found.');

    const updated = workflowService.transitionSubmission(list[index], 'RESUBMIT', user, comment);
    list[index] = updated;
    storage.set(STORAGE_KEY, list);

    return { success: true, message: 'Submission resubmitted into review queue.', data: updated };
  },

  verifySubmission: async (id, comment, user) => {
    await delay();
    const list = getStoredSubmissions();
    const index = list.findIndex((s) => s.id === id || s.submissionId === id);
    if (index === -1) throw new Error('Submission record not found.');

    const updated = workflowService.transitionSubmission(list[index], 'VERIFY', user, comment);
    list[index] = updated;
    storage.set(STORAGE_KEY, list);

    iqacService.sendCoordinatorNotification({
      senderUser: user,
      recipientScope: 'SUBMITTER',
      title: `Submission Official Verification Confirmed: ${updated.submissionId}`,
      message: `Your submission "${updated.title}" has been officially verified by ${user.name} and added to verified institutional datasets.`,
      priority: 'HIGH',
    });

    return { success: true, message: 'Official IQAC verification confirmed.', data: updated };
  },

  /**
   * Section 44 & 59 requirement: Fetch official verified dataset
   */
  getVerifiedSubmissionData: async (user) => {
    await delay();
    const accessible = submissionService.getAccessibleSubmissions(user);
    const verified = accessible.filter((s) => s.status === SUBMISSION_STATUS.VERIFIED);
    return { success: true, data: verified };
  },
};
