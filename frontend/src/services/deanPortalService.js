// Dean Portal service (Stage 8).
// Multi-department monitoring layer over existing institutional systems.
// Every method enforces Dean scope: assigned departments only, resolved from
// the authenticated user (assignedDepartments) — never from route params
// alone. Delegates to Stage 4/5/6 services; creates no parallel data systems.

import { ROLES } from '../config/roles';
import { SUBMISSION_STATUS } from '../config/submissionStatuses';
import { EVIDENCE_STATUS } from '../config/evidenceConfig';
import { DEAN_PERMISSIONS, hasDeanPermission, deanPortalConfig } from '../config/deanPortalConfig';
import { storage } from '../utils/storage';
import {
  MOCK_DEPARTMENTS,
  MOCK_COORDINATORS,
  MOCK_RECENT_ACTIVITIES,
} from '../data/mockIQAC';
import { INITIAL_DEPARTMENTS } from '../data/departments';
import { getDepartmentPortalProfile } from '../data/mockDepartmentPortal';
import { resolveDeanAssignments } from '../mock/mockDeans';
import { submissionService } from './submissionService';
import { evidenceService } from './evidenceService';
import { activityService } from './activityService';
import { meetingService } from './meetingService';
import { actionItemService } from './actionItemService';
import { qualityService } from './qualityService';
import { complianceService } from './complianceService';
import { accreditationService } from './accreditationService';
import { improvementPlanService } from './improvementPlanService';
import { iqacService } from './iqacService';
import { reportService } from './reportService';
import { aqarReportService } from './aqarReportService';

const PREFS_KEY = 'excel_iqac_dean_preferences';
const DEAN_NOTIF_STORE = 'iqac_notifications_v1';
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

const requireDean = (user) => {
  if (!user) throw new Error('Authentication required to access the Dean portal.');
  if (user.role !== ROLES.DEAN) {
    throw new Error(`Role ${user.role} is not authorized for the Dean portal.`);
  }
};

const requirePerm = (user, permission) => {
  if (!hasDeanPermission(user, permission)) {
    throw new Error(`Missing required permission ${permission}.`);
  }
};

const assignedCodes = (user) => resolveDeanAssignments(user);

const enrichDepartment = (dept) => {
  const profile = getDepartmentPortalProfile(dept.code);
  const coordinator = MOCK_COORDINATORS.find((c) => c.departmentCode === dept.code) || null;
  const academic = INITIAL_DEPARTMENTS.find((a) => a.code === dept.code) || {};
  return {
    ...dept,
    hodName: profile.hodName || dept.hodName || dept.name,
    coordinatorName: profile.coordinatorName,
    coordinatorEmail: profile.coordinatorEmail,
    coordinator,
    qualityScore: profile.qualityScore,
    complianceRate: profile.complianceRate,
    accreditationReadiness: profile.accreditationReadiness,
    categories: profile.categories,
    criteriaReadiness: profile.criteriaReadiness,
    trend: profile.trend,
    scenario: profile.scenario,
    passPercentage: academic.passPercentage ?? null,
    placementPercentage: academic.placementPercentage ?? null,
    publicationsCount: academic.publicationsCount ?? null,
    researchFunding: academic.researchFunding ?? null,
    facultyCount: academic.facultyCount ?? dept.staffCount,
    studentCount: academic.studentCount ?? dept.studentCount ?? null,
    profile,
  };
};

const getAssignedDepartments = (user) => {
  const codes = assignedCodes(user);
  return MOCK_DEPARTMENTS.filter((d) => codes.includes(d.code) || codes.includes(d.id)).map(enrichDepartment);
};

// Scope gate for a department id/code coming from a route parameter.
const resolveScopedDepartment = (user, departmentIdOrCode) => {
  const codes = assignedCodes(user);
  const dept = MOCK_DEPARTMENTS.find(
    (d) => d.id === departmentIdOrCode || d.code === departmentIdOrCode,
  );
  if (!dept || (!codes.includes(dept.code) && !codes.includes(dept.id))) {
    throw new Error('Access denied: department is outside your assigned scope.');
  }
  return enrichDepartment(dept);
};

