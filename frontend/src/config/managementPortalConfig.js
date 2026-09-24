// Management Portal centralized configuration (Stage 9).
// One reusable portal for Technical Director and Executive Director /
// Principal. Navigation, permissions, thresholds and role differences live
// here — never scattered across JSX.

import { ROLES } from './roles';
import { PERMISSIONS } from './permissions';

export const MANAGEMENT_PERMISSIONS = {
  MANAGEMENT_DASHBOARD_VIEW: 'MANAGEMENT_DASHBOARD_VIEW',
  MANAGEMENT_INSTITUTION_VIEW: 'MANAGEMENT_INSTITUTION_VIEW',
  MANAGEMENT_DEPARTMENT_VIEW: 'MANAGEMENT_DEPARTMENT_VIEW',
  MANAGEMENT_DEPARTMENT_DETAILS_VIEW: 'MANAGEMENT_DEPARTMENT_DETAILS_VIEW',
  MANAGEMENT_ANALYTICS_VIEW: 'MANAGEMENT_ANALYTICS_VIEW',
  MANAGEMENT_COMPARISON_VIEW: 'MANAGEMENT_COMPARISON_VIEW',
  MANAGEMENT_TRENDS_VIEW: 'MANAGEMENT_TRENDS_VIEW',
  MANAGEMENT_QUALITY_VIEW: 'MANAGEMENT_QUALITY_VIEW',
  MANAGEMENT_COMPLIANCE_VIEW: 'MANAGEMENT_COMPLIANCE_VIEW',
  MANAGEMENT_ACCREDITATION_VIEW: 'MANAGEMENT_ACCREDITATION_VIEW',
  MANAGEMENT_SUBMISSION_VIEW: 'MANAGEMENT_SUBMISSION_VIEW',
  MANAGEMENT_SUBMISSION_COMMENT: 'MANAGEMENT_SUBMISSION_COMMENT',
  MANAGEMENT_EVIDENCE_VIEW: 'MANAGEMENT_EVIDENCE_VIEW',
  MANAGEMENT_ACTIVITY_VIEW: 'MANAGEMENT_ACTIVITY_VIEW',
  MANAGEMENT_MEETING_VIEW: 'MANAGEMENT_MEETING_VIEW',
  MANAGEMENT_ACTION_VIEW: 'MANAGEMENT_ACTION_VIEW',
  MANAGEMENT_IMPROVEMENT_VIEW: 'MANAGEMENT_IMPROVEMENT_VIEW',
  MANAGEMENT_REPORT_VIEW: 'MANAGEMENT_REPORT_VIEW',
  MANAGEMENT_AQAR_VIEW: 'MANAGEMENT_AQAR_VIEW',
  MANAGEMENT_AUDIT_VIEW: 'MANAGEMENT_AUDIT_VIEW',
  MANAGEMENT_NOTIFICATION_VIEW: 'MANAGEMENT_NOTIFICATION_VIEW',
  MANAGEMENT_NOTIFICATION_SEND: 'MANAGEMENT_NOTIFICATION_SEND',
  MANAGEMENT_SETTINGS_VIEW: 'MANAGEMENT_SETTINGS_VIEW',
  MANAGEMENT_SETTINGS_MANAGE: 'MANAGEMENT_SETTINGS_MANAGE',
  DEAN_MANAGEMENT_VIEW: 'DEAN_MANAGEMENT_VIEW',
  DEAN_ASSIGNMENT_MANAGE: 'DEAN_ASSIGNMENT_MANAGE',
};

const MP = MANAGEMENT_PERMISSIONS;

// Fallback mapping to institutional permissions for users carrying them.
export const MANAGEMENT_PERMISSION_FALLBACK = {
  MANAGEMENT_DASHBOARD_VIEW: PERMISSIONS.VIEW_INSTITUTION,
  MANAGEMENT_INSTITUTION_VIEW: PERMISSIONS.VIEW_INSTITUTION,
  MANAGEMENT_DEPARTMENT_VIEW: PERMISSIONS.VIEW_ALL_DEPARTMENTS,
  MANAGEMENT_DEPARTMENT_DETAILS_VIEW: PERMISSIONS.VIEW_ALL_DEPARTMENTS,
  MANAGEMENT_ANALYTICS_VIEW: PERMISSIONS.VIEW_ALL_ANALYTICS,
  MANAGEMENT_COMPARISON_VIEW: PERMISSIONS.VIEW_ALL_ANALYTICS,
  MANAGEMENT_TRENDS_VIEW: PERMISSIONS.VIEW_ALL_ANALYTICS,
  MANAGEMENT_QUALITY_VIEW: PERMISSIONS.QUALITY_VIEW,
  MANAGEMENT_COMPLIANCE_VIEW: PERMISSIONS.COMPLIANCE_VIEW,
  MANAGEMENT_ACCREDITATION_VIEW: PERMISSIONS.ACCREDITATION_VIEW,
  MANAGEMENT_SUBMISSION_VIEW: PERMISSIONS.SUBMISSION_VIEW,
  MANAGEMENT_SUBMISSION_COMMENT: PERMISSIONS.SUBMISSION_COMMENT,
  MANAGEMENT_EVIDENCE_VIEW: PERMISSIONS.EVIDENCE_VIEW,
  MANAGEMENT_ACTIVITY_VIEW: PERMISSIONS.ACTIVITY_VIEW,
  MANAGEMENT_MEETING_VIEW: PERMISSIONS.MEETING_VIEW,
  MANAGEMENT_ACTION_VIEW: PERMISSIONS.ACTION_ITEM_VIEW,
  MANAGEMENT_IMPROVEMENT_VIEW: PERMISSIONS.IMPROVEMENT_PLAN_VIEW,
  MANAGEMENT_REPORT_VIEW: PERMISSIONS.VIEW_ALL_REPORTS,
  MANAGEMENT_AQAR_VIEW: PERMISSIONS.AQAR_VIEW,
  MANAGEMENT_AUDIT_VIEW: PERMISSIONS.VIEW_AUDIT_LOGS,
  MANAGEMENT_NOTIFICATION_VIEW: PERMISSIONS.IQAC_COORDINATOR_NOTIFICATION_VIEW,
  MANAGEMENT_NOTIFICATION_SEND: PERMISSIONS.IQAC_COORDINATOR_NOTIFICATION_SEND,
};

