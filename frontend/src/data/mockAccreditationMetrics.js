// Mock NAAC Metrics Data with Readiness & Mappings for Stage 5G

import { REQUISITE_NAAC_METRICS } from '../config/accreditationMetricConfig';
import { METRIC_READINESS_STATUS } from '../config/accreditationFrameworkConfig';

export const MOCK_ACCREDITATION_METRICS = REQUISITE_NAAC_METRICS.map((m, idx) => {
  let readinessStatus = METRIC_READINESS_STATUS.VERIFIED;
  let completionPercentage = 100;
  let evidenceCompleteness = 100;
  let verificationRate = 100;
  let assignedOwner = 'Dr. M. S. Swaminathan (IQAC Head)';
  let assignedDepartment = 'INSTITUTION';

  if (m.code === '1.2.1') {
    readinessStatus = METRIC_READINESS_STATUS.PARTIALLY_READY;
    completionPercentage = 80;
    evidenceCompleteness = 70;
    verificationRate = 60;
    assignedOwner = 'Dr. Ramesh Sharma (HOD CSE)';
    assignedDepartment = 'CSE';
  } else if (m.code === '2.4.1') {
    readinessStatus = METRIC_READINESS_STATUS.VERIFIED;
    completionPercentage = 95;
    evidenceCompleteness = 90;
    verificationRate = 90;
    assignedOwner = 'Prof. Priya Nair (IQAC Lead)';
    assignedDepartment = 'CSE';
  } else if (m.code === '3.3.1') {
    readinessStatus = METRIC_READINESS_STATUS.EVIDENCE_PENDING;
    completionPercentage = 75;
    evidenceCompleteness = 50;
    verificationRate = 40;
    assignedOwner = 'Dr. K. V. Raman (IQAC Lead)';
    assignedDepartment = 'ECE';
  } else if (m.code === '6.3.1') {
    readinessStatus = METRIC_READINESS_STATUS.DATA_PENDING;
    completionPercentage = 45;
    evidenceCompleteness = 40;
    verificationRate = 30;
    assignedOwner = 'Prof. Suresh V. (IQAC Lead)';
    assignedDepartment = 'MECH';
  }

  return {
    ...m,
    readinessStatus,
    completionPercentage,
    evidenceCompleteness,
    verificationRate,
    currentValue: m.unit === 'RATIO' ? 1.4 : m.target ? Math.round(m.target * 0.85) : 85,
    assignedOwner,
    assignedDepartment,
    mappedSubmissionIds: ['SUB-2026-00101'],
    mappedEvidenceIds: ['ev_001', 'ev_004'],
    mappedActionItemIds: ['act_001'],
    updatedAt: '2026-09-12 04:00 PM',
  };
});
