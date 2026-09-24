// Dean Portal centralized configuration (Stage 8).
// Navigation, permissions, KPI definitions, thresholds and scope behavior.
// Pages and layout consume these helpers; no scattered role checks.

import { ROLES } from './roles';
import { PERMISSIONS } from './permissions';

// Dean monitoring baseline. Approve / return / reject / verify / update
// permissions below are intentionally NOT granted by default; they only take
// effect when explicitly present on the authenticated user.
export const DEAN_PERMISSIONS = {
  DEAN_DASHBOARD_VIEW: 'DEAN_DASHBOARD_VIEW',
  DEAN_DEPARTMENT_VIEW: 'DEAN_DEPARTMENT_VIEW',
  DEAN_DEPARTMENT_DETAILS_VIEW: 'DEAN_DEPARTMENT_DETAILS_VIEW',
  DEAN_DEPARTMENT_COMPARISON_VIEW: 'DEAN_DEPARTMENT_COMPARISON_VIEW',

  DEAN_SUBMISSION_VIEW: 'DEAN_SUBMISSION_VIEW',
  DEAN_SUBMISSION_COMMENT: 'DEAN_SUBMISSION_COMMENT',
  DEAN_SUBMISSION_APPROVE: 'DEAN_SUBMISSION_APPROVE',
  DEAN_SUBMISSION_RETURN: 'DEAN_SUBMISSION_RETURN',
  DEAN_SUBMISSION_REJECT: 'DEAN_SUBMISSION_REJECT',

  DEAN_EVIDENCE_VIEW: 'DEAN_EVIDENCE_VIEW',
  DEAN_EVIDENCE_COMMENT: 'DEAN_EVIDENCE_COMMENT',
  DEAN_EVIDENCE_REVIEW: 'DEAN_EVIDENCE_REVIEW',
  DEAN_EVIDENCE_VERIFY: 'DEAN_EVIDENCE_VERIFY',

  DEAN_ACTIVITY_VIEW: 'DEAN_ACTIVITY_VIEW',
  DEAN_MEETING_VIEW: 'DEAN_MEETING_VIEW',
  DEAN_ACTION_VIEW: 'DEAN_ACTION_VIEW',

  DEAN_QUALITY_VIEW: 'DEAN_QUALITY_VIEW',
  DEAN_COMPLIANCE_VIEW: 'DEAN_COMPLIANCE_VIEW',
  DEAN_COMPLIANCE_UPDATE: 'DEAN_COMPLIANCE_UPDATE',

  DEAN_ACCREDITATION_VIEW: 'DEAN_ACCREDITATION_VIEW',
  DEAN_ACCREDITATION_UPDATE: 'DEAN_ACCREDITATION_UPDATE',

  DEAN_IMPROVEMENT_VIEW: 'DEAN_IMPROVEMENT_VIEW',

  DEAN_REPORT_VIEW: 'DEAN_REPORT_VIEW',

  DEAN_NOTIFICATION_VIEW: 'DEAN_NOTIFICATION_VIEW',
  DEAN_NOTIFICATION_SEND: 'DEAN_NOTIFICATION_SEND',
};

// Baseline grants monitoring only. Optional action permissions have no
// fallback mapping, so they stay disabled unless explicitly assigned.
const DP = DEAN_PERMISSIONS;
export const DEAN_BASELINE_PERMISSIONS = [
  DP.DEAN_DASHBOARD_VIEW,
  DP.DEAN_DEPARTMENT_VIEW,
  DP.DEAN_DEPARTMENT_DETAILS_VIEW,
  DP.DEAN_DEPARTMENT_COMPARISON_VIEW,
  DP.DEAN_SUBMISSION_VIEW,
  DP.DEAN_SUBMISSION_COMMENT,
  DP.DEAN_EVIDENCE_VIEW,
  DP.DEAN_EVIDENCE_COMMENT,
  DP.DEAN_ACTIVITY_VIEW,
  DP.DEAN_MEETING_VIEW,
  DP.DEAN_ACTION_VIEW,
  DP.DEAN_QUALITY_VIEW,
  DP.DEAN_COMPLIANCE_VIEW,
  DP.DEAN_ACCREDITATION_VIEW,
  DP.DEAN_IMPROVEMENT_VIEW,
  DP.DEAN_REPORT_VIEW,
  DP.DEAN_NOTIFICATION_VIEW,
  DP.DEAN_NOTIFICATION_SEND,
];