export const MANAGEMENT_MODULES = [
  { id: 'dashboard', label: 'Dashboard', path: '/management', icon: 'LayoutDashboard', permission: MP.MANAGEMENT_DASHBOARD_VIEW, exact: true },
  { id: 'overview', label: 'Institution Overview', path: '/management/overview', icon: 'Building2', permission: MP.MANAGEMENT_INSTITUTION_VIEW },
  { id: 'departments', label: 'Departments', path: '/management/departments', icon: 'Layers', permission: MP.MANAGEMENT_DEPARTMENT_VIEW },
  { id: 'comparison', label: 'Comparison', path: '/management/comparison', icon: 'BarChart3', permission: MP.MANAGEMENT_COMPARISON_VIEW },
  { id: 'trends', label: 'Trends', path: '/management/trends', icon: 'TrendingUp', permission: MP.MANAGEMENT_TRENDS_VIEW },
  {
    id: 'analytics', label: 'Analytics', path: '/management/analytics', icon: 'LineChart', permission: MP.MANAGEMENT_ANALYTICS_VIEW,
    children: [
      { id: 'analytics-academic', label: 'Academic', path: '/management/analytics/academic' },
      { id: 'analytics-faculty', label: 'Faculty', path: '/management/analytics/faculty' },
      { id: 'analytics-student', label: 'Students', path: '/management/analytics/student' },
      { id: 'analytics-research', label: 'Research', path: '/management/analytics/research' },
      { id: 'analytics-publication', label: 'Publications', path: '/management/analytics/publication' },
      { id: 'analytics-placement', label: 'Placement', path: '/management/analytics/placement' },
    ],
  },
  { id: 'quality', label: 'Quality', path: '/management/quality', icon: 'Star', permission: MP.MANAGEMENT_QUALITY_VIEW },
  { id: 'compliance', label: 'Compliance', path: '/management/compliance', icon: 'ShieldCheck', permission: MP.MANAGEMENT_COMPLIANCE_VIEW },
  { id: 'accreditation', label: 'Accreditation', path: '/management/accreditation', icon: 'Award', permission: MP.MANAGEMENT_ACCREDITATION_VIEW },
  { id: 'submissions', label: 'Submissions', path: '/management/submissions', icon: 'ClipboardCheck', permission: MP.MANAGEMENT_SUBMISSION_VIEW },
  { id: 'evidence', label: 'Evidence', path: '/management/evidence', icon: 'FolderCheck', permission: MP.MANAGEMENT_EVIDENCE_VIEW },
  { id: 'activities', label: 'Activities', path: '/management/activities', icon: 'Sparkles', permission: MP.MANAGEMENT_ACTIVITY_VIEW },
  { id: 'meetings', label: 'Meetings', path: '/management/meetings', icon: 'CalendarDays', permission: MP.MANAGEMENT_MEETING_VIEW },
  { id: 'actions', label: 'Action Items', path: '/management/action-items', icon: 'CheckSquare', permission: MP.MANAGEMENT_ACTION_VIEW },
  { id: 'improvement', label: 'Improvement Plans', path: '/management/improvement-plans', icon: 'Target', permission: MP.MANAGEMENT_IMPROVEMENT_VIEW },
  { id: 'reports', label: 'Reports', path: '/management/reports', icon: 'FileText', permission: MP.MANAGEMENT_REPORT_VIEW },
  { id: 'aqar', label: 'AQAR', path: '/management/aqar', icon: 'BookOpen', permission: MP.MANAGEMENT_AQAR_VIEW },
  { id: 'audit', label: 'Audit Center', path: '/management/audit', icon: 'ScrollText', permission: MP.MANAGEMENT_AUDIT_VIEW },
  { id: 'notifications', label: 'Notifications', path: '/management/notifications', icon: 'Bell', permission: MP.MANAGEMENT_NOTIFICATION_VIEW },
  { id: 'settings', label: 'Settings', path: '/management/settings', icon: 'Settings', permission: MP.MANAGEMENT_SETTINGS_VIEW },
];