// Scope gate for records carrying departmentCode/departmentId.
const assertRecordScope = (user, record) => {
  if (!record) throw new Error('Record not found.');
  const codes = assignedCodes(user);
  const dept = MOCK_DEPARTMENTS.find(
    (d) => d.code === record.departmentCode || d.id === record.departmentId
      || d.id === record.departmentCode || d.code === record.departmentId,
  );
  const code = dept ? dept.code : record.departmentCode;
  if (!code || !codes.includes(code)) {
    throw new Error('Access denied: record belongs to a department outside your assigned scope.');
  }
  return dept ? enrichDepartment(dept) : null;
};

// Validate a multi-department selection against the assigned scope.
const resolveSelection = (user, selection) => {
  const codes = assignedCodes(user);
  if (!selection || selection.length === 0) return codes;
  const invalid = selection.filter((c) => !codes.includes(c));
  if (invalid.length > 0) {
    throw new Error(`Departments outside your scope cannot be selected: ${invalid.join(', ')}.`);
  }
  return selection;
};

const isPendingReview = (s) => [SUBMISSION_STATUS.SUBMITTED, SUBMISSION_STATUS.UNDER_REVIEW, SUBMISSION_STATUS.RESUBMITTED].includes(s.status);
const isEvidencePending = (e) => [EVIDENCE_STATUS.UPLOADED, EVIDENCE_STATUS.UNDER_REVIEW, EVIDENCE_STATUS.RESUBMITTED].includes(e.status);
const isOpenAction = (a) => ['OPEN', 'IN_PROGRESS', 'OVERDUE'].includes(a.status);

const logDeanAudit = (user, action, entityType, entityId, departmentId, reason, previousState = null, newState = null) => {
  iqacService.logAuditRecord({
    actorId: user.id, actorName: user.name, actorRole: user.role,
    action, targetId: entityId, departmentId,
    timestamp: new Date().toISOString(),
    reason: `${entityType}: ${reason || ''}`,
    previousState, newState,
  });
};

const pushScopedNotification = (user, { departmentCode, title, message, priority = 'MEDIUM', recipientScope = 'DEPARTMENT_STAFF', dueDate = null }) => {
  const store = storage.get(DEAN_NOTIF_STORE) || [];
  const item = {
    id: `notif_${Date.now()}`,
    senderId: user.id, senderName: user.name, senderRole: user.role,
    departmentCode, recipientScope, title, message, priority, dueDate,
    createdAt: new Date().toLocaleString(), status: 'SENT',
  };
  storage.set(DEAN_NOTIF_STORE, [item, ...store]);
  return item;
};

