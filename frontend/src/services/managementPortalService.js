// Management Portal service (Stage 9).
// Institution-wide executive layer consuming authoritative Stage 2/3/4/5
// systems. Allowed roles: Technical Director (+ INSTITUTION_ADMIN alias) and
// Executive Director / Principal. Differences between the two are expressed
// through managementPortalConfig permissions, not branches in pages.

import { SUBMISSION_STATUS } from '../config/submissionStatuses';
import { EVIDENCE_STATUS } from '../config/evidenceConfig';
import {
  MANAGEMENT_PERMISSIONS, MANAGEMENT_ROLES, hasManagementPermission, managementPortalConfig,
} from '../config/managementPortalConfig';
import { storage } from '../utils/storage';
import { MOCK_DEPARTMENTS, MOCK_COORDINATORS } from '../data/mockIQAC';
import { INITIAL_DEPARTMENTS } from '../data/departments';
import { getDepartmentPortalProfile } from '../data/mockDepartmentPortal';
import { MOCK_DEANS } from '../mock/mockDeans';
import { MOCK_USERS } from '../data/mockUsers';
import { ROLES } from '../config/roles';
import { submissionService } from './submissionService';
import { evidenceService } from './evidenceService';
import { activityService } from './activityService';
import { meetingService } from './meetingService';
import { actionItemService } from './actionItemService';
import { qualityService } from './qualityService';
import { complianceService } from './complianceService';
import { accreditationService } from './accreditationService';
import { improvementPlanService } from './improvementPlanService';
import { analyticsService } from './analyticsService';
import { reportService } from './reportService';
import { aqarReportService } from './aqarReportService';
import { notificationService } from './notificationService';
import { iqacService } from './iqacService';

const MGMT_NOTIF_STORE = 'iqac_notifications_v1';
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const safeList = (value) => (Array.isArray(value) ? value : []);
const toArrayData = (res) => safeList(res?.data);
const safeCall = async (fn, fallback) => {
  try {
    return await fn();
  } catch {
    return fallback;
  }
};

const requireManagement = (user) => {
  if (!user) throw new Error('Authentication required to access the Management portal.');
  if (!MANAGEMENT_ROLES.includes(user.role)) {
    throw new Error(`Role ${user.role} is not authorized for the Management portal.`);
  }
};

const requirePerm = (user, permission) => {
  if (!hasManagementPermission(user, permission)) {
    throw new Error(`Missing required permission ${permission}.`);
  }
};

const enrichDepartment = (dept) => {
  const profile = getDepartmentPortalProfile(dept.code);
  const coordinator = MOCK_COORDINATORS.find((c) => c.departmentCode === dept.code) || null;
  const academic = INITIAL_DEPARTMENTS.find((a) => a.code === dept.code) || {};
  const deanEntry = MOCK_USERS.find((u) => u.role === ROLES.DEAN && (u.assignedDepartments || []).includes(dept.code));
  return {
    ...dept,
    hodName: profile.hodName || dept.hodName || dept.name,
    coordinatorName: profile.coordinatorName, coordinator,
    deanName: deanEntry?.name || MOCK_DEANS.find((d) => d.assignedDepartmentCodes.includes(dept.code))?.name || '—',
    qualityScore: profile.qualityScore, complianceRate: profile.complianceRate,
    accreditationReadiness: profile.accreditationReadiness,
    categories: profile.categories, criteriaReadiness: profile.criteriaReadiness, trend: profile.trend,
    passPercentage: academic.passPercentage ?? null, placementPercentage: academic.placementPercentage ?? null,
    publicationsCount: academic.publicationsCount ?? null, researchFunding: academic.researchFunding ?? null,
    facultyCount: academic.facultyCount ?? dept.staffCount, studentCount: academic.studentCount ?? dept.studentCount ?? null,
    profile,
  };
};

const isPendingReview = (s) => [SUBMISSION_STATUS.SUBMITTED, SUBMISSION_STATUS.UNDER_REVIEW, SUBMISSION_STATUS.RESUBMITTED].includes(s.status);
const isEvidencePending = (e) => [EVIDENCE_STATUS.UPLOADED, EVIDENCE_STATUS.UNDER_REVIEW, EVIDENCE_STATUS.RESUBMITTED].includes(e.status);