// Fallback mapping: DEAN_* -> institutional PERMISSIONS equivalent.
export const DEAN_PERMISSION_FALLBACK = {
  DEAN_DASHBOARD_VIEW: PERMISSIONS.IQAC_DASHBOARD_VIEW,
  DEAN_DEPARTMENT_VIEW: PERMISSIONS.IQAC_DEPARTMENT_VIEW,
  DEAN_DEPARTMENT_DETAILS_VIEW: PERMISSIONS.IQAC_DEPARTMENT_VIEW,
  DEAN_DEPARTMENT_COMPARISON_VIEW: PERMISSIONS.QUALITY_COMPARISON_VIEW,
  DEAN_SUBMISSION_VIEW: PERMISSIONS.SUBMISSION_VIEW,
  DEAN_SUBMISSION_COMMENT: PERMISSIONS.SUBMISSION_COMMENT,
  DEAN_EVIDENCE_VIEW: PERMISSIONS.EVIDENCE_VIEW,
  DEAN_EVIDENCE_COMMENT: PERMISSIONS.EVIDENCE_HISTORY_VIEW,
  DEAN_ACTIVITY_VIEW: PERMISSIONS.ACTIVITY_VIEW,
  DEAN_MEETING_VIEW: PERMISSIONS.MEETING_VIEW,
  DEAN_ACTION_VIEW: PERMISSIONS.ACTION_ITEM_VIEW,
  DEAN_QUALITY_VIEW: PERMISSIONS.QUALITY_VIEW,
  DEAN_COMPLIANCE_VIEW: PERMISSIONS.COMPLIANCE_VIEW,
  DEAN_ACCREDITATION_VIEW: PERMISSIONS.ACCREDITATION_VIEW,
  DEAN_IMPROVEMENT_VIEW: PERMISSIONS.IMPROVEMENT_PLAN_VIEW,
  DEAN_REPORT_VIEW: PERMISSIONS.VIEW_REPORTS,
  DEAN_NOTIFICATION_VIEW: PERMISSIONS.IQAC_COORDINATOR_NOTIFICATION_VIEW,
  DEAN_NOTIFICATION_SEND: PERMISSIONS.IQAC_COORDINATOR_NOTIFICATION_SEND,
};

export const DEAN_MODULES = [
  { id: 'dashboard', label: 'Dashboard', path: '/dean', icon: 'LayoutDashboard', permission: DP.DEAN_DASHBOARD_VIEW, exact: true },
  { id: 'departments', label: 'Departments', path: '/dean/departments', icon: 'Building2', permission: DP.DEAN_DEPARTMENT_VIEW },
  { id: 'comparison', label: 'Comparison', path: '/dean/comparison', icon: 'BarChart3', permission: DP.DEAN_DEPARTMENT_COMPARISON_VIEW },
  { id: 'review', label: 'Reviews', path: '/dean/review', icon: 'ClipboardCheck', permission: DP.DEAN_SUBMISSION_VIEW },
  { id: 'evidence', label: 'Evidence', path: '/dean/evidence', icon: 'FolderCheck', permission: DP.DEAN_EVIDENCE_VIEW },
  { id: 'activities', label: 'Activities', path: '/dean/activities', icon: 'Sparkles', permission: DP.DEAN_ACTIVITY_VIEW },
  { id: 'meetings', label: 'Meetings', path: '/dean/meetings', icon: 'CalendarDays', permission: DP.DEAN_MEETING_VIEW },
  { id: 'actions', label: 'Action Items', path: '/dean/action-items', icon: 'CheckSquare', permission: DP.DEAN_ACTION_VIEW },
  { id: 'quality', label: 'Quality Monitoring', path: '/dean/quality', icon: 'Star', permission: DP.DEAN_QUALITY_VIEW },
  { id: 'compliance', label: 'Compliance', path: '/dean/compliance', icon: 'ShieldCheck', permission: DP.DEAN_COMPLIANCE_VIEW },
  { id: 'accreditation', label: 'Accreditation', path: '/dean/accreditation', icon: 'Award', permission: DP.DEAN_ACCREDITATION_VIEW },
  { id: 'improvement', label: 'Improvement Plans', path: '/dean/improvement-plans', icon: 'TrendingUp', permission: DP.DEAN_IMPROVEMENT_VIEW },
  { id: 'reports', label: 'Reports', path: '/dean/reports', icon: 'FileText', permission: DP.DEAN_REPORT_VIEW },
  { id: 'notifications', label: 'Notifications', path: '/dean/notifications', icon: 'Bell', permission: DP.DEAN_NOTIFICATION_VIEW },
];

export const DEAN_PORTAL_CONFIG = {
  [ROLES.DEAN]: {
    label: 'Dean',
    modules: DEAN_MODULES.map((m) => m.id),
    permissions: DEAN_BASELINE_PERMISSIONS,
  },
};

export const deanPortalConfig = {
  defaultScope: 'ASSIGNED_DEPARTMENTS',
  allowMultiDepartmentComparison: true,
  qualityTrendLabels: ['2023-24', '2024-25', '2025-26'],
  thresholds: {
    pendingReviewAlert: 8,
    evidenceCompletenessAlert: 85,
    complianceAlert: 70,
    criterionReadinessAlert: 65,
  },
  permissions: {
    canViewDepartments: true,
    canReviewSubmissions: false,
    canCommentSubmissions: true,
    canManageEvidence: false,
    canViewQuality: true,
    canViewCompliance: true,
    canViewAccreditation: true,
    canManageFramework: false,
    canFinalizeAQAR: false,
  },
};

export const isDeanRole = (role) => role === ROLES.DEAN;

export const hasDeanPermission = (user, permission) => {
  if (!user || !permission) return false;
  const userPermissions = user.permissions || [];
  if (userPermissions.includes(permission)) return true;
  const fallback = DEAN_PERMISSION_FALLBACK[permission];
  if (fallback && userPermissions.includes(fallback)) return true;
  const roleConfig = DEAN_PORTAL_CONFIG[user.role];
  if (roleConfig && roleConfig.permissions.includes(permission)) return true;
  return false;
};

export const getDeanModulesForUser = (user) => {
  if (!user) return [];
  const roleConfig = DEAN_PORTAL_CONFIG[user.role];
  const allowedIds = roleConfig ? roleConfig.modules : DEAN_MODULES.map((m) => m.id);
  return DEAN_MODULES.filter(
    (m) => allowedIds.includes(m.id) && hasDeanPermission(user, m.permission),
  );
};
