// Configuration-driven Navigation structure for Director/Principal Shell

export const DIRECTOR_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/director/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    id: 'institution',
    label: 'Institution',
    path: '/director/institution',
    icon: 'Building2',
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