const statusOf = (value, good, attention) => {
  if (value >= good) return 'Good';
  if (value >= attention) return 'Attention';
  return 'Critical';
};

const buildAttention = (ctx) => {
  const t = managementPortalConfig.thresholds;
  const items = [];
  const push = (severity, area, text, link, departments = []) => {
    items.push({ id: `mgmt-${area}-${items.length}`, severity, area, text, link, departments });
  };
  if (ctx.readiness < t.readinessAttention) push('critical', 'Accreditation', `Institutional accreditation readiness ${ctx.readiness}% below target ${t.readinessAttention}%.`, '/management/accreditation');
  else if (ctx.readiness < t.readinessGood) push('high', 'Accreditation', `Accreditation readiness ${ctx.readiness}% needs improvement.`, '/management/accreditation');
  if (ctx.overdueCompliance > 0) push('high', 'Compliance', `${ctx.overdueCompliance} compliance item(s) overdue.`, '/management/compliance');
  if (ctx.evidenceCompleteness < t.evidenceCompletenessAlert) push('high', 'Evidence', `Evidence completeness ${ctx.evidenceCompleteness}% below target.`, '/management/evidence');
  if (ctx.overdueActions > t.overdueActionAlert) push('critical', 'Actions', `${ctx.overdueActions} action items overdue (threshold ${t.overdueActionAlert}).`, '/management/action-items');
  else if (ctx.overdueActions > 0) push('medium', 'Actions', `${ctx.overdueActions} action item(s) overdue.`, '/management/action-items');
  if (ctx.pendingReviews > t.pendingReviewAlert) push('medium', 'Submissions', `${ctx.pendingReviews} submissions pending review institution-wide.`, '/management/submissions');
  ctx.criticalDepts.forEach((d) => push('medium', 'Departments', `${d.code} requires attention (quality ${d.qualityScore}%, compliance ${d.complianceRate}%).`, `/management/departments/${d.id}`, [d.code]));
  if (ctx.atRiskPlans > 0) push('medium', 'Improvement', `${ctx.atRiskPlans} improvement plan(s) at risk.`, '/management/improvement-plans');
  return items;
};

const collectInstitutionData = async (user, academicYear) => {
  const [subRes, evRes, actionRes, missingRes, planRes, compRes, gapRes] = await Promise.all([
    safeCall(() => submissionService.getSubmissions({ academicYear }, user), { data: [], stats: {} }),
    safeCall(() => evidenceService.getEvidence({ academicYear }, user), { data: [], stats: {} }),
    safeCall(() => actionItemService.getActionItems({}, user), { data: [] }),
    safeCall(() => evidenceService.getMissingEvidence(user), { data: [] }),
    safeCall(() => improvementPlanService.getImprovementPlans({}, user), { data: [] }),
    safeCall(() => complianceService.getComplianceRecords({}, user), { data: [] }),
    safeCall(() => accreditationService.getAccreditationGaps({}, user), { data: [] }),
  ]);
  return {
    submissions: toArrayData(subRes), subStats: subRes?.stats || {},
    evidence: toArrayData(evRes), evStats: evRes?.stats || {},
    actions: toArrayData(actionRes), missing: toArrayData(missingRes),
    plans: toArrayData(planRes), compliance: toArrayData(compRes), gaps: toArrayData(gapRes),
  };
};