const BASELINE = [
  MP.MANAGEMENT_DASHBOARD_VIEW, MP.MANAGEMENT_INSTITUTION_VIEW,
  MP.MANAGEMENT_DEPARTMENT_VIEW, MP.MANAGEMENT_DEPARTMENT_DETAILS_VIEW,
  MP.MANAGEMENT_ANALYTICS_VIEW, MP.MANAGEMENT_COMPARISON_VIEW, MP.MANAGEMENT_TRENDS_VIEW,
  MP.MANAGEMENT_QUALITY_VIEW, MP.MANAGEMENT_COMPLIANCE_VIEW, MP.MANAGEMENT_ACCREDITATION_VIEW,
  MP.MANAGEMENT_SUBMISSION_VIEW, MP.MANAGEMENT_SUBMISSION_COMMENT, MP.MANAGEMENT_EVIDENCE_VIEW,
  MP.MANAGEMENT_ACTIVITY_VIEW, MP.MANAGEMENT_MEETING_VIEW, MP.MANAGEMENT_ACTION_VIEW,
  MP.MANAGEMENT_IMPROVEMENT_VIEW, MP.MANAGEMENT_REPORT_VIEW, MP.MANAGEMENT_AQAR_VIEW,
  MP.MANAGEMENT_AUDIT_VIEW, MP.MANAGEMENT_NOTIFICATION_VIEW, MP.MANAGEMENT_NOTIFICATION_SEND,
  MP.DEAN_MANAGEMENT_VIEW,
];

export const MANAGEMENT_PORTAL_CONFIG = {
  [ROLES.TECHNICAL_DIRECTOR]: {
    label: 'Technical Director',
    institutionWideAccess: true,
    modules: MANAGEMENT_MODULES.map((m) => m.id),
    permissions: [...BASELINE, MP.MANAGEMENT_SETTINGS_VIEW, MP.MANAGEMENT_SETTINGS_MANAGE, MP.DEAN_ASSIGNMENT_MANAGE],
  },
  [ROLES.INSTITUTION_ADMIN]: {
    label: 'Technical Director',
    institutionWideAccess: true,
    modules: MANAGEMENT_MODULES.map((m) => m.id),
    permissions: [...BASELINE, MP.MANAGEMENT_SETTINGS_VIEW, MP.MANAGEMENT_SETTINGS_MANAGE, MP.DEAN_ASSIGNMENT_MANAGE],
  },
  [ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL]: {
    label: 'Executive Director / Principal',
    institutionWideAccess: true,
    modules: MANAGEMENT_MODULES.map((m) => m.id).filter((id) => id !== 'settings'),
    permissions: BASELINE,
  },
};

export const managementPortalConfig = {
  defaultScope: 'INSTITUTION_WIDE',
  qualityTrendLabels: ['2023-24', '2024-25', '2025-26'],
  thresholds: {
    qualityGood: 85, qualityAttention: 70,
    complianceGood: 90, complianceAttention: 75,
    readinessGood: 80, readinessAttention: 65,
    pendingReviewAlert: 20, overdueActionAlert: 3,
    evidenceCompletenessAlert: 85,
  },
  permissions: {
    canManageDeanAssignments: false, // TD-only via DEAN_ASSIGNMENT_MANAGE
    canManageSettings: false, // TD-only via MANAGEMENT_SETTINGS_MANAGE
    canFinalizeAQAR: false, // stays with authorized AQAR workflow roles
  },
};

export const MANAGEMENT_ROLES = [ROLES.TECHNICAL_DIRECTOR, ROLES.INSTITUTION_ADMIN, ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL];
export const isManagementRole = (role) => MANAGEMENT_ROLES.includes(role);

export const hasManagementPermission = (user, permission) => {
  if (!user || !permission) return false;
  const userPermissions = user.permissions || [];
  if (userPermissions.includes(permission)) return true;
  const roleConfig = MANAGEMENT_PORTAL_CONFIG[user.role];
  if (roleConfig && roleConfig.permissions.includes(permission)) return true;
  const fallback = MANAGEMENT_PERMISSION_FALLBACK[permission];
  if (fallback && userPermissions.includes(fallback)) return true;
  return false;
};

export const getManagementModulesForUser = (user) => {
  if (!user) return [];
  const roleConfig = MANAGEMENT_PORTAL_CONFIG[user.role];
  const allowedIds = roleConfig ? roleConfig.modules : [];
  return MANAGEMENT_MODULES.filter(
    (m) => allowedIds.includes(m.id) && hasManagementPermission(user, m.permission),
  );
};

export const getManagementRoleLabel = (role) => {
  if (role === ROLES.TECHNICAL_DIRECTOR || role === ROLES.INSTITUTION_ADMIN) return 'Technical Director';
  if (role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL) return 'Executive Director / Principal';
  return role || 'Management';
};
