// Configuration-driven Navigation structure for IQAC & Institutional Shell

import { PERMISSIONS } from './permissions';
import { ROLES } from './roles';

export const BASE_NAV_ITEMS = [
  {
    id: 'department',
    label: 'Department',
    path: '/department',
    icon: 'Layers',
    permission: PERMISSIONS.DEPARTMENT_DASHBOARD_VIEW,
  },
  {
    id: 'dean',
    label: 'Dean',
    path: '/dean',
    icon: 'Layers',
    permission: PERMISSIONS.DEAN_DASHBOARD_VIEW,
  },
  {
    id: 'management',
    label: 'Management',
    path: '/management',
    icon: 'Layers',
    permission: PERMISSIONS.MANAGEMENT_DASHBOARD_VIEW,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/director/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    id: 'iqac',
    label: 'IQAC',
    path: '/iqac/dashboard',
    icon: 'ShieldCheck',
    permission: PERMISSIONS.IQAC_VIEW,
    children: [
      {
        id: 'iqac_dashboard',
        label: 'Dashboard',
        path: '/iqac/dashboard',
        permission: PERMISSIONS.IQAC_DASHBOARD_VIEW,
      },
      {
        id: 'iqac_accreditation',
        label: 'NAAC Accreditation (Criteria 1–7)',
        path: '/accreditation',
        permission: PERMISSIONS.ACCREDITATION_VIEW,
      },
      {
        id: 'iqac_aqar',
        label: 'Auto-AQAR Generator',
        path: '/aqar',
        permission: PERMISSIONS.AQAR_VIEW,
      },
      {
        id: 'iqac_submissions',
        label: 'Submissions',
        path: '/iqac/submissions',
        permission: PERMISSIONS.SUBMISSION_VIEW,
      },
      {
        id: 'iqac_review',
        label: 'Review Center',
        path: '/iqac/review',
        permission: PERMISSIONS.REVIEW_CENTER_VIEW,
      },
      {
        id: 'iqac_evidence',
        label: 'Evidence Repository',
        path: '/iqac/evidence',
        permission: PERMISSIONS.EVIDENCE_VIEW,
      },
      {
        id: 'iqac_evidence_review',
        label: 'Evidence Review',
        path: '/iqac/evidence/review',
        permission: PERMISSIONS.EVIDENCE_REVIEW,
      },
      {
        id: 'iqac_meetings',
        label: 'Meetings',
        path: '/iqac/meetings',
        permission: PERMISSIONS.MEETING_VIEW,
      },
      {
        id: 'iqac_action_items',
        label: 'Action Items',
        path: '/iqac/action-items',
        permission: PERMISSIONS.ACTION_ITEM_VIEW,
      },
      {
        id: 'iqac_activities',
        label: 'Activities',
        path: '/iqac/activities',
        permission: PERMISSIONS.ACTIVITY_VIEW,
      },
      {
        id: 'iqac_quality_monitoring',
        label: 'Quality Monitoring',
        path: '/iqac/quality-monitoring',
        permission: PERMISSIONS.QUALITY_VIEW,
      },
      {
        id: 'iqac_compliance',
        label: 'Compliance Center',
        path: '/iqac/compliance',
        permission: PERMISSIONS.COMPLIANCE_VIEW,
      },
      {
        id: 'iqac_improvement_plans',
        label: 'Improvement Plans',
        path: '/iqac/improvement-plans',
        permission: PERMISSIONS.IMPROVEMENT_PLAN_VIEW,
      },
      {
        id: 'iqac_departments',
        label: 'Departments',
        path: '/iqac/departments',
        permission: PERMISSIONS.IQAC_DEPARTMENT_VIEW,
      },
      {
        id: 'iqac_coordinators',
        label: 'Coordinators',
        path: '/iqac/coordinators',
        permission: PERMISSIONS.IQAC_COORDINATOR_VIEW,
      },
      {
        id: 'iqac_monitoring',
        label: 'Monitoring',
        path: '/iqac/monitoring',
        permission: PERMISSIONS.IQAC_MONITORING_VIEW,
      },
      {
        id: 'iqac_reports',
        label: 'Reports',
        path: '/iqac/reports',
        permission: PERMISSIONS.IQAC_VIEW,
      },
    ],
  },
  {
    id: 'accreditation',
    label: 'Accreditation (NAAC)',
    path: '/accreditation',
    icon: 'Award',
    permission: PERMISSIONS.ACCREDITATION_VIEW,
    children: [
      {
        id: 'accreditation_overview',
        label: 'Accreditation Overview',
        path: '/accreditation',
        exact: true,
      },
      {
        id: 'accreditation_aqar',
        label: 'Auto-AQAR Generator',
        path: '/aqar',
      },
      {
        id: 'accreditation_metrics',
        label: 'Metrics Catalog',
        path: '/accreditation/metrics',
      },
      {
        id: 'accreditation_gaps',
        label: 'Gap Analysis Center',
        path: '/accreditation/gaps',
      },
      {
        id: 'accreditation_evidence_gaps',
        label: 'Evidence Gaps',
        path: '/accreditation/evidence-gaps',
      },
      {
        id: 'accreditation_data_gaps',
        label: 'Data Gaps',
        path: '/accreditation/data-gaps',
      },
      {
        id: 'accreditation_departments',
        label: 'Department Readiness',
        path: '/accreditation/departments',
      },
      {
        id: 'accreditation_framework',
        label: 'Framework Settings',
        path: '/accreditation/framework',
      },
    ],
  },
  {
    id: 'institution',
    label: 'Institution',
    path: '/director/institution',
    icon: 'Building2',
    permission: PERMISSIONS.VIEW_INSTITUTION,
    children: [
      {
        id: 'institution_overview',
        label: 'Overview',
        path: '/director/institution',
        exact: true,
      },
      {
        id: 'institution_departments',
        label: 'Departments',
        path: '/director/institution/departments',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/director/analytics',
    icon: 'BarChart3',
    permission: PERMISSIONS.VIEW_ALL_ANALYTICS,
    children: [
      {
        id: 'analytics_overview',
        label: 'Analytics Overview',
        path: '/director/analytics',
        exact: true,
      },
      {
        id: 'analytics_academic',
        label: 'Academic Analytics',
        path: '/director/analytics/academic',
      },
      {
        id: 'analytics_students',
        label: 'Student Analytics',
        path: '/director/analytics/students',
      },
      {
        id: 'analytics_faculty',
        label: 'Faculty Analytics',
        path: '/director/analytics/faculty',
      },
      {
        id: 'analytics_research',
        label: 'Research & Innovation',
        path: '/director/analytics/research',
      },
      {
        id: 'analytics_publications',
        label: 'Publications',
        path: '/director/analytics/publications',
      },
      {
        id: 'analytics_placement',
        label: 'Placement Analytics',
        path: '/director/analytics/placement',
      },
      {
        id: 'analytics_departments',
        label: 'Department Comparison',
        path: '/director/analytics/departments',
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/director/reports',
    icon: 'FileText',
    permission: PERMISSIONS.VIEW_REPORTS,
    children: [
      {
        id: 'reports_center',
        label: 'Report Center',
        path: '/director/reports',
        exact: true,
      },
      {
        id: 'reports_generate',
        label: 'Generate Report',
        path: '/director/reports/generate',
      },
      {
        id: 'reports_history',
        label: 'Report History',
        path: '/director/reports/history',
      },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/director/notifications',
    icon: 'Bell',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/director/settings',
    icon: 'Settings',
  },
];

export const DIRECTOR_NAV_ITEMS = BASE_NAV_ITEMS;

export const getNavItemsForUser = (user) => {
  if (!user) return DIRECTOR_NAV_ITEMS;
  const userPermissions = user.permissions || [];

  return BASE_NAV_ITEMS.filter((item) => {
    if (item.permission && !userPermissions.includes(item.permission)) {
      return false;
    }
    return true;
  }).map((item) => {
    if (item.children) {
      const filteredChildren = item.children.filter((child) => {
        if (child.permission && !userPermissions.includes(child.permission)) {
          return false;
        }
        return true;
      });
      return { ...item, children: filteredChildren };
    }
    return item;
  });
};
