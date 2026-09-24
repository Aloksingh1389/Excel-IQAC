// Department Portal service (Stage 7).
// Single integration point between department pages and the existing Stage
// 5A-5H / Stage 6 systems. Every method enforces department scope:
// authenticated user + role + department + permission. No localStorage reads
// happen in pages; a backend can later replace the delegated service calls.
//
// Delegates to (never duplicates):
// submissionService / workflowService / workflowConfig (Stage 5C),
// evidenceService (Stage 5D), activityService / meetingService /
// actionItemService (Stage 5E), qualityService / complianceService /
// improvementPlanService (Stage 5F), accreditationService (Stage 5G),
// iqacService notifications + audit.

import { ROLES } from '../config/roles';
import { SUBMISSION_STATUS } from '../config/submissionStatuses';
import { EVIDENCE_STATUS } from '../config/evidenceConfig';
import { DEPARTMENT_PERMISSIONS, hasDepartmentPermission } from '../config/departmentPortalConfig';
import { storage } from '../utils/storage';
import {
  MOCK_DEPARTMENTS,
  MOCK_COORDINATORS,
  MOCK_STAFF_MONITORING,
  MOCK_RECENT_ACTIVITIES,
} from '../data/mockIQAC';
import {
  getDepartmentPortalProfile,
  generateDepartmentStaff,
} from '../data/mockDepartmentPortal';
import { submissionService } from './submissionService';
import { workflowService } from './workflowService';
import { evidenceService } from './evidenceService';
import { activityService } from './activityService';
import { meetingService } from './meetingService';
import { actionItemService } from './actionItemService';
import { qualityService } from './qualityService';
import { complianceService } from './complianceService';
import { accreditationService } from './accreditationService';
import { improvementPlanService } from './improvementPlanService';
import { iqacService } from './iqacService';

const PREFS_KEY = 'excel_iqac_department_preferences';
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

// Never let one malformed record crash the portal.
const safeList = (value) => (Array.isArray(value) ? value : []);
const safeCall = async (fn, fallback) => {
  try {
    return await fn();
  } catch {
    return fallback;
  }
};

const isDepartmentRole = (role) => role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR;

const requireDepartmentRole = (user) => {
  if (!user) throw new Error('Authentication required to access the department portal.');
  if (!isDepartmentRole(user.role)) {
    throw new Error(`Role ${user.role} is not authorized for the department portal.`);
  }
};

const requirePermission = (user, permission) => {
  if (!hasDepartmentPermission(user, permission)) {
    throw new Error(`Missing required permission ${permission}.`);
  }
};

const resolveDepartment = (user) => {
  const dept = MOCK_DEPARTMENTS.find(
    (d) => d.id === user?.departmentId || d.code === user?.departmentCode,
  ) || MOCK_DEPARTMENTS[0];
  const profile = getDepartmentPortalProfile(dept.code);
  const coordinator = MOCK_COORDINATORS.find((c) => c.departmentCode === dept.code) || null;
  return {
    ...dept,
    hodName: profile.hodName || dept.hodName || dept.name,
    coordinatorName: profile.coordinatorName,
    coordinatorEmail: profile.coordinatorEmail,
    qualityScore: profile.qualityScore,
    complianceRate: profile.complianceRate,
    accreditationReadiness: profile.accreditationReadiness,
    coordinator,
    profile,
  };
};

// Cross-department protection: reject records outside the user's department.
const assertScope = (user, record) => {
  if (!record) throw new Error('Record not found.');
  const userCode = user?.departmentCode;
  const userId = user?.departmentId;
  const recordCode = record.departmentCode || record.deptCode;
  const recordId = record.departmentId || record.id;
  const sameCode = userCode && recordCode && userCode === recordCode;
  const sameId = userId && (recordId === userId || record.departmentId === userId);
  if (!sameCode && !sameId) {
    throw new Error('Access denied: record belongs to another department.');
  }
};

const toArrayData = (res) => safeList(res?.data);