const summarizeDepartment = (dept, submissions, evidence, missing, actions, plans) => {
  const subs = submissions.filter((s) => s.departmentCode === dept.code);
  const evs = evidence.filter((e) => e.departmentCode === dept.code);
  const miss = missing.filter((m) => m.departmentCode === dept.code);
  const acts = actions.filter((a) => (a.departmentCode || a.deptCode) === dept.code);
  const deptPlans = plans.filter((p) => (p.departmentCode || p.deptCode) === dept.code);
  const pending = subs.filter(isPendingReview).length;
  const returned = subs.filter((s) => s.status === SUBMISSION_STATUS.RETURNED).length;
  const verified = subs.filter((s) => s.status === SUBMISSION_STATUS.VERIFIED).length;
  const evPending = evs.filter(isEvidencePending).length;
  const evVerified = evs.filter((e) => e.status === EVIDENCE_STATUS.VERIFIED).length;
  const required = evs.length + miss.length;
  const completeness = required > 0 ? Math.round((evVerified / required) * 100) : 100;
  const open = acts.filter(isOpenAction).length;
  const overdue = acts.filter((a) => a.status === 'OVERDUE').length;
  const atRisk = deptPlans.filter((p) => ['AT_RISK', 'OVERDUE'].includes(p.status)).length;

  const attention = [];
  const t = deanPortalConfig.thresholds;
  if (pending >= t.pendingReviewAlert) attention.push({ severity: 'warning', text: `${pending} submissions pending review` });
  if (completeness < t.evidenceCompletenessAlert) attention.push({ severity: 'warning', text: `Evidence completeness ${completeness}% (target ${t.evidenceCompletenessAlert}%)` });
  if (overdue > 0) attention.push({ severity: 'critical', text: `${overdue} action item(s) overdue` });
  if (dept.complianceRate < t.complianceAlert) attention.push({ severity: 'critical', text: `Compliance ${dept.complianceRate}% below target` });
  const weakCriteria = Object.entries(dept.criteriaReadiness || {}).filter(([, v]) => v < t.criterionReadinessAlert).map(([k]) => k);
  if (weakCriteria.length > 0) attention.push({ severity: 'critical', text: `Criteria ${weakCriteria.join(', ')} below readiness target` });
  if (atRisk > 0) attention.push({ severity: 'warning', text: `${atRisk} improvement plan(s) at risk` });

  return {
    department: { id: dept.id, code: dept.code, name: dept.name },
    staffCount: dept.staffCount,
    studentCount: dept.studentCount,
    pendingReviews: pending, returned, verified,
    evidencePending: evPending, evidenceVerified: evVerified,
    evidenceRequired: required, evidenceMissing: miss.length, evidenceCompleteness: completeness,
    openActions: open, overdueActions: overdue,
    qualityScore: dept.qualityScore, complianceRate: dept.complianceRate,
    accreditationReadiness: dept.accreditationReadiness,
    status: attention.some((a) => a.severity === 'critical') ? 'ATTENTION_REQUIRED' : pending > 0 || attention.length > 0 ? 'MONITOR' : 'ON_TRACK',
    attention,
  };
};

