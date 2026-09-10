// Mock Dashboard Dataset for Stage 1 Director / Principal Shell

export const MOCK_DASHBOARD_STATS = [
  {
    id: 'students',
    title: 'Total Students',
    value: '3,520',
    subtitle: 'Enrolled across UG & PG programs',
    icon: 'GraduationCap',
    color: 'blue',
  },
  {
    id: 'faculty',
    title: 'Total Faculty',
    value: '420',
    subtitle: 'Doctorates & Teaching Staff',
    icon: 'Users',
    color: 'indigo',
  },
  {
    id: 'departments',
    title: 'Departments',
    value: '12',
    subtitle: 'Active Engineering & Science Depts',
    icon: 'Building2',
    color: 'emerald',
  },
  {
    id: 'pending_reviews',
    title: 'Pending Reviews',
    value: '18',
    subtitle: 'Institutional submissions awaiting review',
    icon: 'Clock',
    color: 'amber',
  },
];

export const MOCK_QUICK_ACTIONS = [
  {
    id: 'action_institution',
    title: 'View Institution',
    description: 'Overview of all academic departments, faculty roster, and infrastructure',
    path: '/director/institution',
    icon: 'Building2',
  },
  {
    id: 'action_analytics',
    title: 'View Analytics',
    description: 'Explore academic performance, research output, and placement statistics',
    path: '/director/analytics',
    icon: 'BarChart3',
  },
  {
    id: 'action_reports',
    title: 'View Reports',
    description: 'Access generated AQAR dossiers, NAAC tables, and compliance reports',
    path: '/director/reports',
    icon: 'FileText',
  },
  {
    id: 'action_notifications',
    title: 'View Notifications',
    description: 'Review institutional activity alerts, requests, and system updates',
    path: '/director/notifications',
    icon: 'Bell',
  },
];

export const MOCK_RECENT_ACTIVITY = [
  {
    id: 'act_001',
    title: 'IQAC Head approved HOD account',
    description: 'Administrative credentials authorized for Computer Science department.',
    timestamp: '10 minutes ago',
    icon: 'CheckCircle2',
    type: 'APPROVAL',
  },
  {
    id: 'act_002',
    title: 'IT department submitted annual report',
    description: 'Comprehensive departmental data for 2026-27 submitted for verification.',
    timestamp: '45 minutes ago',
    icon: 'FileText',
    type: 'SUBMISSION',
  },
  {
    id: 'act_003',
    title: 'Research report generated',
    description: 'Consolidated research grants and Scopus indexed publications compiled.',
    timestamp: '2 hours ago',
    icon: 'Sparkles',
    type: 'REPORT',
  },
  {
    id: 'act_004',
    title: 'New institutional document uploaded',
    description: 'Internal Quality Assurance policy manual revision 2.4 deposited.',
    timestamp: 'Yesterday',
    icon: 'UploadCloud',
    type: 'DOCUMENT',
  },
];

export const MOCK_ATTENTION_ITEMS = [
  {
    id: 'att_001',
    title: '18 submissions pending verification',
    description: 'Faculty publications, FDP certificates, and funded research proposals require executive sign-off.',
    targetPath: '/director/institution',
    urgency: 'high',
  },
  {
    id: 'att_002',
    title: '7 department reports awaiting review',
    description: 'Annual academic results and syllabus completion audits pending review.',
    targetPath: '/director/reports',
    urgency: 'medium',
  },
  {
    id: 'att_003',
    title: '4 documents require attention',
    description: 'Accreditation evidence files missing departmental signatures.',
    targetPath: '/director/institution',
    urgency: 'low',
  },
];
