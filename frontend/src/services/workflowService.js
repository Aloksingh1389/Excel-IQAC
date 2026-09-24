// Workflow Service for Stage 5C State Transitions & Authorization
import { SUBMISSION_STATUS } from '../config/submissionStatuses';
import { getWorkflowForType } from '../config/workflowConfig';
import { ROLES } from '../config/roles';

export const workflowService = {
  /**
   * Determine the current active review stage role in sequence
   */
  getCurrentReviewerRole: (submission) => {
    if (!submission) return null;
    const workflow = getWorkflowForType(submission.type);
    const seq = workflow.reviewSequence || [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD];

    if (submission.status === SUBMISSION_STATUS.APPROVED) {
      return ROLES.IQAC_HEAD;
    }
    if (submission.status === SUBMISSION_STATUS.VERIFIED || submission.status === SUBMISSION_STATUS.REJECTED) {
      return null;
    }
    if (submission.status === SUBMISSION_STATUS.DRAFT || submission.status === SUBMISSION_STATUS.RETURNED) {
      return submission.submittedByRole || ROLES.STAFF;
    }

    return submission.currentReviewerRole || seq[0];
  },

  /**
   * Determine next reviewer role in sequence upon approval
   */
  getNextReviewerRole: (submission) => {
    if (!submission) return null;
    const workflow = getWorkflowForType(submission.type);
    const seq = workflow.reviewSequence || [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD];

    const currentRole = submission.currentReviewerRole || seq[0];
    const currentIndex = seq.indexOf(currentRole);

    if (currentIndex !== -1 && currentIndex < seq.length - 1) {
      return seq[currentIndex + 1];
    }
    return ROLES.IQAC_HEAD;
  },

  /**
   * Validate if a transition action is valid for current submission state & user role
   */
  canTransition: (submission, action, user) => {
    if (!submission || !user || !action) return false;

    const role = user.role;
    const status = submission.status;

    // Rule: VERIFIED submissions are immutable for normal users
    if (status === SUBMISSION_STATUS.VERIFIED) {
      return false;
    }

    // Role Scope validation
    const userDeptCode = user.departmentCode || 'CSE';
    const isApex = role === ROLES.TECHNICAL_DIRECTOR || role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL || role === ROLES.INSTITUTION_ADMIN;
    const isHead = role === ROLES.IQAC_HEAD;
    const isDean = role === ROLES.DEAN && (user.assignedDepartments || []).includes(submission.departmentCode);
    const isDeptScoped = (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) && (userDeptCode === submission.departmentCode || user.departmentId === submission.departmentId);
    const isSubmitter = user.email === submission.submittedByEmail || user.id === submission.submittedById;

    switch (action) {
      case 'SUBMIT':
        return (status === SUBMISSION_STATUS.DRAFT) && (isSubmitter || isApex || isHead);

      case 'RESUBMIT':
        return (status === SUBMISSION_STATUS.RETURNED) && (isSubmitter || isApex || isHead);

      case 'APPROVE':
        if (status !== SUBMISSION_STATUS.SUBMITTED && status !== SUBMISSION_STATUS.UNDER_REVIEW && status !== SUBMISSION_STATUS.RESUBMITTED) {
          return false;
        }
        if (isApex || isHead) return true;
        if (isDean) return true;
        if (isDeptScoped && submission.currentReviewerRole === role) return true;
        return false;

      case 'RETURN':
      case 'REJECT':
        if (status !== SUBMISSION_STATUS.SUBMITTED && status !== SUBMISSION_STATUS.UNDER_REVIEW && status !== SUBMISSION_STATUS.RESUBMITTED) {
          return false;
        }
        if (isApex || isHead) return true;
        if (isDean) return true;
        if (isDeptScoped) return true;
        return false;

      case 'VERIFY':
        if (status !== SUBMISSION_STATUS.APPROVED && status !== SUBMISSION_STATUS.UNDER_REVIEW) {
          return false;
        }
        return isApex || isHead;

      default:
        return false;
    }
  },

  /**
   * Execute state transition and return updated submission object
   */
  transitionSubmission: (submission, action, user, comment = '', metadata = {}) => {
    if (!workflowService.canTransition(submission, action, user)) {
      throw new Error(`Unauthorized or invalid transition '${action}' for submission ${submission.submissionId}.`);
    }

    const timestamp = new Date().toLocaleString();
    const actorName = `${user.name} (${user.role.replace(/_/g, ' ')})`;
    let newStatus = submission.status;
    let nextReviewerRole = submission.currentReviewerRole;
    let nextReviewerName = submission.currentReviewerName;
    let approvedAt = submission.approvedAt;
    let approvedBy = submission.approvedBy;
    let verifiedAt = submission.verifiedAt;
    let verifiedBy = submission.verifiedBy;
    let returnReason = submission.returnReason;
    let rejectionReason = submission.rejectionReason;

    switch (action) {
      case 'SUBMIT':
        newStatus = SUBMISSION_STATUS.SUBMITTED;
        nextReviewerRole = workflowService.getCurrentReviewerRole({ ...submission, status: newStatus });
        nextReviewerName = `Department ${nextReviewerRole.replace(/_/g, ' ')}`;
        break;

      case 'RESUBMIT':
        newStatus = SUBMISSION_STATUS.RESUBMITTED;
        nextReviewerRole = workflowService.getCurrentReviewerRole({ ...submission, status: newStatus });
        nextReviewerName = `Department ${nextReviewerRole.replace(/_/g, ' ')}`;
        returnReason = null;
        break;

      case 'APPROVE':
        const nextRole = workflowService.getNextReviewerRole(submission);
        if (nextRole === ROLES.IQAC_HEAD && submission.currentReviewerRole === ROLES.IQAC_COORDINATOR) {
          newStatus = SUBMISSION_STATUS.APPROVED;
          nextReviewerRole = ROLES.IQAC_HEAD;
          nextReviewerName = 'Dr. M. S. Swaminathan (IQAC Head)';
        } else {
          newStatus = SUBMISSION_STATUS.APPROVED;
          nextReviewerRole = nextRole;
          nextReviewerName = `${nextRole.replace(/_/g, ' ')}`;
        }
        approvedAt = timestamp;
        approvedBy = actorName;
        break;

      case 'RETURN':
        if (!comment || !comment.trim()) {
          throw new Error('A mandatory return reason is required when returning a submission.');
        }
        newStatus = SUBMISSION_STATUS.RETURNED;
        nextReviewerRole = submission.submittedByRole || ROLES.STAFF;
        nextReviewerName = submission.submittedBy;
        returnReason = comment;
        break;

      case 'REJECT':
        if (!comment || !comment.trim()) {
          throw new Error('A mandatory rejection reason is required when rejecting a submission.');
        }
        newStatus = SUBMISSION_STATUS.REJECTED;
        nextReviewerRole = null;
        nextReviewerName = null;
        rejectionReason = comment;
        break;

      case 'VERIFY':
        newStatus = SUBMISSION_STATUS.VERIFIED;
        nextReviewerRole = null;
        nextReviewerName = null;
        verifiedAt = timestamp;
        verifiedBy = actorName;
        break;

      default:
        break;
    }

    const historyItem = {
      id: `h_${Date.now()}`,
      action,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      timestamp,
      comment: comment || `${action} executed successfully.`,
      previousStatus: submission.status,
      newStatus,
    };

    return {
      ...submission,
      status: newStatus,
      currentReviewerRole: nextReviewerRole,
      currentReviewerName: nextReviewerName,
      lastUpdatedAt: timestamp,
      approvedAt,
      approvedBy,
      verifiedAt,
      verifiedBy,
      returnReason,
      rejectionReason,
      history: [historyItem, ...(submission.history || [])],
    };
  },
};