export const managementPortalService = {
  getManagementProfile: async (user) => {
    await delay();
    requireManagement(user);
    const depts = MOCK_DEPARTMENTS.length;
    return {
      success: true,
      data: {
        id: user.id, name: user.name, email: user.email, role: user.role,
        scope: 'INSTITUTION_WIDE', departments: depts,
      },
    };
  },

  getInstitutionOverview: async (user, academicYear = '2026-27') => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_INSTITUTION_VIEW);
    const depts = MOCK_DEPARTMENTS.map(enrichDepartment);
    const d = await collectInstitutionData(user, academicYear);
    const pendingReviews = d.subStats.pendingReview ?? d.submissions.filter(isPendingReview).length;
    const verified = d.subStats.verified ?? d.submissions.filter((s) => s.status === SUBMISSION_STATUS.VERIFIED).length;
    const evPending = d.evStats.pending ?? d.evidence.filter(isEvidencePending).length;
    const evVerified = d.evStats.verified ?? d.evidence.filter((e) => e.status === EVIDENCE_STATUS.VERIFIED).length;
    const required = d.evidence.length + d.missing.length;
    const completeness = required > 0 ? Math.round((evVerified / required) * 100) : 100;
    const openActions = d.actions.filter((a) => ['OPEN', 'IN_PROGRESS', 'OVERDUE'].includes(a.status)).length;
    const overdueActions = d.actions.filter((a) => a.status === 'OVERDUE').length;
    const overdueCompliance = d.compliance.filter((c) => c.status === 'OVERDUE').length;
    const avg = (fn) => depts.length > 0 ? Math.round(depts.reduce((a, x) => a + (fn(x) || 0), 0) / depts.length) : 0;
    const quality = avg((x) => x.qualityScore);
    const complianceRate = avg((x) => x.complianceRate);
    const readiness = avg((x) => x.accreditationReadiness);
    const atRiskPlans = d.plans.filter((p) => ['AT_RISK', 'OVERDUE'].includes(p.status)).length;
    const criticalDepts = depts.filter((x) => x.qualityScore < managementPortalConfig.thresholds.qualityAttention || x.complianceRate < managementPortalConfig.thresholds.complianceAttention);
    const attention = buildAttention({ readiness, overdueCompliance, evidenceCompleteness: completeness, overdueActions, pendingReviews, criticalDepts, atRiskPlans });

    const kpis = {
      totalDepartments: depts.length,
      totalStudents: depts.reduce((a, x) => a + (x.studentCount || 0), 0),
      totalFaculty: depts.reduce((a, x) => a + (x.facultyCount || x.staffCount || 0), 0),
      qualityScore: quality, complianceRate, accreditationReadiness: readiness,
      pendingReviews, evidencePending: evPending, evidenceCompleteness: completeness,
      verifiedRecords: verified, openActions, overdueActions,
      activeImprovementPlans: d.plans.filter((p) => !['COMPLETED', 'CANCELLED'].includes(p.status)).length,
    };

    const t = managementPortalConfig.thresholds;
    const executiveSummary = {
      quality: statusOf(quality, t.qualityGood, t.qualityAttention),
      compliance: statusOf(complianceRate, t.complianceGood, t.complianceAttention),
      accreditation: statusOf(readiness, t.readinessGood, t.readinessAttention),
      operational: overdueActions > t.overdueActionAlert || pendingReviews > t.pendingReviewAlert ? 'Attention' : 'Good',
      criticalActions: overdueActions,
      departmentsAttention: criticalDepts.length,
    };

    return {
      success: true,
      data: {
        kpis, executiveSummary, attention,
        departments: depts.map((x) => ({ id: x.id, code: x.code, name: x.name })),
        criticalDepartments: criticalDepts.map((x) => x.code),
        qualityTrend: managementPortalConfig.qualityTrendLabels.map((year, i) => ({
          year,
          score: depts.length > 0 ? Math.round(depts.reduce((a, x) => a + ((x.trend || [])[(x.trend || []).length - 3 + i] ?? 0), 0) / depts.length) : 0,
        })),
      },
    };
  },

  getInstitutionKpis: async (user, academicYear) => {
    const res = await managementPortalService.getInstitutionOverview(user, academicYear);
    return { success: true, data: res.data.kpis };
  },

  getExecutiveSummary: async (user, academicYear) => {
    const res = await managementPortalService.getInstitutionOverview(user, academicYear);
    return { success: true, data: { summary: res.data.executiveSummary, attention: res.data.attention } };
  },

  getManagementAttentionItems: async (user, academicYear) => {
    const res = await managementPortalService.getInstitutionOverview(user, academicYear);
    return { success: true, data: res.data.attention };
  },

  getDepartmentOverview: async (user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_DEPARTMENT_VIEW);
    await delay();
    const depts = MOCK_DEPARTMENTS.map(enrichDepartment);
    const d = await collectInstitutionData(user);
    return {
      success: true,
      data: depts.map((dept) => {
        const subs = d.submissions.filter((s) => s.departmentCode === dept.code);
        const evs = d.evidence.filter((e) => e.departmentCode === dept.code);
        return {
          id: dept.id, code: dept.code, name: dept.name,
          hodName: dept.hodName, coordinatorName: dept.coordinatorName, deanName: dept.deanName,
          staffCount: dept.staffCount, studentCount: dept.studentCount,
          qualityScore: dept.qualityScore, complianceRate: dept.complianceRate,
          accreditationReadiness: dept.accreditationReadiness,
          pendingReviews: subs.filter(isPendingReview).length,
          evidencePending: evs.filter(isEvidencePending).length,
          openActions: d.actions.filter((a) => (a.departmentCode || a.deptCode) === dept.code && ['OPEN', 'IN_PROGRESS', 'OVERDUE'].includes(a.status)).length,
          status: dept.qualityScore < managementPortalConfig.thresholds.qualityAttention || dept.complianceRate < managementPortalConfig.thresholds.complianceAttention ? 'Attention' : 'Good',
        };
      }),
    };
  },

  getDepartmentDetails: async (departmentIdOrCode, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_DEPARTMENT_DETAILS_VIEW);
    const dept = MOCK_DEPARTMENTS.find((x) => x.id === departmentIdOrCode || x.code === departmentIdOrCode);
    if (!dept) throw new Error('Department not found.');
    const enriched = enrichDepartment(dept);
    const d = await collectInstitutionData(user);
    const inDept = (r) => (r.departmentCode || r.deptCode) === enriched.code;
    const submissions = d.submissions.filter((s) => s.departmentCode === enriched.code);
    return {
      success: true,
      data: {
        department: enriched,
        academic: { passPercentage: enriched.passPercentage, placementPercentage: enriched.placementPercentage, facultyCount: enriched.facultyCount, studentCount: enriched.studentCount },
        research: { publications: enriched.publicationsCount, funding: enriched.researchFunding },
        quality: { score: enriched.qualityScore, categories: enriched.categories, trend: enriched.trend },
        compliance: { rate: enriched.complianceRate, records: d.compliance.filter(inDept) },
        accreditation: { readiness: enriched.accreditationReadiness, criteria: enriched.criteriaReadiness, gaps: d.gaps.filter(inDept) },
        operations: {
          submissions: submissions.slice(0, 20), pendingCount: submissions.filter(isPendingReview).length,
          evidencePending: d.evidence.filter((e) => e.departmentCode === enriched.code && isEvidencePending(e)).length,
          activities: toArrayData(await safeCall(() => activityService.getActivities({}, user), { data: [] })).filter(inDept).slice(0, 10),
          meetings: toArrayData(await safeCall(() => meetingService.getMeetings({}, user), { data: [] })).filter(inDept).slice(0, 10),
          actionItems: d.actions.filter(inDept).slice(0, 20),
        },
      },
    };
  },

  getDepartmentComparison: async (user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_COMPARISON_VIEW);
    const depts = MOCK_DEPARTMENTS.map(enrichDepartment);
    const d = await collectInstitutionData(user);
    return {
      success: true,
      data: depts.map((x) => {
        const subs = d.submissions.filter((s) => s.departmentCode === x.code);
        const evs = d.evidence.filter((e) => e.departmentCode === x.code);
        const evVerified = evs.filter((e) => e.status === EVIDENCE_STATUS.VERIFIED).length;
        return {
          id: x.id, code: x.code, name: x.name,
          staff: x.staffCount, students: x.studentCount,
          passPercentage: x.passPercentage, placementPercentage: x.placementPercentage,
          publications: x.publicationsCount, researchFunding: x.researchFunding,
          submissionCompletion: subs.length > 0 ? Math.round((subs.filter((s) => [SUBMISSION_STATUS.VERIFIED, SUBMISSION_STATUS.APPROVED].includes(s.status)).length / subs.length) * 100) : null,
          evidenceCompleteness: evs.length > 0 ? Math.round((evVerified / evs.length) * 100) : 100,
          quality: x.qualityScore, compliance: x.complianceRate, readiness: x.accreditationReadiness,
          openActions: d.actions.filter((a) => (a.departmentCode || a.deptCode) === x.code && ['OPEN', 'IN_PROGRESS', 'OVERDUE'].includes(a.status)).length,
          categories: x.categories, criteria: x.criteriaReadiness, trend: x.trend,
        };
      }),
    };
  },

  // ---- Analytics (Stage 3 reuse) ----
  getAnalytics: async (pillar, academicYear = '2026-27', filters = {}, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_ANALYTICS_VIEW);
    const dispatch = {
      academic: () => analyticsService.getAcademicAnalytics(academicYear, filters),
      faculty: () => analyticsService.getFacultyAnalytics(academicYear, filters),
      student: () => analyticsService.getStudentAnalytics(academicYear, filters),
      research: () => analyticsService.getResearchAnalytics(academicYear, filters),
      publication: () => analyticsService.getPublicationAnalytics(academicYear, filters),
      placement: () => analyticsService.getPlacementAnalytics(academicYear, filters),
      overview: () => analyticsService.getAnalyticsOverview(academicYear, filters),
    };
    const fn = dispatch[pillar];
    if (!fn) throw new Error(`Unknown analytics pillar '${pillar}'.`);
    return fn();
  },

  // ---- Quality / Compliance / Accreditation (Stage 5F-5G reuse) ----
  getQualityOverview: async (user, academicYear = '2026-27') => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_QUALITY_VIEW);
    const depts = MOCK_DEPARTMENTS.map(enrichDepartment);
    const summary = await safeCall(() => qualityService.getQualitySummary(user, academicYear), null);
    const indicators = await safeCall(() => qualityService.getQualityIndicators({}, user), { data: [] });
    const avg = (fn) => depts.length > 0 ? Math.round(depts.reduce((a, x) => a + (fn(x) || 0), 0) / depts.length) : 0;
    const categoryNames = Object.keys(depts[0]?.categories || {});
    return {
      success: true,
      data: {
        institutionalScore: avg((x) => x.qualityScore),
        categories: categoryNames.map((c) => ({ name: c, score: avg((x) => (x.categories || {})[c]) })),
        departments: depts.map((x) => ({ id: x.id, code: x.code, name: x.name, score: x.qualityScore, categories: x.categories, trend: x.trend })),
        summary: summary?.data || summary || null,
        indicators: toArrayData(indicators),
        trendLabels: managementPortalConfig.qualityTrendLabels,
      },
    };
  },

  getComplianceOverview: async (user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_COMPLIANCE_VIEW);
    const depts = MOCK_DEPARTMENTS.map(enrichDepartment);
    const records = await safeCall(() => complianceService.getComplianceRecords({}, user), { data: [] });
    const all = toArrayData(records);
    const byStatus = (s) => all.filter((r) => r.status === s).length;
    return {
      success: true,
      data: {
        institutionalRate: depts.length > 0 ? Math.round(depts.reduce((a, x) => a + (x.complianceRate || 0), 0) / depts.length) : 0,
        byStatus: {
          compliant: byStatus('COMPLIANT'), partial: byStatus('PARTIALLY_COMPLIANT'),
          underReview: byStatus('UNDER_REVIEW'), pending: byStatus('PENDING'),
          overdue: byStatus('OVERDUE'), notApplicable: byStatus('NOT_APPLICABLE'),
        },
        departments: depts.map((x) => {
          const recs = all.filter((r) => (r.departmentCode || r.deptCode) === x.code);
          return {
            id: x.id, code: x.code, name: x.name, complianceRate: x.complianceRate,
            pending: recs.filter((r) => ['PENDING', 'IN_PROGRESS', 'UNDER_REVIEW'].includes(r.status)).length,
            overdue: recs.filter((r) => r.status === 'OVERDUE').length, records: recs,
          };
        }),
      },
    };
  },

  getAccreditationOverview: async (user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_ACCREDITATION_VIEW);
    const depts = MOCK_DEPARTMENTS.map(enrichDepartment);
    const gaps = await safeCall(() => accreditationService.getAccreditationGaps({}, user), { data: [] });
    const all = toArrayData(gaps);
    const criteriaAverages = {};
    for (let c = 1; c <= 7; c += 1) {
      criteriaAverages[c] = depts.length > 0
        ? Math.round(depts.reduce((a, x) => a + (((x.criteriaReadiness || {})[c]) ?? 0), 0) / depts.length)
        : 0;
    }
    return {
      success: true,
      data: {
        institutionalReadiness: depts.length > 0 ? Math.round(depts.reduce((a, x) => a + (x.accreditationReadiness || 0), 0) / depts.length) : 0,
        criteria: criteriaAverages,
        departments: depts.map((x) => ({
          id: x.id, code: x.code, name: x.name,
          readiness: x.accreditationReadiness, criteria: x.criteriaReadiness,
          gaps: all.filter((g) => (g.departmentCode || g.deptCode) === x.code),
        })),
        gaps: all,
      },
    };
  },

  // ---- Operations monitoring (read; comment only where permitted) ----
  getSubmissionOverview: async (filters = {}, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_SUBMISSION_VIEW);
    return submissionService.getSubmissions(filters, user);
  },

  commentManagementSubmission: async (id, comment, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_SUBMISSION_COMMENT);
    if (!comment || !comment.trim()) throw new Error('A comment is required.');
    const current = await submissionService.getSubmissionById(id, user);
    iqacService.logAuditRecord({
      actorId: user.id, actorName: user.name, actorRole: user.role,
      action: 'MANAGEMENT_COMMENT', targetId: current.data.id,
      departmentId: current.data.departmentId, timestamp: new Date().toISOString(),
      reason: `SUBMISSION: ${comment}`,
    });
    return { success: true, message: 'Management comment recorded.', data: current.data };
  },

  getEvidenceOverview: async (filters = {}, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_EVIDENCE_VIEW);
    const [evRes, missingRes] = await Promise.all([
      evidenceService.getEvidence(filters, user),
      safeCall(() => evidenceService.getMissingEvidence(user), { data: [] }),
    ]);
    return { ...evRes, missing: toArrayData(missingRes) };
  },

  getActivitiesOverview: async (filters = {}, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_ACTIVITY_VIEW);
    return safeCall(() => activityService.getActivities(filters, user), { success: true, data: [] });
  },

  getMeetingsOverview: async (filters = {}, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_MEETING_VIEW);
    return safeCall(() => meetingService.getMeetings(filters, user), { success: true, data: [] });
  },

  getActionItemsOverview: async (filters = {}, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_ACTION_VIEW);
    return safeCall(() => actionItemService.getActionItems(filters, user), { success: true, data: [] });
  },

  getImprovementPlans: async (filters = {}, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_IMPROVEMENT_VIEW);
    return safeCall(() => improvementPlanService.getImprovementPlans(filters, user), { success: true, data: [] });
  },

  // ---- Reports / AQAR (view; workflow stays with authorized roles) ----
  getManagementReports: async (user, filters = {}) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_REPORT_VIEW);
    const [types, history] = await Promise.all([
      safeCall(() => reportService.getReportTypes(), []),
      safeCall(() => reportService.getReportHistory(filters), { data: [] }),
    ]);
    return { success: true, data: { types: types || [], history: history?.data || history || [] } };
  },

  generateManagementReport: async (payload = {}, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_REPORT_VIEW);
    const res = await reportService.generateReport({
      reportConfigId: payload.reportConfigId,
      academicYear: payload.academicYear || '2026-27',
      scope: payload.department && payload.department !== 'ALL' ? 'DEPARTMENT' : 'INSTITUTION',
      department: payload.department || 'ALL',
      format: payload.format || 'PDF',
      user,
    });
    iqacService.logAuditRecord({
      actorId: user.id, actorName: user.name, actorRole: user.role,
      action: 'MANAGEMENT_GENERATE_REPORT', targetId: res.report?.id,
      departmentId: payload.department || 'INSTITUTION', timestamp: new Date().toISOString(),
      reason: `REPORT: ${res.report?.title || ''}`,
    });
    return res;
  },

  getAQARStatus: async (user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_AQAR_VIEW);
    const reports = await safeCall(() => aqarReportService.getAQARReports({}, user), { data: [] });
    const accr = await managementPortalService.getAccreditationOverview(user);
    return {
      success: true,
      data: {
        reports: toArrayData(reports).slice(0, 10),
        institutionalReadiness: accr.data.institutionalReadiness,
        criteria: accr.data.criteria,
      },
    };
  },

  // ---- Audit (read-only) ----
  getAuditRecords: async (filters = {}, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_AUDIT_VIEW);
    const res = await safeCall(() => iqacService.getAuditLogs(), { data: [] });
    let logs = toArrayData(res);
    const { search, role, department, action, date } = filters;
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      logs = logs.filter((l) => [l.actorName, l.action, l.targetId, l.reason].filter(Boolean).join(' ').toLowerCase().includes(q));
    }
    if (role && role !== 'ALL') logs = logs.filter((l) => l.actorRole === role);
    if (department && department !== 'ALL') logs = logs.filter((l) => l.departmentId === department);
    if (action && action !== 'ALL') logs = logs.filter((l) => (l.action || '').includes(action));
    if (date && date.trim()) logs = logs.filter((l) => (l.timestamp || '').includes(date.trim()));
    return { success: true, data: logs };
  },

  // ---- Notifications (existing store reuse) ----
  getManagementNotifications: async (user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_NOTIFICATION_VIEW);
    return notificationService.getNotifications();
  },

  sendManagementNotification: async (payload = {}, user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_NOTIFICATION_SEND);
    if (!payload.title || !payload.title.trim() || !payload.message || !payload.message.trim()) {
      throw new Error('Title and message are required.');
    }
    const store = storage.get(MGMT_NOTIF_STORE) || [];
    const item = {
      id: `notif_${Date.now()}`,
      senderId: user.id, senderName: user.name, senderRole: user.role,
      departmentCode: 'INSTITUTION', recipientScope: payload.recipientScope || 'ALL_DEPARTMENTS',
      title: payload.title, message: payload.message,
      priority: payload.priority || 'MEDIUM', createdAt: new Date().toLocaleString(), status: 'SENT',
    };
    storage.set(MGMT_NOTIF_STORE, [item, ...store]);
    iqacService.logAuditRecord({
      actorId: user.id, actorName: user.name, actorRole: user.role,
      action: 'MANAGEMENT_SEND_NOTIFICATION', targetId: item.id,
      departmentId: 'INSTITUTION', timestamp: new Date().toISOString(),
      reason: `NOTIFICATION: ${payload.title}`,
    });
    return { success: true, message: 'Management notification broadcasted.', data: item };
  },

  // ---- Dean roster (TD assignment management; Principal view-only) ----
  getDeanRoster: async (user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.DEAN_MANAGEMENT_VIEW);
    await delay();
    return {
      success: true,
      data: MOCK_DEANS.map((d) => {
        const login = MOCK_USERS.find((u) => u.email === d.email);
        const codes = login?.assignedDepartments || d.assignedDepartmentCodes;
        return { ...d, assignedDepartmentCodes: codes, assignedCount: codes.length, status: login?.status || d.status };
      }),
    };
  },

  updateDeanAssignment: async ({ deanEmail, departmentCodes }, user) => {
    requireManagement(user);
    // TD-only: no fallback mapping exists for this permission, and only the
    // Technical Director baseline grants it.
    if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.DEAN_ASSIGNMENT_MANAGE)) {
      throw new Error('Dean assignment management is restricted to the Technical Director.');
    }
    const validCodes = MOCK_DEPARTMENTS.map((d) => d.code);
    const invalid = (departmentCodes || []).filter((c) => !validCodes.includes(c));
    if (invalid.length > 0) throw new Error(`Unknown departments: ${invalid.join(', ')}.`);
    const login = MOCK_USERS.find((u) => u.email === deanEmail && u.role === ROLES.DEAN);
    if (!login) throw new Error('Dean user not found.');
    const previous = [...(login.assignedDepartments || [])];
    login.assignedDepartments = [...(departmentCodes || [])];
    const mockDean = MOCK_DEANS.find((d) => d.email === deanEmail);
    if (mockDean) mockDean.assignedDepartmentCodes = [...(departmentCodes || [])];
    iqacService.logAuditRecord({
      actorId: user.id, actorName: user.name, actorRole: user.role,
      action: 'DEAN_ASSIGNMENT_UPDATE', targetId: login.id,
      departmentId: (departmentCodes || []).join(','), timestamp: new Date().toISOString(),
      reason: `DEAN_ASSIGNMENT: ${login.name}`,
      previousState: previous.join(','), newState: (departmentCodes || []).join(','),
    });
    return { success: true, message: `Dean assignment updated for ${login.name}.`, data: login };
  },

  getManagementSettings: async (user) => {
    requireManagement(user);
    requirePerm(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_SETTINGS_VIEW);
    await delay();
    return {
      success: true,
      data: {
        thresholds: managementPortalConfig.thresholds,
        permissions: managementPortalConfig.permissions,
        note: 'Read-only configuration snapshot. Changes require authorized technical workflows.',
      },
    };
  },
};
