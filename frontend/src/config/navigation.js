import { PERMISSIONS } from './permissions';

export const NAVIGATION_SECTIONS = [
  {
    title: 'Core Menu',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'LayoutDashboard',
        requiredPermission: PERMISSIONS.VIEW_OWN_PROFILE,
      },
      {
        id: 'profile',
        label: 'My Profile',
        path: '/profile',
        icon: 'UserCircle',
        requiredPermission: PERMISSIONS.VIEW_OWN_PROFILE,
      },
    ],
  },
  {
    title: 'Academic & Faculty Data',
    items: [
      {
        id: 'academic',
        label: 'Academic Information',
        path: '/academic',
        icon: 'GraduationCap',
        requiredPermission: PERMISSIONS.VIEW_ACADEMIC_INFO,
      },
      {
        id: 'publications',
        label: 'Publications',
        path: '/publications',
        icon: 'BookOpen',
        requiredPermission: PERMISSIONS.VIEW_PUBLICATIONS,
      },
      {
        id: 'research',
        label: 'Research & Grants',
        path: '/research',
        icon: 'FlaskConical',
        requiredPermission: PERMISSIONS.VIEW_RESEARCH,
      },
      {
        id: 'fdp',
        label: 'FDP & Training',
        path: '/fdp',
        icon: 'Award',
        requiredPermission: PERMISSIONS.VIEW_FDP,
      },
      {
        id: 'achievements',
        label: 'Achievements',
        path: '/achievements',
        icon: 'Trophy',
        requiredPermission: PERMISSIONS.VIEW_ACHIEVEMENTS,
      },
    ],
  },
  {
    title: 'Department Management',
    items: [
      {
        id: 'hod-faculty',
        label: 'Faculty Management',
        path: '/hod/faculty',
        icon: 'Users',
        requiredPermission: PERMISSIONS.MANAGE_DEPARTMENT_FACULTY,
      },
      {
        id: 'hod-approvals',
        label: 'Approval Center',
        path: '/hod/approvals',
        icon: 'CheckSquare',
        badge: 'pending_approvals',
        requiredPermission: PERMISSIONS.APPROVE_STAFF_SUBMISSIONS,
      },
      {
        id: 'hod-analytics',
        label: 'Department Analytics',
        path: '/hod/analytics',
        icon: 'BarChart3',
        requiredPermission: PERMISSIONS.VIEW_DEPARTMENT_ANALYTICS,
      },
    ],
  },
  {
    title: 'Dean Portfolio',
    items: [
      {
        id: 'dean-analytics',
        label: 'Dean Portfolio & Analytics',
        path: '/dean/analytics',
        icon: 'PieChart',
        requiredPermission: PERMISSIONS.VIEW_DEAN_ANALYTICS,
      },
    ],
  },
  {
    title: 'IQAC & Quality Cell',
    items: [
      {
        id: 'iqac-comparison',
        label: 'Department Comparison',
        path: '/iqac/departments',
        icon: 'Building2',
        requiredPermission: PERMISSIONS.COMPARE_DEPARTMENTS,
      },
      {
        id: 'iqac-approvals',
        label: 'Institutional Approvals',
        path: '/iqac/approvals',
        icon: 'ShieldCheck',
        badge: 'iqac_approvals',
        requiredPermission: PERMISSIONS.APPROVE_HOD,
      },
      {
        id: 'iqac-verification',
        label: 'Evidence Verification',
        path: '/iqac/verification',
        icon: 'FileCheck2',
        requiredPermission: PERMISSIONS.VERIFY_EVIDENCE,
      },
      {
        id: 'iqac-initiatives',
        label: 'Quality Initiatives',
        path: '/iqac/initiatives',
        icon: 'Sparkles',
        requiredPermission: PERMISSIONS.MANAGE_QUALITY_INITIATIVES,
      },
      {
        id: 'iqac-audits',
        label: 'Internal Audits',
        path: '/iqac/audits',
        icon: 'ClipboardList',
        requiredPermission: PERMISSIONS.VIEW_AUDITS,
      },
      {
        id: 'iqac-accreditation',
        label: 'Accreditation (NAAC)',
        path: '/iqac/accreditation',
        icon: 'Target',
        requiredPermission: PERMISSIONS.MANAGE_ACCREDITATION,
      },
    ],
  },
  {
    title: 'Executive Governance',
    items: [
      {
        id: 'director-overview',
        label: 'Institutional Analytics',
        path: '/director/overview',
        icon: 'TrendingUp',
        requiredPermission: PERMISSIONS.VIEW_INSTITUTION_OVERVIEW,
      },
      {
        id: 'director-iqac-control',
        label: 'IQAC Head Control',
        path: '/director/iqac-head-control',
        icon: 'ShieldAlert',
        requiredPermission: PERMISSIONS.MANAGE_IQAC_HEAD,
      },
    ],
  },
  {
    title: 'Repository & Output',
    items: [
      {
        id: 'documents',
        label: 'Documents Hub',
        path: '/documents',
        icon: 'FolderOpen',
        requiredPermission: PERMISSIONS.VIEW_DOCUMENTS,
      },
      {
        id: 'reports',
        label: 'Reports Center',
        path: '/reports',
        icon: 'FileText',
        requiredPermission: PERMISSIONS.VIEW_OWN_PROFILE,
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        id: 'notifications',
        label: 'Notifications',
        path: '/notifications',
        icon: 'Bell',
        badge: 'unread_notifications',
        requiredPermission: PERMISSIONS.VIEW_OWN_PROFILE,
      },
      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: 'Settings',
        requiredPermission: PERMISSIONS.VIEW_OWN_PROFILE,
      },
    ],
  },
];
