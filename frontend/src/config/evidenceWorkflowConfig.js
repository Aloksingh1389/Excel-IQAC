// Evidence Workflow Rules Configuration (Stage 5D)

import { EVIDENCE_TYPES } from './evidenceConfig';
import { ROLES } from './roles';

export const EVIDENCE_WORKFLOW_CONFIG = {
  [EVIDENCE_TYPES.PUBLICATION_PROOF]: {
    name: 'Publication Proof Verification',
    reviewSequence: [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD],
  },
  [EVIDENCE_TYPES.RESEARCH_DOCUMENT]: {
    name: 'Research Grant Verification',
    reviewSequence: [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD],
  },
  [EVIDENCE_TYPES.PATENT_DOCUMENT]: {
    name: 'Patent Document Verification',
    reviewSequence: [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD],
  },
  [EVIDENCE_TYPES.FDP_CERTIFICATE]: {
    name: 'FDP Certificate Verification',
    reviewSequence: [ROLES.IQAC_COORDINATOR],
  },
  [EVIDENCE_TYPES.DEGREE_CERTIFICATE]: {
    name: 'Degree Qualification Verification',
    reviewSequence: [ROLES.HOD, ROLES.IQAC_HEAD],
  },
  [EVIDENCE_TYPES.AWARD_CERTIFICATE]: {
    name: 'Award Verification',
    reviewSequence: [ROLES.HOD, ROLES.IQAC_HEAD],
  },
  [EVIDENCE_TYPES.DEPARTMENT_REPORT]: {
    name: 'Department Report Verification',
    reviewSequence: [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD],
  },
  DEFAULT: {
    name: 'Standard Evidence Verification Workflow',
    reviewSequence: [ROLES.IQAC_COORDINATOR, ROLES.IQAC_HEAD],
  },
};

export const getEvidenceWorkflow = (evidenceType) => {
  return EVIDENCE_WORKFLOW_CONFIG[evidenceType] || EVIDENCE_WORKFLOW_CONFIG.DEFAULT;
};