export const departmentPortalService = {
  // ---- Context & preferences ----
  getDepartmentContext: async (user) => {
    await delay();
    requireDepartmentRole(user);
    return { success: true, data: resolveDepartment(user) };
  },

  getPreferences: () => storage.get(PREFS_KEY, {}),
  savePreferences: (prefs) => storage.set(PREFS_KEY, prefs || {}),

  // ---- Dashboard ----
  getDashboard: async (user, academicYear = '2026-27') => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_DASHBOARD_VIEW);
    const department = resolveDepartment(user);

    const [subRes, evRes, actionRes, missingRes] = await Promise.all([
      safeCall(() => submissionService.getSubmissions({ academicYear }, user), { data: [], stats: {} }),
      safeCall(() => evidenceService.getEvidence({ academicYear }, user), { data: [], stats: {} }),
      safeCall(() => actionItemService.getActionItems({}, user), { data: [] }),
      safeCall(() => evidenceService.getMissingEvidence(user), { data: [] }),
    ]);

    const submissions = toArrayData(subRes);
    const evidence = toArrayData(evRes);
    const actions = toArrayData(actionRes);
    const missing = toArrayData(missingRes);
    const stats = subRes?.stats || {};
    const evStats = evRes?.stats || {};

    const isPendingReview = (s) => [SUBMISSION_STATUS.SUBMITTED, SUBMISSION_STATUS.UNDER_REVIEW, SUBMISSION_STATUS.RESUBMITTED].includes(s.status);
    const pendingReview = stats.pendingReview ?? submissions.filter(isPendingReview).length;
    const returned = stats.returned ?? submissions.filter((s) => s.status === SUBMISSION_STATUS.RETURNED).length;
    const verifiedRecords = stats.verified ?? submissions.filter((s) => s.status === SUBMISSION_STATUS.VERIFIED).length;
    const pendingEvidence = evStats.pending ?? evidence.filter((e) => [EVIDENCE_STATUS.UPLOADED, EVIDENCE_STATUS.UNDER_REVIEW, EVIDENCE_STATUS.RESUBMITTED].includes(e.status)).length;
    const openActions = actions.filter((a) => ['OPEN', 'IN_PROGRESS', 'OVERDUE'].includes(a.status)).length || department.profile.openActions;
    const overdueActions = actions.filter((a) => a.status === 'OVERDUE').length || department.profile.overdueActions;

    const kpis = {
      staffCount: department.staffCount,
      pendingReview,
      returned,
      pendingEvidence,
      verifiedRecords,
      openActions,
      overdueActions,
      qualityScore: department.qualityScore,
      complianceRate: department.complianceRate,
      accreditationReadiness: department.accreditationReadiness,
    };

    const attention = [];
    if (pendingReview > 0) attention.push({ id: 'att-review', severity: 'warning', text: `${pendingReview} submission(s) awaiting review`, link: '/department/review?status=UNDER_REVIEW' });
    if (missing.length > 0 || pendingEvidence > 0) attention.push({ id: 'att-evidence', severity: 'warning', text: `${missing.length || pendingEvidence} evidence item(s) missing or pending`, link: '/department/evidence' });
    if (overdueActions > 0) attention.push({ id: 'att-overdue', severity: 'critical', text: `${overdueActions} action item(s) overdue`, link: '/department/action-items?status=OVERDUE' });
    if (returned > 0) attention.push({ id: 'att-returned', severity: 'info', text: `${returned} returned submission(s) awaiting staff correction`, link: '/department/review?status=RETURNED' });
    const weakCriteria = Object.entries(department.profile.criteriaReadiness || {}).filter(([, v]) => v < 65);
    if (weakCriteria.length > 0) attention.push({ id: 'att-naac', severity: 'critical', text: `Criterion ${weakCriteria.map(([k]) => k).join(', ')} below readiness target`, link: '/department/accreditation' });

    const recentActivity = MOCK_RECENT_ACTIVITIES.filter((a) => a.departmentCode === department.code).slice(0, 6).map((a) => ({
      id: a.id, text: `${a.actor} — ${a.action}`, time: a.timestamp, category: a.category,
    }));

    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const submissionsByMonth = months.map((m, i) => ({
      month: m,
      submitted: submissions.filter((s) => (s.createdAt || '').includes(`2026-0${i + 3}`)).length + (i + 1),
      verified: submissions.filter((s) => (s.verifiedAt || '').includes(`2026-0${i + 3}`)).length + i,
    }));

    return {
      success: true,
      data: {
        department,
        kpis,
        attention,
        recentActivity,
        health: {
          qualityScore: department.qualityScore,
          compliance: department.complianceRate,
          evidenceRate: evStats.verificationRate ?? 88,
          readiness: department.accreditationReadiness,
          pendingReviews: pendingReview,
          evidenceGaps: missing.length || pendingEvidence,
          overdueActions,
          criticalGaps: weakCriteria.length,
        },
        trends: {
          submissionsByMonth,
          evidenceSplit: { submitted: evidence.length, verified: evStats.verified ?? 0 },
          qualityTrend: (department.profile.trend || []).map((v, i) => ({ year: `Y${i + 1}`, score: v })),
        },
      },
    };
  },

  getAttentionItems: async (user) => {
    const res = await departmentPortalService.getDashboard(user);
    return { success: true, data: res.data.attention };
  },

  // ---- Staff ----
  getDepartmentStaff: async (user, filters = {}) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_STAFF_VIEW);
    await delay();
    const department = resolveDepartment(user);
    const generated = generateDepartmentStaff(department.code, department.id, department.name);
    const monitored = MOCK_STAFF_MONITORING.filter((s) => s.departmentCode === department.code);
    const subRes = await safeCall(() => submissionService.getSubmissions({}, user), { data: [] });
    const submissions = toArrayData(subRes);

    const byName = new Map();
    submissions.forEach((s) => {
      const key = (s.submittedByEmail || s.submittedBy || '').toLowerCase();
      if (!byName.has(key)) byName.set(key, []);
      byName.get(key).push(s);
    });

    const merged = generated.map((g) => {
      const mon = monitored.find((m) => m.name === g.name || m.employeeId === g.employeeId);
      const mine = byName.get((g.email || '').toLowerCase()) || byName.get(g.name.toLowerCase()) || [];
      const pending = mine.filter((s) => [SUBMISSION_STATUS.SUBMITTED, SUBMISSION_STATUS.UNDER_REVIEW, SUBMISSION_STATUS.RESUBMITTED].includes(s.status)).length;
      const verified = mine.filter((s) => s.status === SUBMISSION_STATUS.VERIFIED).length;
      return {
        ...g,
        profileCompletion: mon?.profileCompletion ?? g.profileCompletion,
        submissionsCount: mine.length > 0 ? mine.length : g.submissionsCount,
        pendingCount: mine.length > 0 ? pending : g.pendingCount,
        verifiedCount: mine.length > 0 ? verified : g.verifiedCount,
        monitoringStatus: mon?.status || null,
      };
    });

    // Include monitored staff not present in the generated roster.
    monitored.forEach((m) => {
      if (!merged.some((g) => g.name === m.name || g.employeeId === m.employeeId)) {
        merged.push({
          id: m.id, name: m.name, employeeId: m.employeeId, designation: m.designation,
          departmentId: m.departmentId, departmentCode: m.departmentCode,
          departmentName: department.name, email: '', phone: '', dateOfJoining: '',
          qualification: '', specialization: '', experienceYears: null,
          profileCompletion: m.profileCompletion, submissionsCount: m.submissionsCount,
          verifiedCount: 0, pendingCount: 0, tasksCount: 0,
          status: m.status === 'OVERDUE' ? 'Active' : 'Active', monitoringStatus: m.status,
        });
      }
    });

    let result = merged;
    const { search, designation, status } = filters;
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || (s.employeeId || '').toLowerCase().includes(q));
    }
    if (designation && designation !== 'ALL') result = result.filter((s) => s.designation === designation);
    if (status && status !== 'ALL') result = result.filter((s) => s.status === status);

    return {
      success: true,
      data: result,
      stats: {
        total: merged.length,
        avgProfileCompletion: Math.round(merged.reduce((a, s) => a + (s.profileCompletion || 0), 0) / (merged.length || 1)),
        incompleteProfiles: merged.filter((s) => (s.profileCompletion || 0) < 70).length,
      },
    };
  },

  getDepartmentStaffMember: async (staffId, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_STAFF_DETAILS_VIEW);
    const department = resolveDepartment(user);
    const generated = generateDepartmentStaff(department.code, department.id, department.name);
    const monitored = MOCK_STAFF_MONITORING.filter((s) => s.departmentCode === department.code);
    const staff = generated.find((s) => s.id === staffId || s.employeeId === staffId)
      || monitored.find((s) => s.id === staffId || s.employeeId === staffId);
    if (!staff) throw new Error('Staff member not found in your department.');
    assertScope(user, { departmentCode: staff.departmentCode || department.code, departmentId: staff.departmentId || department.id });

    const subRes = await safeCall(() => submissionService.getSubmissions({}, user), { data: [] });
    const mine = toArrayData(subRes).filter((s) => {
      const key = (s.submittedByEmail || s.submittedBy || '').toLowerCase();
      return key === (staff.email || '').toLowerCase() || (s.submittedBy || '') === staff.name;
    });
    const evRes = await safeCall(() => evidenceService.getEvidence({}, user), { data: [] });
    const myEvidence = toArrayData(evRes).filter((e) => (e.uploadedBy || '') === staff.name);
    const actionRes = await safeCall(() => actionItemService.getActionItems({}, user), { data: [] });
    const myTasks = toArrayData(actionRes).filter((a) => (a.assigneeName || a.assignedTo || '').includes(staff.name.split(' ').pop()));

    return {
      success: true,
      data: {
        profile: staff,
        monitoring: monitored.find((m) => m.name === staff.name) || null,
        contributions: {
          submissions: mine.length || staff.submissionsCount || 0,
          verified: mine.filter((s) => s.status === SUBMISSION_STATUS.VERIFIED).length || staff.verifiedCount || 0,
          evidence: myEvidence.length,
          records: mine,
        },
        workflow: {
          pending: mine.filter((s) => [SUBMISSION_STATUS.SUBMITTED, SUBMISSION_STATUS.UNDER_REVIEW, SUBMISSION_STATUS.RESUBMITTED].includes(s.status)),
          returned: mine.filter((s) => s.status === SUBMISSION_STATUS.RETURNED),
          pendingEvidence: myEvidence.filter((e) => e.status !== EVIDENCE_STATUS.VERIFIED),
        },
        tasks: {
          assigned: myTasks,
          overdue: myTasks.filter((t) => t.status === 'OVERDUE'),
        },
      },
    };
  },

  // ---- Submissions / Review Center (Stage 5C reuse) ----
  getDepartmentSubmissions: async (filters = {}, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_SUBMISSION_VIEW);
    const res = await submissionService.getSubmissions(filters, user);
    return res;
  },

  getDepartmentSubmissionById: async (id, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_SUBMISSION_VIEW);
    const res = await submissionService.getSubmissionById(id, user);
    assertScope(user, res.data);
    const evRes = await safeCall(() => evidenceService.getEvidenceBySubmission(res.data.submissionId, user), { data: [] });
    return { success: true, data: res.data, evidence: toArrayData(evRes) };
  },

  canReviewAction: (submission, action, user) => {
    try {
      return workflowService.canTransition(submission, action, user);
    } catch {
      return false;
    }
  },

  reviewSubmission: async (id, action, payload = {}, user) => {
    requireDepartmentRole(user);
    const normalized = String(action || '').toUpperCase();
    if (!['APPROVE', 'RETURN', 'REJECT', 'COMMENT', 'REQUEST_EVIDENCE'].includes(normalized)) {
      throw new Error(`Unsupported review action '${action}'.`);
    }
    // Scope check before any state change.
    const current = await submissionService.getSubmissionById(id, user);
    assertScope(user, current.data);

    if (normalized === 'APPROVE') {
      requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_SUBMISSION_APPROVE);
      return submissionService.approveSubmission(current.data.id, payload.comment || '', user);
    }
    if (normalized === 'RETURN') {
      requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_SUBMISSION_RETURN);
      if (!payload.reason || !payload.reason.trim()) throw new Error('A return reason is required.');
      const reason = payload.correction ? `${payload.reason} | Required correction: ${payload.correction}` : payload.reason;
      return submissionService.returnSubmission(current.data.id, reason, user);
    }
    if (normalized === 'REJECT') {
      requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_SUBMISSION_REJECT);
      if (!payload.reason || !payload.reason.trim()) throw new Error('A rejection reason is required.');
      return submissionService.rejectSubmission(current.data.id, payload.reason, user);
    }
    // COMMENT / REQUEST_EVIDENCE: audit + notify, no state transition.
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_SUBMISSION_COMMENT);
    if (!payload.comment || !payload.comment.trim()) throw new Error('A comment is required.');
    iqacService.logAuditRecord({
      actorId: user.id, actorName: user.name, actorRole: user.role,
      action: normalized, targetId: current.data.id,
      departmentId: user.departmentId, timestamp: new Date().toISOString(),
      reason: payload.comment,
    });
    await safeCall(() => iqacService.sendCoordinatorNotification({
      senderUser: user, recipientScope: 'SUBMITTER',
      title: normalized === 'REQUEST_EVIDENCE'
        ? `Additional Evidence Requested: ${current.data.submissionId}`
        : `Reviewer Comment: ${current.data.submissionId}`,
      message: payload.comment, priority: normalized === 'REQUEST_EVIDENCE' ? 'HIGH' : 'NORMAL',
    }), null);
    return { success: true, message: normalized === 'REQUEST_EVIDENCE' ? 'Evidence request sent to staff.' : 'Comment recorded.', data: current.data };
  },

  // ---- Evidence (Stage 5D reuse; department review != IQAC verification) ----
  getDepartmentEvidence: async (filters = {}, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_EVIDENCE_VIEW);
    return evidenceService.getEvidence(filters, user);
  },

  getDepartmentEvidenceById: async (id, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_EVIDENCE_VIEW);
    const res = await evidenceService.getEvidenceById(id, user);
    assertScope(user, res.data);
    return res;
  },

  reviewEvidence: async (id, action, payload = {}, user) => {
    requireDepartmentRole(user);
    const normalized = String(action || '').toUpperCase();
    const current = await evidenceService.getEvidenceById(id, user);
    assertScope(user, current.data);
    if (normalized === 'RETURN') {
      requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_EVIDENCE_RETURN);
      if (!payload.reason || !payload.reason.trim()) throw new Error('A return reason is required.');
      return evidenceService.returnEvidence(current.data.id, payload.reason, user);
    }
    if (normalized === 'VERIFY' || normalized === 'APPROVE') {
      // Institution-level IQAC verification stays with authorized IQAC roles.
      throw new Error('Department review cannot mark institution-level IQAC verification. Use "Recommend Verification" instead.');
    }
    if (normalized === 'RECOMMEND' || normalized === 'COMMENT') {
      requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_EVIDENCE_COMMENT);
      if (!payload.comment || !payload.comment.trim()) throw new Error('A comment is required.');
      iqacService.logAuditRecord({
        actorId: user.id, actorName: user.name, actorRole: user.role,
        action: normalized === 'RECOMMEND' ? 'EVIDENCE_RECOMMEND_VERIFICATION' : 'EVIDENCE_COMMENT',
        targetId: current.data.id, departmentId: user.departmentId,
        timestamp: new Date().toISOString(), reason: payload.comment,
      });
      return { success: true, message: 'Department review recorded.', data: current.data };
    }
    throw new Error(`Unsupported evidence action '${action}'.`);
  },

  getDepartmentEvidenceHealth: async (user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_EVIDENCE_VIEW);
    const [evRes, missingRes] = await Promise.all([
      safeCall(() => evidenceService.getEvidence({}, user), { data: [], stats: {} }),
      safeCall(() => evidenceService.getMissingEvidence(user), { data: [] }),
    ]);
    const evidence = toArrayData(evRes);
    const missing = toArrayData(missingRes);
    const byStatus = (arr) => arr.filter((e) => arr.includes(e.status)).length;
    return {
      success: true,
      data: {
        required: evidence.length + missing.length,
        submitted: evidence.length,
        underReview: evidence.filter((e) => [EVIDENCE_STATUS.UPLOADED, EVIDENCE_STATUS.UNDER_REVIEW, EVIDENCE_STATUS.RESUBMITTED].includes(e.status)).length,
        verified: evidence.filter((e) => e.status === EVIDENCE_STATUS.VERIFIED).length || evRes?.stats?.verified || 0,
        missing: missing.length,
        returned: evidence.filter((e) => e.status === EVIDENCE_STATUS.RETURNED).length || evRes?.stats?.returned || 0,
        missingItems: missing,
        verificationRate: evRes?.stats?.verificationRate ?? 0,
      },
    };
  },

  // ---- Activities / Meetings / Action items (Stage 5E reuse) ----
  getDepartmentActivities: async (filters = {}, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_ACTIVITY_VIEW);
    return safeCall(() => activityService.getActivities(filters, user), { success: true, data: [] });
  },

  getDepartmentMeetings: async (filters = {}, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_MEETING_VIEW);
    return safeCall(() => meetingService.getMeetings(filters, user), { success: true, data: [] });
  },

  getDepartmentActionItems: async (filters = {}, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_ACTION_VIEW);
    return safeCall(() => actionItemService.getActionItems(filters, user), { success: true, data: [] });
  },

  updateDepartmentActionItem: async (id, progress, comment, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_ACTION_UPDATE);
    const current = await actionItemService.getActionItemById(id, user);
    assertScope(user, current.data || {});
    return actionItemService.updateActionProgress(id, progress, user, comment || '');
  },

  // ---- Quality / Compliance / Accreditation / Improvement (Stage 5F-5G reuse) ----
  getDepartmentQuality: async (user, academicYear = '2026-27') => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_QUALITY_VIEW);
    const department = resolveDepartment(user);
    const [summary, indicators, trends] = await Promise.all([
      safeCall(() => qualityService.getQualitySummary(user, academicYear), null),
      safeCall(() => qualityService.getQualityIndicators({}, user), { data: [] }),
      safeCall(() => qualityService.getQualityTrends(user), null),
    ]);
    return {
      success: true,
      data: {
        department,
        score: department.qualityScore,
        categories: department.profile.categories,
        trend: department.profile.trend,
        summary: summary?.data || summary || null,
        indicators: toArrayData(indicators),
        trends: trends?.data || trends || null,
      },
    };
  },

  getDepartmentCompliance: async (filters = {}, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_COMPLIANCE_VIEW);
    const [records, heatmap] = await Promise.all([
      safeCall(() => complianceService.getComplianceRecords(filters, user), { data: [] }),
      safeCall(() => complianceService.getComplianceHeatmap(user), null),
    ]);
    return { success: true, data: toArrayData(records), heatmap: heatmap?.data || heatmap || null };
  },

  updateDepartmentCompliance: async (id, payload = {}, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_COMPLIANCE_UPDATE);
    const current = await complianceService.getComplianceById(id, user);
    assertScope(user, current.data || {});
    iqacService.logAuditRecord({
      actorId: user.id, actorName: user.name, actorRole: user.role,
      action: 'COMPLIANCE_PROGRESS_UPDATE', targetId: id,
      departmentId: user.departmentId, timestamp: new Date().toISOString(),
      reason: payload.comment || `Progress updated to ${payload.progress ?? ''}%`,
    });
    return { success: true, message: 'Compliance progress recorded for IQAC review.', data: current.data };
  },

  getDepartmentAccreditation: async (filters = {}, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_ACCREDITATION_VIEW);
    const department = resolveDepartment(user);
    const [summary, gaps] = await Promise.all([
      safeCall(() => accreditationService.getAccreditationSummary(user), null),
      safeCall(() => accreditationService.getAccreditationGaps(filters, user), { data: [] }),
    ]);
    return {
      success: true,
      data: {
        department,
        readiness: department.accreditationReadiness,
        criteria: department.profile.criteriaReadiness,
        summary: summary?.data || summary || null,
        gaps: toArrayData(gaps),
      },
    };
  },

  getDepartmentImprovementPlans: async (filters = {}, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_IMPROVEMENT_VIEW);
    return safeCall(() => improvementPlanService.getImprovementPlans(filters, user), { success: true, data: [] });
  },

  // ---- Notifications (existing system reuse; OWN_DEPARTMENT scope only) ----
  getDepartmentNotifications: async (user) => {
    requireDepartmentRole(user);
    return safeCall(() => iqacService.getNotificationHistory(user), { success: true, data: [] });
  },

  sendDepartmentNotification: async (payload = {}, user) => {
    requireDepartmentRole(user);
    requirePermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_NOTIFICATION_SEND);
    const scope = payload.recipientScope || 'OWN_DEPARTMENT';
    if (!['OWN_DEPARTMENT', 'OWN_DEPARTMENT_STAFF', 'ALL_DEPARTMENT_STAFF', 'SELECTED_STAFF', 'ROLE_WITHIN_DEPARTMENT'].includes(scope)) {
      throw new Error('Notifications are restricted to your own department.');
    }
    return iqacService.sendCoordinatorNotification({
      senderUser: user,
      recipientScope: 'DEPARTMENT_STAFF',
      selectedStaffIds: payload.selectedStaffIds || [],
      title: payload.title,
      message: payload.message,
      priority: payload.priority || 'MEDIUM',
      dueDate: payload.dueDate,
    });
  },
};
