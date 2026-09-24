// Centralized Evidence Repository Service for Stage 5D

import { MOCK_EVIDENCE, MOCK_MISSING_EVIDENCE_REQUIREMENTS } from '../data/mockEvidence';
import { EVIDENCE_STATUS, EVIDENCE_TYPES, EVIDENCE_TYPE_LABELS, MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES } from '../config/evidenceConfig';
import { ROLES } from '../config/roles';
import { storage } from '../utils/storage';
import { evidenceWorkflowService } from './evidenceWorkflowService';
import { iqacService } from './iqacService';

const STORAGE_KEY = 'iqac_evidence_v1';

const getStoredEvidence = () => {
  const data = storage.get(STORAGE_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) {
    storage.set(STORAGE_KEY, MOCK_EVIDENCE);
    return MOCK_EVIDENCE;
  }
  return data;
};

const SIMULATED_LATENCY_MS = 150;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const evidenceService = {
  /**
   * Centralized utility for filtering evidence by user role & department scope
   * Section 50 requirement
   */
  getAccessibleEvidence: (user, evidenceList = null) => {
    if (!user) return [];
    const list = evidenceList || getStoredEvidence();
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
      return list.filter((ev) => assignedCodes.includes(ev.departmentCode));
    }

    if (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) {
      const userDeptCode = user.departmentCode || 'CSE';
      return list.filter((ev) => ev.departmentCode === userDeptCode || ev.departmentId === user.departmentId);
    }

    if (role === ROLES.STAFF) {
      // Staff sees ONLY own uploaded evidence or linked to own submissions
      return list.filter(
        (ev) =>
          ev.uploadedByEmail === user.email ||
          ev.uploadedById === user.id ||
          ev.uploadedBy === user.name
      );
    }

    return list;
  },

  /**
   * Alias kept for Stage 6 callers (useStaff, staffService) that use the
   * getEvidenceList name. Delegates to getEvidence; no duplicate logic.
   */
  getEvidenceList: async (filters = {}, user) => evidenceService.getEvidence(filters, user),

  /**
   * Fetch evidence list with filters & statistics
   */
  getEvidence: async (filters = {}, user) => {
    await delay();

    const accessible = evidenceService.getAccessibleEvidence(user);
    const { searchQuery, statusFilter, typeFilter, deptFilter, academicYear } = filters;

    let result = accessible;

    if (academicYear && academicYear !== 'ALL') {
      result = result.filter((e) => e.academicYear === academicYear);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((e) => e.status === statusFilter);
    }

    if (typeFilter && typeFilter !== 'ALL') {
      result = result.filter((e) => e.evidenceType === typeFilter);
    }

    if (deptFilter && deptFilter !== 'ALL') {
      result = result.filter((e) => e.departmentCode === deptFilter || e.departmentId === deptFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.evidenceId.toLowerCase().includes(q) ||
          e.fileName.toLowerCase().includes(q) ||
          e.title.toLowerCase().includes(q) ||
          e.uploadedBy.toLowerCase().includes(q) ||
          (e.submissionId && e.submissionId.toLowerCase().includes(q))
      );
    }

    const total = accessible.length;
    const verified = accessible.filter((e) => e.status === EVIDENCE_STATUS.VERIFIED).length;
    const pending = accessible.filter(
      (e) => e.status === EVIDENCE_STATUS.UPLOADED || e.status === EVIDENCE_STATUS.UNDER_REVIEW || e.status === EVIDENCE_STATUS.RESUBMITTED
    ).length;
    const returned = accessible.filter((e) => e.status === EVIDENCE_STATUS.RETURNED).length;
    const rejected = accessible.filter((e) => e.status === EVIDENCE_STATUS.REJECTED).length;

    const stats = {
      total,
      pending,
      verified,
      returned,
      rejected,
      verificationRate: Math.round((verified / (total || 1)) * 100),
      returnRate: Math.round((returned / (total || 1)) * 100),
      rejectionRate: Math.round((rejected / (total || 1)) * 100),
    };

    return {
      success: true,
      data: result,
      stats,
    };
  },

  /**
   * Fetch single evidence details
   */
  getEvidenceById: async (id, user) => {
    await delay();
    const accessible = evidenceService.getAccessibleEvidence(user);
    const item = accessible.find((e) => e.id === id || e.evidenceId === id);

    if (!item) {
      throw new Error('Evidence document not found or access denied for your user role scope.');
    }

    return {
      success: true,
      data: item,
    };
  },

  /**
   * Fetch evidence linked to a submission ID (Section 21 & 43 requirement)
   */
  getEvidenceBySubmission: async (submissionId, user) => {
    await delay();
    const accessible = evidenceService.getAccessibleEvidence(user);
    const linked = accessible.filter((e) => e.submissionId === submissionId);
    return {
      success: true,
      data: linked,
    };
  },

  /**
   * Fetch evidence review queue for current user
   */
  getPendingEvidenceReviews: async (user) => {
    await delay();
    const accessible = evidenceService.getAccessibleEvidence(user);
    const role = user.role;

    const queue = accessible.filter((e) => {
      if (e.status === EVIDENCE_STATUS.VERIFIED || e.status === EVIDENCE_STATUS.REJECTED) return false;
      if (role === ROLES.TECHNICAL_DIRECTOR || role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL || role === ROLES.IQAC_HEAD) {
        return true;
      }
      return e.status === EVIDENCE_STATUS.UPLOADED || e.status === EVIDENCE_STATUS.RESUBMITTED || e.status === EVIDENCE_STATUS.UNDER_REVIEW;
    });

    const stats = {
      pending: queue.length,
      highPriority: queue.filter((e) => e.evidenceType === EVIDENCE_TYPES.PUBLICATION_PROOF || e.evidenceType === EVIDENCE_TYPES.RESEARCH_DOCUMENT).length,
      returned: accessible.filter((e) => e.status === EVIDENCE_STATUS.RETURNED).length,
    };

    return {
      success: true,
      data: queue,
      stats,
    };
  },

  /**
   * Upload new mock evidence document with file type & size validation (Section 18 & 19 requirement)
   */
  uploadEvidence: async (payload, user) => {
    await delay();

    if (!payload.title || !payload.title.trim()) {
      throw new Error('Evidence document title is required.');
    }
    if (!payload.evidenceType) {
      throw new Error('Evidence document type is required.');
    }

    // Prototype file validation
    const fileType = payload.fileType ? payload.fileType.toUpperCase() : 'PDF';
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      throw new Error(`Unsupported file type '${fileType}'. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}.`);
    }

    const fileSizeMB = payload.fileSizeMB || 2.5;
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      throw new Error(`File size (${fileSizeMB} MB) exceeds maximum allowed limit of ${MAX_FILE_SIZE_MB} MB.`);
    }

    const list = getStoredEvidence();
    const evNumber = String(list.length + 101).padStart(5, '0');
    const evidenceId = `EV-2026-${evNumber}`;
    const timestamp = new Date().toLocaleString();

    const newEv = {
      id: `ev_${Date.now()}`,
      evidenceId,
      fileName: payload.fileName || `${payload.evidenceType.toLowerCase()}_document.pdf`,
      fileType,
      fileSize: `${fileSizeMB} MB`,
      mockUrl: '#',
      title: payload.title,
      description: payload.description || '',
      evidenceType: payload.evidenceType,
      typeLabel: EVIDENCE_TYPE_LABELS[payload.evidenceType] || 'Supporting Evidence',
      uploadedBy: user?.name || 'Faculty Member',
      uploadedByEmail: user?.email || 'staff@iqac.demo',
      uploadedByRole: user?.role || ROLES.STAFF,
      departmentId: user?.departmentId || payload.departmentId || 'dept_cse',
      departmentCode: user?.departmentCode || payload.departmentCode || 'CSE',
      departmentName: user?.department || payload.departmentName || 'Computer Science & Engineering',
      academicYear: payload.academicYear || '2026-27',
      submissionId: payload.submissionId || null,
      submissionTitle: payload.submissionTitle || null,
      recordType: payload.recordType || 'GENERAL',
      recordId: payload.recordId || null,
      status: EVIDENCE_STATUS.UPLOADED,
      version: 1,
      uploadedAt: timestamp,
      lastUpdatedAt: timestamp,
      reviewedBy: null,
      reviewedAt: null,
      verificationReason: null,
      returnReason: null,
      rejectionReason: null,
      history: [
        {
          id: `eh_${Date.now()}`,
          version: 1,
          action: 'UPLOADED',
          actorName: user?.name,
          actorRole: user?.role,
          timestamp,
          comment: payload.submissionId
            ? `Uploaded and linked to submission ${payload.submissionId}.`
            : 'Uploaded to evidence repository.',
          previousStatus: null,
          newStatus: EVIDENCE_STATUS.UPLOADED,
        },
      ],
    };

    const updated = [newEv, ...list];
    storage.set(STORAGE_KEY, updated);

    // Trigger notification to reviewer
    iqacService.sendCoordinatorNotification({
      senderUser: user,
      recipientScope: 'DEPARTMENT_COORDINATOR',
      title: `New Evidence Uploaded (${evidenceId})`,
      message: `${newEv.uploadedBy} uploaded evidence for ${newEv.typeLabel}.`,
      priority: 'MEDIUM',
    });

    return {
      success: true,
      message: 'Evidence document metadata uploaded and linked successfully.',
      data: newEv,
    };
  },

  /**
   * Action methods calling evidenceWorkflowService
   */
  verifyEvidence: async (id, comment, user) => {
    await delay();
    const list = getStoredEvidence();
    const index = list.findIndex((e) => e.id === id || e.evidenceId === id);
    if (index === -1) throw new Error('Evidence record not found.');

    const updated = evidenceWorkflowService.transitionEvidence(list[index], 'VERIFY', user, comment);
    list[index] = updated;
    storage.set(STORAGE_KEY, list);

    iqacService.sendCoordinatorNotification({
      senderUser: user,
      recipientScope: 'SUBMITTER',
      title: `Evidence Verified: ${updated.evidenceId}`,
      message: `Your evidence "${updated.title}" has been verified by ${user.name}.`,
      priority: 'NORMAL',
    });

    return { success: true, message: 'Evidence document verified successfully.', data: updated };
  },

  returnEvidence: async (id, reason, user) => {
    await delay();
    const list = getStoredEvidence();
    const index = list.findIndex((e) => e.id === id || e.evidenceId === id);
    if (index === -1) throw new Error('Evidence record not found.');

    const updated = evidenceWorkflowService.transitionEvidence(list[index], 'RETURN', user, reason);
    list[index] = updated;
    storage.set(STORAGE_KEY, list);

    iqacService.sendCoordinatorNotification({
      senderUser: user,
      recipientScope: 'SUBMITTER',
      title: `Evidence Returned: ${updated.evidenceId}`,
      message: `Your evidence "${updated.title}" was returned. Reason: ${reason}`,
      priority: 'HIGH',
    });

    return { success: true, message: 'Evidence document returned to uploader for correction.', data: updated };
  },

  rejectEvidence: async (id, reason, user) => {
    await delay();
    const list = getStoredEvidence();
    const index = list.findIndex((e) => e.id === id || e.evidenceId === id);
    if (index === -1) throw new Error('Evidence record not found.');

    const updated = evidenceWorkflowService.transitionEvidence(list[index], 'REJECT', user, reason);
    list[index] = updated;
    storage.set(STORAGE_KEY, list);

    return { success: true, message: 'Evidence document rejected.', data: updated };
  },

  resubmitEvidence: async (id, payload, user) => {
    await delay();
    const list = getStoredEvidence();
    const index = list.findIndex((e) => e.id === id || e.evidenceId === id);
    if (index === -1) throw new Error('Evidence record not found.');

    const updated = evidenceWorkflowService.transitionEvidence(
      list[index],
      'RESUBMIT',
      user,
      payload.comment || 'Re-uploaded corrected document version.',
      payload
    );
    list[index] = updated;
    storage.set(STORAGE_KEY, list);

    return { success: true, message: 'Corrected evidence resubmitted into review queue.', data: updated };
  },

  /**
   * Conceptual missing evidence tracker & health stats (Section 33 & 40 requirement)
   */
  getMissingEvidence: async (user) => {
    await delay();
    const accessible = evidenceService.getAccessibleEvidence(user);
    const accessibleCodes = accessible.map((e) => e.departmentCode);
    const missing = MOCK_MISSING_EVIDENCE_REQUIREMENTS.filter(
      (m) => accessibleCodes.includes(m.departmentCode) || user?.role === ROLES.IQAC_HEAD
    );
    return { success: true, data: missing };
  },
};
