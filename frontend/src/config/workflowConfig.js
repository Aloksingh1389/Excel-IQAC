// Configuration-Driven Workflow Rules Engine (Stage 5C)
// Determines reviewer sequences, authorization stages, and transition actions for each submission type.

import { SUBMISSION_TYPES } from './submissionTypes';
import { ROLES } from './roles';

export const WORKFLOW_CONFIG = {
  [SUBMISSION_TYPES.PUBLICATION]: {
    name: 'Research Publication Workflow',
    reviewSequence: [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD],
    autoApproveInitial: false,
    requiresEvidence: true,
  },
  [SUBMISSION_TYPES.RESEARCH]: {
    name: 'Research & Consultancy Grant Workflow',
    reviewSequence: [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD],
    autoApproveInitial: false,
    requiresEvidence: true,
  },
  [SUBMISSION_TYPES.FDP_TRAINING]: {
    name: 'FDP & Training Workflow',
    reviewSequence: [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD],
    autoApproveInitial: false,
    requiresEvidence: true,
  },
  [SUBMISSION_TYPES.FACULTY_PROFILE]: {
    name: 'Faculty Profile Update Workflow',
    reviewSequence: [ROLES.HOD, ROLES.IQAC_HEAD],
    autoApproveInitial: false,
    requiresEvidence: false,
  },
  [SUBMISSION_TYPES.ACADEMIC_QUALIFICATION]: {
    name: 'Academic Qualification Upgrade Workflow',
    reviewSequence: [ROLES.HOD, ROLES.IQAC_HEAD],
    autoApproveInitial: false,
    requiresEvidence: true,
  },
  [SUBMISSION_TYPES.PATENT]: {
    name: 'Patent & IPR Workflow',
    reviewSequence: [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD],
    autoApproveInitial: false,
    requiresEvidence: true,
  },
  [SUBMISSION_TYPES.CONSULTANCY]: {
    name: 'Consultancy Project Workflow',
    reviewSequence: [ROLES.HOD, ROLES.IQAC_HEAD],
    autoApproveInitial: false,
    requiresEvidence: true,
  },
  [SUBMISSION_TYPES.AWARD]: {
    name: 'Award & Recognition Workflow',
    reviewSequence: [ROLES.HOD, ROLES.IQAC_HEAD],
    autoApproveInitial: false,
    requiresEvidence: true,
  },
  [SUBMISSION_TYPES.STUDENT_ACHIEVEMENT]: {
    name: 'Student Achievement Workflow',
    reviewSequence: [ROLES.HOD, ROLES.IQAC_COORDINATOR],
    autoApproveInitial: false,
    requiresEvidence: true,
  },
  [SUBMISSION_TYPES.DEPARTMENT_REPORT]: {
    name: 'Department Quarterly Report Workflow',
    reviewSequence: [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD],
    autoApproveInitial: false,
    requiresEvidence: false,
  },
  DEFAULT: {
    name: 'Standard Institutional Review Workflow',
    reviewSequence: [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD],
    autoApproveInitial: false,
    requiresEvidence: false,
  },
};

export const getWorkflowForType = (submissionType) => {
  return WORKFLOW_CONFIG[submissionType] || WORKFLOW_CONFIG.DEFAULT;
};
