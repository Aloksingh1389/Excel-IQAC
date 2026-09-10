// Report Service for Stage 4 Report Management & Generation

import { REPORT_CATEGORIES, REPORT_CONFIGS } from '../config/reportConfig';
import { MOCK_REPORT_HISTORY, MOCK_COLLEGE_LETTERHEAD } from '../data/mockReports';
import { MOCK_ANALYTICS_DATA } from '../data/mockAnalytics';
import { storage } from '../utils/storage';

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));
const STORAGE_KEY_HISTORY = 'iqac_report_history';
const STORAGE_KEY_FAVORITES = 'iqac_report_favorites';

const getStoredHistory = () => {
  const stored = storage.get(STORAGE_KEY_HISTORY, null);
  if (stored && Array.isArray(stored)) {
    return stored;
  }
  storage.set(STORAGE_KEY_HISTORY, MOCK_REPORT_HISTORY);
  return MOCK_REPORT_HISTORY;
};

const getStoredFavorites = () => {
  return storage.get(STORAGE_KEY_FAVORITES, [
    'annual-institutional-report',
    'placement-report',
    'academic-performance',
  ]);
};

export const reportService = {
  /**
   * Retrieves all available report categories
   */
  getReportCategories: async () => {
    await delay(100);
    return REPORT_CATEGORIES;
  },

  /**
   * Retrieves all report types, optionally filtered by category
   */
  getReportTypes: async (category = 'ALL') => {
    await delay(120);
    if (!category || category === 'ALL') {
      return REPORT_CONFIGS;
    }
    return REPORT_CONFIGS.filter((r) => r.category === category);
  },

  /**
   * Retrieves a single report configuration by ID
   */
  getReportConfig: async (configId) => {
    await delay(100);
    const config = REPORT_CONFIGS.find((r) => r.id === configId);
    if (!config) {
      throw new Error(`Report template "${configId}" not found.`);
    }
    return config;
  },

  /**
   * Generates a new institutional report dossier
   */
  generateReport: async ({
    reportConfigId,
    academicYear = '2026-27',
    scope = 'INSTITUTION',
    department = 'ALL',
    semester = 'ALL',
    program = 'ALL',
    fundingAgency = 'ALL',
    fdpType = 'ALL',
    format = 'PDF',
    user = null,
  }) => {
    await delay(600); // simulate institutional data collection & synthesis

    const config = REPORT_CONFIGS.find((r) => r.id === reportConfigId) || REPORT_CONFIGS[0];
    const analyticsYear = MOCK_ANALYTICS_DATA[academicYear] || MOCK_ANALYTICS_DATA['2026-27'];
    
    // Generate unique report ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const yearPrefix = academicYear.split('-')[0] || '2026';
    const reportId = `RPT-${yearPrefix}-${randomNum}`;

    const newReport = {
      id: reportId,
      reportConfigId: config.id,
      title: config.name,
      category: config.category,
      academicYear,
      scope,
      department,
      semester,
      program,
      fundingAgency,
      fdpType,
      generatedBy: user?.name || 'Dr. Vikram Seth',
      generatedByRole: user?.designation === 'TECHNICAL_DIRECTOR' ? 'Technical Director' : 'Executive Director & Principal',
      generatedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      fileSize: `${(Math.random() * 3 + 2).toFixed(1)} MB`,
      format: format.toUpperCase(),
      status: 'GENERATED',
      letterhead: MOCK_COLLEGE_LETTERHEAD,
      summaryMetrics: {
        students: analyticsYear.overviewKPIs.students.totalStudents,
        faculty: analyticsYear.overviewKPIs.faculty.totalFaculty,
        passPercentage: `${analyticsYear.overviewKPIs.academic.passPercentage}%`,
        placementRate: `${analyticsYear.overviewKPIs.placement.placementPercentage}%`,
        researchFunding: analyticsYear.overviewKPIs.research.totalFunding,
        publications: analyticsYear.overviewKPIs.research.publications,
        patents: analyticsYear.overviewKPIs.research.patents,
      },
      keyFindings: analyticsYear.managementInsights.map((ins) => `${ins.title}: ${ins.description}`),
      analyticsData: analyticsYear,
    };

    // Save to local storage history
    const currentHistory = getStoredHistory();
    const updatedHistory = [newReport, ...currentHistory];
    storage.set(STORAGE_KEY_HISTORY, updatedHistory);

    return {
      success: true,
      report: newReport,
    };
  },

  /**
   * Retrieves a generated report by its unique ID
   */
  getReportById: async (reportId) => {
    await delay(150);
    const history = getStoredHistory();
    let report = history.find((r) => r.id === reportId);

    if (!report) {
      // Check if it matches pre-seeded history or generate fallback
      const seed = MOCK_REPORT_HISTORY.find((r) => r.id === reportId);
      if (seed) {
        const analyticsYear = MOCK_ANALYTICS_DATA[seed.academicYear] || MOCK_ANALYTICS_DATA['2026-27'];
        report = {
          ...seed,
          letterhead: MOCK_COLLEGE_LETTERHEAD,
          analyticsData: analyticsYear,
        };
      } else {
        throw new Error(`Report "${reportId}" not found in system records.`);
      }
    } else if (!report.analyticsData) {
      const analyticsYear = MOCK_ANALYTICS_DATA[report.academicYear] || MOCK_ANALYTICS_DATA['2026-27'];
      report = {
        ...report,
        letterhead: MOCK_COLLEGE_LETTERHEAD,
        analyticsData: analyticsYear,
      };
    }

    return {
      success: true,
      report,
    };
  },

  /**
   * Retrieves report history with search and filter capabilities
   */
  getReportHistory: async (filters = {}) => {
    await delay(150);
    let history = getStoredHistory();

    if (filters.category && filters.category !== 'ALL') {
      history = history.filter((r) => r.category === filters.category);
    }
    if (filters.academicYear && filters.academicYear !== 'ALL') {
      history = history.filter((r) => r.academicYear === filters.academicYear);
    }
    if (filters.status && filters.status !== 'ALL') {
      history = history.filter((r) => r.status === filters.status);
    } else {
      // By default, hide ARCHIVED reports unless explicitly requested
      if (!filters.status || filters.status === 'ALL') {
        history = history.filter((r) => r.status !== 'ARCHIVED');
      }
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      history = history.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.generatedBy.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      history,
    };
  },

  /**
   * Moves a report to ARCHIVED status
   */
  archiveReport: async (reportId) => {
    await delay(120);
    const history = getStoredHistory();
    const updated = history.map((r) =>
      r.id === reportId ? { ...r, status: 'ARCHIVED' } : r
    );
    storage.set(STORAGE_KEY_HISTORY, updated);
    return { success: true };
  },

  /**
   * Retrieves favorite report IDs
   */
  getFavorites: async () => {
    return getStoredFavorites();
  },

  /**
   * Toggles a report configuration as favorite
   */
  toggleFavorite: async (configId) => {
    const favorites = getStoredFavorites();
    let updated;
    if (favorites.includes(configId)) {
      updated = favorites.filter((id) => id !== configId);
    } else {
      updated = [...favorites, configId];
    }
    storage.set(STORAGE_KEY_FAVORITES, updated);
    return updated;
  },

  /**
   * Simulates client-side CSV or text download
   */
  downloadReport: (report, format = 'CSV') => {
    if (format === 'PDF') {
      window.print();
      return;
    }

    // Generate CSV data from summary metrics
    const headers = ['Metric', 'Value', 'Academic Year', 'Scope', 'Generated Date'];
    const rows = [
      ['Report ID', report.id, report.academicYear, report.scope, report.generatedDate],
      ['Report Title', report.title, '', '', ''],
      ['Category', report.category, '', '', ''],
      ['Total Students', report.summaryMetrics?.students || '3520', '', '', ''],
      ['Total Faculty', report.summaryMetrics?.faculty || '420', '', '', ''],
      ['Pass Percentage', report.summaryMetrics?.passPercentage || '91.2%', '', '', ''],
      ['Placement Rate', report.summaryMetrics?.placementRate || '87.1%', '', '', ''],
      ['Research Funding', report.summaryMetrics?.researchFunding || '₹7.85 Cr', '', '', ''],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${report.id}_${report.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
