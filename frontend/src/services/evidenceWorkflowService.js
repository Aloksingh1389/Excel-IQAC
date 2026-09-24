// Evidence Workflow Transition & Validation Engine (Stage 5D)

import { EVIDENCE_STATUS } from '../config/evidenceConfig';
import { getEvidenceWorkflow } from '../config/evidenceWorkflowConfig';
import { ROLES } from '../config/roles';

export const evidenceWorkflowService = {
  /**
   * Determine current active reviewer role for evidence
   */
  getCurrentEvidenceReviewerRole: (evidence) => {
    if (!evidence) return null;
    const wf = getEvidenceWorkflow(evidence.evidenceType);
    const seq = wf.reviewSequence || [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD];

    if (evidence.status === EVIDENCE_STATUS.VERIFIED || evidence.status === EVIDENCE_STATUS.REJECTED) {
      return null;
    }
    if (evidence.status === EVIDENCE_STATUS.RETURNED) {
      return evidence.uploadedByRole || ROLES.STAFF;
    }

    return evidence.reviewedByRole || seq[0];
  },

  /**
   * Determine if user is authorized to perform action on evidence
   */
  canTransitionEvidence: (evidence, action, user) => {
    if (!evidence || !user || !action) return false;

    const role = user.role;
    const status = evidence.status;

    // Verified evidence is immutable for ordinary staff/coordinators
    if (status === EVIDENCE_STATUS.VERIFIED) {
      return false;
    }

    const userDeptCode = user.departmentCode || 'CSE';
    const isApex = role === ROLES.TECHNICAL_DIRECTOR || role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL || role === ROLES.INSTITUTION_ADMIN;
    const isHead = role === ROLES.IQAC_HEAD;
    const isDean = role === ROLES.DEAN && (user.assignedDepartments || []).includes(evidence.departmentCode);
    const isDeptScoped = (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) && (userDeptCode === evidence.departmentCode || user.departmentId === evidence.departmentId);
    const isUploader = user.email === evidence.uploadedByEmail || user.id === evidence.uploadedById;

    switch (action) {
      case 'RESUBMIT':
        return (status === EVIDENCE_STATUS.RETURNED) && (isUploader || isApex || isHead);

      case 'VERIFY':
        if (status === EVIDENCE_STATUS.VERIFIED || status === EVIDENCE_STATUS.REJECTED) return false;
        return isApex || isHead || isDeptScoped || isDean;

      case 'RETURN':
      case 'REJECT':
        if (status === EVIDENCE_STATUS.VERIFIED || status === EVIDENCE_STATUS.REJECTED) return false;
        return isApex || isHead || isDeptScoped || isDean;

      default:
        return false;
    }
  },

  /**
   * Transition evidence status & create history entry
   */
  transitionEvidence: (evidence, action, user, comment = '', metadata = {}) => {
    if (!evidenceWorkflowService.canTransitionEvidence(evidence, action, user)) {
      throw new Error(`Unauthorized or invalid transition '${action}' for evidence ${evidence.evidenceId}.`);
    }

    const timestamp = new Date().toLocaleString();
    const actorName = `${user.name} (${user.role.replace(/_/g, ' ')})`;
    let newStatus = evidence.status;
    let newVersion = evidence.version || 1;
    let verificationReason = evidence.verificationReason;
    let returnReason = evidence.returnReason;
    let rejectionReason = evidence.rejectionReason;
    let reviewedBy = actorName;
    let reviewedAt = timestamp;

    switch (action) {
      case 'RESUBMIT':
        newStatus = EVIDENCE_STATUS.RESUBMITTED;
        newVersion = (evidence.version || 1) + 1;
        returnReason = null;
        if (metadata.fileName) evidence.fileName = metadata.fileName;
        if (metadata.fileSize) evidence.fileSize = metadata.fileSize;
        break;

      case 'VERIFY':
        newStatus = EVIDENCE_STATUS.VERIFIED;
        verificationReason = comment || 'Evidence document verified against official records.';
        break;

      case 'RETURN':
        if (!comment || !comment.trim()) {
          throw new Error('A mandatory return reason is required when returning evidence.');
        }
        newStatus = EVIDENCE_STATUS.RETURNED;
        returnReason = comment;
        break;

      case 'REJECT':
        if (!comment || !comment.trim()) {
          throw new Error('A mandatory rejection reason is required when rejecting evidence.');
        }
        newStatus = EVIDENCE_STATUS.REJECTED;
        rejectionReason = comment;
        break;

      default:
        break;
    }

    const historyItem = {
      id: `eh_${Date.now()}`,
      version: newVersion,
      action,
      actorName: user.name,
      actorRole: user.role,
      timestamp,
      comment: comment || `${action} executed.`,
      previousStatus: evidence.status,
      newStatus,
    };

    return {
      ...evidence,
      status: newStatus,
      version: newVersion,
      lastUpdatedAt: timestamp,
      reviewedBy,
      reviewedAt,
      verificationReason,
      returnReason,
      rejectionReason,
      history: [historyItem, ...(evidence.history || [])],
    };
  },
};
