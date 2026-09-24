// Centralized AQAR Report Management Service for Stage 5H

import { MOCK_AQAR_REPORTS } from '../data/mockAQARReports';
import { AQAR_REPORT_STATUS } from '../config/aqarConfig';
import { aqarDataService } from './aqarDataService';
import { aqarValidationService } from './aqarValidationService';
import { ROLES } from '../config/roles';
import { storage } from '../utils/storage';

const STORAGE_KEY = 'excel_iqac_aqar_reports';

const getStoredReports = () => {
  const data = storage.get(STORAGE_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) {
    storage.set(STORAGE_KEY, MOCK_AQAR_REPORTS);
    return MOCK_AQAR_REPORTS;
  }
  return data;
};

const SIMULATED_LATENCY_MS = 150;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const aqarReportService = {
  getAccessibleReports: (user, list = null) => {
    if (!user) return [];
    const reports = list || getStoredReports();
    return reports;
  },

  getAQARReports: async (filters = {}, user) => {
    await delay();
    const accessible = aqarReportService.getAccessibleReports(user);
    const { searchQuery, statusFilter, academicYear } = filters;

    let result = accessible;

    if (academicYear && academicYear !== 'ALL') {
      result = result.filter((r) => r.academicYear === academicYear);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.reportId.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.academicYear.toLowerCase().includes(q)
      );
    }

    const stats = {
      total: accessible.length,
      drafts: accessible.filter((r) => r.status === AQAR_REPORT_STATUS.DRAFT).length,
      underReview: accessible.filter((r) => r.status === AQAR_REPORT_STATUS.UNDER_REVIEW).length,
      finalized: accessible.filter((r) => r.status === AQAR_REPORT_STATUS.FINALIZED).length,
    };

    return { success: true, data: result, stats };
  },

  getAQARById: async (id, user) => {
    await delay();
    const accessible = aqarReportService.getAccessibleReports(user);
    const report = accessible.find((r) => r.id === id || r.reportId === id);
    if (!report) throw new Error('AQAR Report record not found.');
    return { success: true, data: report };
  },

  createAQARDraft: async (payload, user) => {
    await delay();
    const academicYear = payload.academicYear || '2025-26';
    const reports = getStoredReports();

    // Auto-collect system data
    const collectedData = await aqarDataService.collectFullAQARData(academicYear, user);

    const timestamp = new Date().toLocaleString();
    const reportId = `AQAR-${academicYear}-001`;

    const newReport = {
      id: reportId,
      reportId,
      frameworkId: 'NAAC',
      reportType: 'AQAR',
      academicYear,
      institutionName: 'Excel College of Engineering & Technology',
      title: `Annual Quality Assurance Report (AQAR) ${academicYear}`,
      status: AQAR_REPORT_STATUS.DRAFT,
      version: 1,
      readinessScore: collectedData.readinessScore,
      generatedAt: timestamp,
      generatedBy: `${user?.name} (${user?.role.replace(/_/g, ' ')})`,
      finalizedAt: null,
      finalizedBy: null,
      lastUpdatedAt: timestamp,
      executiveSummary: payload.executiveSummary || 'Draft AQAR report generated automatically from Stage 5G accreditation readiness and Stage 5F quality data.',
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
        criteria: collectedData.criteria,
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
      ],
      actionPlan: [
        'Achieve 100% Ph.D. faculty qualification across all engineering departments.',
      ],
      evidenceSummary: collectedData.evidenceSummary,
      validation: { status: 'VALID', blockers: [], warnings: [] },
      history: [{ id: `aqh_${Date.now()}`, action: 'DRAFT_CREATED', actorName: user?.name, timestamp, comment: 'Draft generated.' }],
    };

    const updated = [newReport, ...reports.filter((r) => r.id !== reportId)];
    storage.set(STORAGE_KEY, updated);

    return { success: true, message: 'AQAR draft generated successfully.', data: newReport };
  },

  updateAQARReport: async (id, updatePayload, user) => {
    await delay();
    const reports = getStoredReports();
    const index = reports.findIndex((r) => r.id === id || r.reportId === id);
    if (index === -1) throw new Error('AQAR Report not found.');

    const report = reports[index];
    if (report.status === AQAR_REPORT_STATUS.FINALIZED) {
      throw new Error('Cannot edit a finalized report. Please create a new version.');
    }

    const timestamp = new Date().toLocaleString();
    const updatedReport = {
      ...report,
      ...updatePayload,
      lastUpdatedAt: timestamp,
      history: [
        { id: `aqh_${Date.now()}`, action: 'UPDATED', actorName: user?.name, timestamp, comment: 'Narratives or fields updated.' },
        ...(report.history || []),
      ],
    };

    reports[index] = updatedReport;
    storage.set(STORAGE_KEY, reports);

    return { success: true, message: 'AQAR Report updated successfully.', data: updatedReport };
  },

  submitAQARForReview: async (id, user) => {
    await delay();
    const reports = getStoredReports();
    const index = reports.findIndex((r) => r.id === id || r.reportId === id);
    if (index === -1) throw new Error('AQAR Report not found.');

    const report = reports[index];
    const timestamp = new Date().toLocaleString();

    const updatedReport = {
      ...report,
      status: AQAR_REPORT_STATUS.UNDER_REVIEW,
      lastUpdatedAt: timestamp,
      history: [
        { id: `aqh_${Date.now()}`, action: 'SUBMITTED_FOR_REVIEW', actorName: user?.name, timestamp, comment: 'Submitted for IQAC Board review.' },
        ...(report.history || []),
      ],
    };

    reports[index] = updatedReport;
    storage.set(STORAGE_KEY, reports);

    return { success: true, message: 'AQAR Report submitted for IQAC review.', data: updatedReport };
  },

  finalizeAQARReport: async (id, user) => {
    await delay();
    const reports = getStoredReports();
    const index = reports.findIndex((r) => r.id === id || r.reportId === id);
    if (index === -1) throw new Error('AQAR Report not found.');

    const report = reports[index];
    const validation = aqarValidationService.validateAQARReport(report);
    if (validation.isBlocked) {
      throw new Error(`Cannot finalize report due to critical blockers: ${validation.blockers.join(', ')}`);
    }

    const timestamp = new Date().toLocaleString();

    // Preserve snapshot
    const finalizedReport = {
      ...report,
      status: AQAR_REPORT_STATUS.FINALIZED,
      finalizedAt: timestamp,
      finalizedBy: `${user?.name} (${user?.role.replace(/_/g, ' ')})`,
      lastUpdatedAt: timestamp,
      history: [
        { id: `aqh_${Date.now()}`, action: 'FINALIZED', actorName: user?.name, timestamp, comment: 'AQAR report finalized and snapshot locked.' },
        ...(report.history || []),
      ],
    };

    reports[index] = finalizedReport;
    storage.set(STORAGE_KEY, reports);

    return { success: true, message: 'AQAR Report finalized successfully.', data: finalizedReport };
  },
};