export const deanPortalService = {
  getPreferences: () => storage.get(PREFS_KEY, {}),
  savePreferences: (prefs) => storage.set(PREFS_KEY, prefs || {}),

  getDeanProfile: async (user) => {
    await delay();
    requireDean(user);
    const codes = assignedCodes(user);
    return {
      success: true,
      data: {
        id: user.id, name: user.name, email: user.email,
        title: user.designation || 'Dean',
        assignedDepartmentCodes: codes,
        assignedCount: codes.length,
      },
    };
  },

  getAssignedDepartments: async (user) => {
    await delay();
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_DEPARTMENT_VIEW);
    return { success: true, data: getAssignedDepartments(user) };
  },

  getDepartmentSummary: async (user, selection) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_DEPARTMENT_VIEW);
    const codes = resolveSelection(user, selection);
    const depts = getAssignedDepartments(user).filter((d) => codes.includes(d.code));
    const [subRes, evRes, actionRes, missingRes, planRes] = await Promise.all([
      safeCall(() => submissionService.getSubmissions({}, user), { data: [] }),
      safeCall(() => evidenceService.getEvidence({}, user), { data: [] }),
      safeCall(() => actionItemService.getActionItems({}, user), { data: [] }),
      safeCall(() => evidenceService.getMissingEvidence(user), { data: [] }),
      safeCall(() => improvementPlanService.getImprovementPlans({}, user), { data: [] }),
    ]);
    const data = depts.map((d) => summarizeDepartment(d, toArrayData(subRes), toArrayData(evRes), toArrayData(missingRes), toArrayData(actionRes), toArrayData(planRes)));
    return { success: true, data };
  },

  getDeanDashboard: async (user, academicYear = '2026-27', selection) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_DASHBOARD_VIEW);
    const codes = resolveSelection(user, selection);
    const depts = getAssignedDepartments(user).filter((d) => codes.includes(d.code));
    const [subRes, evRes, actionRes, missingRes, planRes] = await Promise.all([
      safeCall(() => submissionService.getSubmissions({ academicYear }, user), { data: [] }),
      safeCall(() => evidenceService.getEvidence({ academicYear }, user), { data: [] }),
      safeCall(() => actionItemService.getActionItems({}, user), { data: [] }),
      safeCall(() => evidenceService.getMissingEvidence(user), { data: [] }),
      safeCall(() => improvementPlanService.getImprovementPlans({}, user), { data: [] }),
    ]);
    const submissions = toArrayData(subRes).filter((s) => codes.includes(s.departmentCode));
    const evidence = toArrayData(evRes).filter((e) => codes.includes(e.departmentCode));
    const summaries = depts.map((d) => summarizeDepartment(d, submissions, evidence, toArrayData(missingRes), toArrayData(actionRes), toArrayData(planRes)));

    const sum = (fn) => summaries.reduce((a, s) => a + fn(s), 0);
    const avg = (fn) => summaries.length > 0 ? Math.round(sum(fn) / summaries.length) : 0;
    const kpis = {
      assignedDepartments: depts.length,
      totalStaff: depts.reduce((a, d) => a + (d.staffCount || 0), 0),
      pendingReviews: sum((s) => s.pendingReviews),
      evidencePending: sum((s) => s.evidencePending),
      openActions: sum((s) => s.openActions),
      overdueActions: sum((s) => s.overdueActions),
      complianceRate: avg((s) => s.complianceRate),
      accreditationReadiness: avg((s) => s.accreditationReadiness),
      qualityScore: avg((s) => s.qualityScore),
    };

    const attention = [];
    summaries.forEach((s) => {
      s.attention.forEach((a, i) => {
        attention.push({ id: `att-${s.department.code}-${i}`, departmentCode: s.department.code, departmentName: s.department.name, severity: a.severity, text: a.text, link: `/dean/departments/${s.department.id}` });
      });
    });

    const labels = deanPortalConfig.qualityTrendLabels;
    const qualityTrend = labels.map((year, i) => {
      const row = { year };
      depts.forEach((d) => { row[d.code] = (d.trend || [])[(d.trend || []).length - labels.length + i] ?? null; });
      row.average = depts.length > 0
        ? Math.round(depts.reduce((a, d) => a + (((d.trend || [])[(d.trend || []).length - labels.length + i]) ?? 0), 0) / depts.length)
        : 0;
      return row;
    });

    return {
      success: true,
      data: {
        departments: depts.map((d) => ({ id: d.id, code: d.code, name: d.name })),
        selectedDepartments: codes,
        kpis, summaries, attention, qualityTrend,
        recentActivity: MOCK_RECENT_ACTIVITIES.filter((a) => codes.includes(a.departmentCode)).slice(0, 8),
      },
    };
  },

  getDepartmentDetails: async (departmentIdOrCode, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_DEPARTMENT_DETAILS_VIEW);
    const dept = resolveScopedDepartment(user, departmentIdOrCode);
    const [subRes, evRes, actionRes, missingRes, activityRes, meetingRes, planRes, compRes, gapRes] = await Promise.all([
      safeCall(() => submissionService.getSubmissions({ deptFilter: dept.code }, user), { data: [] }),
      safeCall(() => evidenceService.getEvidence({ deptFilter: dept.code }, user), { data: [] }),
      safeCall(() => actionItemService.getActionItems({}, user), { data: [] }),
      safeCall(() => evidenceService.getMissingEvidence(user), { data: [] }),
      safeCall(() => activityService.getActivities({}, user), { data: [] }),
      safeCall(() => meetingService.getMeetings({}, user), { data: [] }),
      safeCall(() => improvementPlanService.getImprovementPlans({}, user), { data: [] }),
      safeCall(() => complianceService.getComplianceRecords({}, user), { data: [] }),
      safeCall(() => accreditationService.getAccreditationGaps({}, user), { data: [] }),
    ]);
    const inDept = (r) => (r.departmentCode || r.deptCode) === dept.code;
    const submissions = toArrayData(subRes).filter((s) => s.departmentCode === dept.code);
    const evidence = toArrayData(evRes).filter((e) => e.departmentCode === dept.code);
    const actions = toArrayData(actionRes).filter(inDept);
    const activities = toArrayData(activityRes).filter(inDept);
    const meetings = toArrayData(meetingRes).filter(inDept);
    const plans = toArrayData(planRes).filter(inDept);
    const compliance = toArrayData(compRes).filter(inDept);
    const gaps = toArrayData(gapRes).filter(inDept);
    const summary = summarizeDepartment(dept, submissions, evidence, toArrayData(missingRes), actions, plans);

    return {
      success: true,
      data: {
        department: dept,
        performance: {
          passPercentage: dept.passPercentage, placementPercentage: dept.placementPercentage,
          publicationsCount: dept.publicationsCount, researchFunding: dept.researchFunding,
          facultyCount: dept.facultyCount, studentCount: dept.studentCount,
        },
        operational: {
          pendingSubmissions: submissions.filter(isPendingReview),
          returnedSubmissions: submissions.filter((s) => s.status === SUBMISSION_STATUS.RETURNED),
          evidenceMissing: toArrayData(missingRes).filter((m) => m.departmentCode === dept.code),
          openActivities: activities.filter((a) => !['COMPLETED', 'CANCELLED'].includes(a.status)),
          openActions: actions.filter(isOpenAction),
          overdueActions: actions.filter((a) => a.status === 'OVERDUE'),
        },
        quality: { score: dept.qualityScore, categories: dept.categories, trend: dept.trend },
        compliance: { rate: dept.complianceRate, records: compliance },
        accreditation: { readiness: dept.accreditationReadiness, criteria: dept.criteriaReadiness, gaps },
        improvementPlans: plans,
        meetings: meetings.slice(0, 10),
        recentActivity: MOCK_RECENT_ACTIVITIES.filter((a) => a.departmentCode === dept.code).slice(0, 8),
        summary,
      },
    };
  },

  getDepartmentComparison: async (user, selection) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_DEPARTMENT_COMPARISON_VIEW);
    const codes = resolveSelection(user, selection);
    const depts = getAssignedDepartments(user).filter((d) => codes.includes(d.code));
    const [subRes, evRes, actionRes, missingRes] = await Promise.all([
      safeCall(() => submissionService.getSubmissions({}, user), { data: [] }),
      safeCall(() => evidenceService.getEvidence({}, user), { data: [] }),
      safeCall(() => actionItemService.getActionItems({}, user), { data: [] }),
      safeCall(() => evidenceService.getMissingEvidence(user), { data: [] }),
    ]);
    const submissions = toArrayData(subRes);
    const evidence = toArrayData(evRes);
    const actions = toArrayData(actionRes);
    const missing = toArrayData(missingRes);
    const rows = depts.map((d) => {
      const s = summarizeDepartment(d, submissions, evidence, missing, actions, []);
      const deptSubs = submissions.filter((x) => x.departmentCode === d.code);
      return {
        id: d.id, code: d.code, name: d.name,
        staff: d.staffCount, students: d.studentCount,
        passPercentage: d.passPercentage, placementPercentage: d.placementPercentage,
        publications: d.publicationsCount, researchFunding: d.researchFunding,
        submissionCompletion: deptSubs.length > 0
          ? Math.round((deptSubs.filter((x) => [SUBMISSION_STATUS.VERIFIED, SUBMISSION_STATUS.APPROVED].includes(x.status)).length / deptSubs.length) * 100)
          : null,
        evidenceCompleteness: s.evidenceCompleteness,
        compliance: d.complianceRate, quality: d.qualityScore, readiness: d.accreditationReadiness,
        openActions: s.openActions, overdueActions: s.overdueActions,
        pendingReviews: s.pendingReviews,
        categories: d.categories, criteria: d.criteriaReadiness, trend: d.trend,
      };
    });
    return { success: true, data: rows };
  },

  // ---- Submissions (monitor + comment by default; approve/return/reject only if explicitly granted) ----
  getDeanSubmissions: async (filters = {}, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_SUBMISSION_VIEW);
    return submissionService.getSubmissions(filters, user);
  },

  getPendingReviews: async (user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_SUBMISSION_VIEW);
    return submissionService.getPendingReviews(user);
  },

  getDeanSubmissionById: async (id, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_SUBMISSION_VIEW);
    const res = await submissionService.getSubmissionById(id, user);
    assertRecordScope(user, res.data);
    const evRes = await safeCall(() => evidenceService.getEvidenceBySubmission(res.data.submissionId, user), { data: [] });
    return { success: true, data: res.data, evidence: toArrayData(evRes) };
  },

  commentDeanSubmission: async (id, comment, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_SUBMISSION_COMMENT);
    if (!comment || !comment.trim()) throw new Error('A comment is required.');
    const current = await submissionService.getSubmissionById(id, user);
    assertRecordScope(user, current.data);
    logDeanAudit(user, 'DEAN_COMMENT', 'SUBMISSION', current.data.id, current.data.departmentId, comment);
    pushScopedNotification(user, {
      departmentCode: current.data.departmentCode,
      title: `Dean comment: ${current.data.submissionId}`,
      message: `${user.name}: ${comment}`, priority: 'NORMAL', recipientScope: 'DEPARTMENT_STAFF',
    });
    return { success: true, message: 'Comment recorded and shared with the department.', data: current.data };
  },

  moderateDeanSubmission: async (id, action, payload = {}, user) => {
    requireDean(user);
    const normalized = String(action || '').toUpperCase();
    const permMap = {
      APPROVE: DEAN_PERMISSIONS.DEAN_SUBMISSION_APPROVE,
      RETURN: DEAN_PERMISSIONS.DEAN_SUBMISSION_RETURN,
      REJECT: DEAN_PERMISSIONS.DEAN_SUBMISSION_REJECT,
    };
    const required = permMap[normalized];
    if (!required) throw new Error(`Unsupported moderation action '${action}'.`);
    // No fallback: works only when explicitly granted through configuration.
    if (!user.permissions || !user.permissions.includes(required)) {
      throw new Error(`Dean moderation action '${normalized}' is not enabled. Review remains at department/IQAC level.`);
    }
    const current = await submissionService.getSubmissionById(id, user);
    assertRecordScope(user, current.data);
    if (normalized === 'APPROVE') return submissionService.approveSubmission(current.data.id, payload.comment || '', user);
    if (!payload.reason || !payload.reason.trim()) throw new Error(`A ${normalized.toLowerCase()} reason is required.`);
    if (normalized === 'RETURN') return submissionService.returnSubmission(current.data.id, payload.reason, user);
    return submissionService.rejectSubmission(current.data.id, payload.reason, user);
  },

  // ---- Evidence (monitor + comment; never verify) ----
  getDeanEvidence: async (filters = {}, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_EVIDENCE_VIEW);
    return evidenceService.getEvidence(filters, user);
  },

  getDeanEvidenceById: async (id, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_EVIDENCE_VIEW);
    const res = await evidenceService.getEvidenceById(id, user);
    assertRecordScope(user, res.data);
    return res;
  },

  getEvidenceSummary: async (user, selection) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_EVIDENCE_VIEW);
    const codes = resolveSelection(user, selection);
    const [evRes, missingRes] = await Promise.all([
      safeCall(() => evidenceService.getEvidence({}, user), { data: [], stats: {} }),
      safeCall(() => evidenceService.getMissingEvidence(user), { data: [] }),
    ]);
    const evidence = toArrayData(evRes).filter((e) => codes.includes(e.departmentCode));
    const missing = toArrayData(missingRes).filter((m) => codes.includes(m.departmentCode));
    const byDept = codes.map((code) => {
      const evs = evidence.filter((e) => e.departmentCode === code);
      const verified = evs.filter((e) => e.status === EVIDENCE_STATUS.VERIFIED).length;
      const miss = missing.filter((m) => m.departmentCode === code).length;
      const required = evs.length + miss;
      return {
        departmentCode: code,
        required,
        verified,
        missing: miss,
        underReview: evs.filter(isEvidencePending).length,
        returned: evs.filter((e) => e.status === EVIDENCE_STATUS.RETURNED).length,
        completeness: required > 0 ? Math.round((verified / required) * 100) : 100,
      };
    });
    return {
      success: true,
      data: {
        total: evidence.length,
        verified: evidence.filter((e) => e.status === EVIDENCE_STATUS.VERIFIED).length,
        underReview: evidence.filter(isEvidencePending).length,
        returned: evidence.filter((e) => e.status === EVIDENCE_STATUS.RETURNED).length,
        rejected: evidence.filter((e) => e.status === EVIDENCE_STATUS.REJECTED).length,
        missing: missing.length,
        byDepartment: byDept,
      },
    };
  },

  commentDeanEvidence: async (id, comment, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_EVIDENCE_COMMENT);
    if (!comment || !comment.trim()) throw new Error('A comment is required.');
    const current = await evidenceService.getEvidenceById(id, user);
    assertRecordScope(user, current.data);
    logDeanAudit(user, 'DEAN_EVIDENCE_COMMENT', 'EVIDENCE', current.data.id, current.data.departmentId, comment);
    return { success: true, message: 'Evidence comment recorded.', data: current.data };
  },

  // ---- Activities / Meetings / Action items (monitor) ----
  getDeanActivities: async (filters = {}, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_ACTIVITY_VIEW);
    return safeCall(() => activityService.getActivities(filters, user), { success: true, data: [] });
  },

  getDeanActivityById: async (id, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_ACTIVITY_VIEW);
    const res = await activityService.getActivityById(id, user);
    assertRecordScope(user, res.data || {});
    return res;
  },

  getDeanMeetings: async (filters = {}, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_MEETING_VIEW);
    return safeCall(() => meetingService.getMeetings(filters, user), { success: true, data: [] });
  },

  getDeanMeetingById: async (id, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_MEETING_VIEW);
    const res = await meetingService.getMeetingById(id, user);
    assertRecordScope(user, res.data || {});
    return res;
  },

  getDeanActionItems: async (filters = {}, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_ACTION_VIEW);
    return safeCall(() => actionItemService.getActionItems(filters, user), { success: true, data: [] });
  },

  getDeanActionItemById: async (id, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_ACTION_VIEW);
    const res = await actionItemService.getActionItemById(id, user);
    assertRecordScope(user, res.data || {});
    return res;
  },

  // ---- Quality / Compliance / Accreditation / Improvement (Stage 5F-5G reuse) ----
  getQualitySummary: async (user, selection) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_QUALITY_VIEW);
    const codes = resolveSelection(user, selection);
    const depts = getAssignedDepartments(user).filter((d) => codes.includes(d.code));
    const indicators = await safeCall(() => qualityService.getQualityIndicators({}, user), { data: [] });
    return {
      success: true,
      data: depts.map((d) => ({
        id: d.id, code: d.code, name: d.name,
        score: d.qualityScore, categories: d.categories, trend: d.trend,
      })),
      indicators: toArrayData(indicators),
      trendLabels: deanPortalConfig.qualityTrendLabels,
    };
  },

  getComplianceSummary: async (user, selection) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_COMPLIANCE_VIEW);
    const codes = resolveSelection(user, selection);
    const depts = getAssignedDepartments(user).filter((d) => codes.includes(d.code));
    const records = await safeCall(() => complianceService.getComplianceRecords({}, user), { data: [] });
    const all = toArrayData(records).filter((r) => codes.includes(r.departmentCode || r.deptCode));
    return {
      success: true,
      data: depts.map((d) => {
        const recs = all.filter((r) => (r.departmentCode || r.deptCode) === d.code);
        return {
          id: d.id, code: d.code, name: d.name,
          complianceRate: d.complianceRate,
          pending: recs.filter((r) => ['PENDING', 'IN_PROGRESS', 'UNDER_REVIEW'].includes(r.status)).length,
          overdue: recs.filter((r) => r.status === 'OVERDUE').length,
          records: recs,
        };
      }),
    };
  },

  getAccreditationSummary: async (user, selection) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_ACCREDITATION_VIEW);
    const codes = resolveSelection(user, selection);
    const depts = getAssignedDepartments(user).filter((d) => codes.includes(d.code));
    const gaps = await safeCall(() => accreditationService.getAccreditationGaps({}, user), { data: [] });
    const all = toArrayData(gaps).filter((g) => codes.includes(g.departmentCode || g.deptCode));
    return {
      success: true,
      data: depts.map((d) => ({
        id: d.id, code: d.code, name: d.name,
        readiness: d.accreditationReadiness,
        criteria: d.criteriaReadiness,
        gaps: all.filter((g) => (g.departmentCode || g.deptCode) === d.code),
      })),
    };
  },

  getImprovementPlans: async (filters = {}, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_IMPROVEMENT_VIEW);
    return safeCall(() => improvementPlanService.getImprovementPlans(filters, user), { success: true, data: [] });
  },

  getImprovementPlanById: async (id, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_IMPROVEMENT_VIEW);
    const res = await improvementPlanService.getImprovementPlanById(id, user);
    assertRecordScope(user, res.data || {});
    return res;
  },

  // ---- Reports (Stage 4 reuse, scope-validated) ----
  getDeanReportTypes: async (user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_REPORT_VIEW);
    return reportService.getReportTypes();
  },

  getDeanReportHistory: async (user, filters = {}) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_REPORT_VIEW);
    return reportService.getReportHistory(filters);
  },

  generateDeanReport: async (payload = {}, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_REPORT_VIEW);
    const codes = resolveSelection(user, payload.departmentCodes);
    const res = await reportService.generateReport({
      reportConfigId: payload.reportConfigId,
      academicYear: payload.academicYear || '2026-27',
      scope: codes.length === 1 ? 'DEPARTMENT' : 'MULTI_DEPARTMENT',
      department: codes.join(', '),
      format: payload.format || 'PDF',
      user,
    });
    logDeanAudit(user, 'DEAN_GENERATE_REPORT', 'REPORT', res.report?.id, codes.join(','), res.report?.title || 'Department report');
    return res;
  },

  // ---- AQAR (view-only; no finalize path exposed) ----
  getDeanAQAROverview: async (user, selection) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_ACCREDITATION_VIEW);
    const codes = resolveSelection(user, selection);
    const depts = getAssignedDepartments(user).filter((d) => codes.includes(d.code));
    const reports = await safeCall(() => aqarReportService.getAQARReports({}, user), { data: [] });
    const subRes = await safeCall(() => submissionService.getSubmissions({}, user), { data: [] });
    const submissions = toArrayData(subRes);
    return {
      success: true,
      data: {
        reports: toArrayData(reports).slice(0, 5),
        departments: depts.map((d) => {
          const verified = submissions.filter((s) => s.departmentCode === d.code && s.status === SUBMISSION_STATUS.VERIFIED).length;
          return {
            code: d.code, name: d.name,
            readiness: d.accreditationReadiness,
            verifiedContributions: verified,
            criteria: d.criteriaReadiness,
          };
        }),
      },
    };
  },

  // ---- Notifications (existing store reuse; assigned-scope recipients only) ----
  getDeanNotifications: async (user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_NOTIFICATION_VIEW);
    return safeCall(() => iqacService.getNotificationHistory(user), { success: true, data: [] });
  },

  sendDeanNotification: async (payload = {}, user) => {
    requireDean(user);
    requirePerm(user, DEAN_PERMISSIONS.DEAN_NOTIFICATION_SEND);
    if (!payload.title || !payload.title.trim() || !payload.message || !payload.message.trim()) {
      throw new Error('Title and message are required.');
    }
    const codes = resolveSelection(user, payload.departmentCodes);
    const recipientKind = payload.recipientKind || 'DEPARTMENT_STAFF';
    if (!['HOD', 'IQAC_COORDINATOR', 'DEPARTMENT_STAFF'].includes(recipientKind)) {
      throw new Error('Recipients are restricted to HOD, IQAC Coordinator or department staff.');
    }
    const sent = codes.map((code) => pushScopedNotification(user, {
      departmentCode: code,
      title: payload.title,
      message: payload.message,
      priority: payload.priority || 'MEDIUM',
      recipientScope: recipientKind,
      dueDate: payload.dueDate || null,
    }));
    logDeanAudit(user, 'DEAN_SEND_NOTIFICATION', 'NOTIFICATION', sent.map((s) => s.id).join(','), codes.join(','), payload.title);
    return { success: true, message: `Notification sent to ${codes.length} department(s).`, data: sent };
  },
};
