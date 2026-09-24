// Mock AQAR Reports Dataset for Stage 5H

import { AQAR_REPORT_STATUS } from '../config/aqarConfig';

export const MOCK_AQAR_REPORTS = [
  {
    id: 'AQAR-2025-26-001',
    reportId: 'AQAR-2025-26-001',
    frameworkId: 'NAAC',
    reportType: 'AQAR',
    academicYear: '2025-26',
    institutionName: 'Excel College of Engineering & Technology',
    title: 'Annual Quality Assurance Report (AQAR) 2025-26',
    status: AQAR_REPORT_STATUS.DRAFT,
    version: 1,
    readinessScore: 81,
    generatedAt: '2026-09-10 10:00 AM',
    generatedBy: 'Dr. M. S. Swaminathan (IQAC Head)',
    finalizedAt: null,
    finalizedBy: null,
    lastUpdatedAt: '2026-09-12 05:30 PM',

    executiveSummary: 'This NAAC-aligned Annual Quality Assurance Report (AQAR) summarizes the quality benchmarks, academic achievements, research publications, and verified evidence repository entries of Excel College of Engineering & Technology for AY 2025-26.',

    institutionProfile: {
      address: 'Excel Institutional Campus, Innovation Valley, Salem Main Road',
      headOfInstitution: 'Dr. R. K. Viswanathan (Principal)',
      iqacCoordinator: 'Dr. M. S. Swaminathan (IQAC Head)',
      accreditationCycle: 'Cycle 2',
      naacGrade: 'A+',
      cgpaScore: 3.42,
    },

    partA: {
      totalFaculty: 185,
      phdFaculty: 152,
      totalStudents: 3200,
      iqacMeetingsCount: 4,
      qualityActivitiesCount: 12,
    },

    partB: {
      criteria: [
        { criterionId: 'NAAC-C1', code: 'C1', name: 'Curricular Aspects', readinessScore: 82, status: 'GOOD', metricsCount: 3, readyMetricsCount: 3 },
        { criterionId: 'NAAC-C2', code: 'C2', name: 'Teaching-Learning and Evaluation', readinessScore: 76, status: 'SATISFACTORY', metricsCount: 2, readyMetricsCount: 2 },
        { criterionId: 'NAAC-C3', code: 'C3', name: 'Research, Innovations and Extension', readinessScore: 91, status: 'EXCELLENT', metricsCount: 3, readyMetricsCount: 2 },
        { criterionId: 'NAAC-C4', code: 'C4', name: 'Infrastructure & Learning Resources', readinessScore: 68, status: 'WARNING', metricsCount: 1, readyMetricsCount: 1 },
        { criterionId: 'NAAC-C5', code: 'C5', name: 'Student Support and Progression', readinessScore: 73, status: 'SATISFACTORY', metricsCount: 1, readyMetricsCount: 1 },
        { criterionId: 'NAAC-C6', code: 'C6', name: 'Governance, Leadership & Management', readinessScore: 85, status: 'GOOD', metricsCount: 2, readyMetricsCount: 1 },
        { criterionId: 'NAAC-C7', code: 'C7', name: 'Institutional Values & Best Practices', readinessScore: 71, status: 'SATISFACTORY', metricsCount: 1, readyMetricsCount: 1 },
      ],
    },

    qualityInitiatives: [
      'Mandatory Scopus DOI proof landing page verification policy.',
      'Faculty Development Acceleration Drive (ATAL/NPTEL 5-day FDPs).',
      'Department-level Academic & Administrative Quality Audits (AAA).',
    ],

    bestPractices: [
      'Practice 1: Outcome-Based Education (OBE) digital CO-PO attainment tracking.',
      'Practice 2: Student Industry-Sponsored Capstone Project incubation.',
    ],

    challenges: [
      'Increasing Scopus DOI proof verification speed for Mechanical Engineering.',
      'Enhancing solar power generation capacity from 200kW to 500kW.',
    ],

    actionPlan: [
      'Achieve 100% Ph.D. faculty qualification across all engineering departments.',
      'Establish 2 additional Industry Center of Excellence (CoE) labs.',
    ],

    evidenceSummary: {
      totalRequired: 45,
      totalSubmitted: 42,
      totalVerified: 38,
      totalMissing: 3,
      verificationRate: 85,
    },

    validation: {
      status: 'VALID',
      blockers: [],
      warnings: ['3 Scopus DOI proofs pending verification in Criterion 3.'],
    },

    history: [
      { id: 'aqh_101', action: 'DRAFT_CREATED', actorName: 'Dr. M. S. Swaminathan', timestamp: '2026-09-10 10:00 AM', comment: 'Generated AQAR 2025-26 draft.' },
    ],
  },
  {
    id: 'AQAR-2024-25-001',
    reportId: 'AQAR-2024-25-001',
    frameworkId: 'NAAC',
    reportType: 'AQAR',
    academicYear: '2024-25',
    institutionName: 'Excel College of Engineering & Technology',
    title: 'Annual Quality Assurance Report (AQAR) 2024-25',
    status: AQAR_REPORT_STATUS.FINALIZED,
    version: 2,
    readinessScore: 85,
    generatedAt: '2025-09-15 11:00 AM',
    generatedBy: 'Dr. M. S. Swaminathan (IQAC Head)',
    finalizedAt: '2025-09-28 04:00 PM',
    finalizedBy: 'Dr. R. K. Viswanathan (Principal)',
    lastUpdatedAt: '2025-09-28 04:00 PM',

    executiveSummary: 'Finalized AY 2024-25 AQAR Report approved by IQAC Board.',
    history: [],
  },
];
