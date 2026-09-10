// Mock Notifications Dataset for Director / Principal Portal

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_001',
    title: 'New department report available',
    description: 'Computer Science & Engineering department uploaded the FY 2026-27 comprehensive dossier.',
    timestamp: '10 minutes ago',
    read: false,
    type: 'REPORT',
  },
  {
    id: 'notif_002',
    title: 'IT department submitted annual data',
    description: 'Head of Information Technology submitted faculty teaching and OBE attainment records.',
    timestamp: '45 minutes ago',
    read: false,
    type: 'SUBMISSION',
  },
  {
    id: 'notif_003',
    title: 'IQAC verification pending',
    description: '18 research grants and faculty publications are awaiting institutional executive endorsement.',
    timestamp: '2 hours ago',
    read: false,
    type: 'VERIFICATION',
  },
  {
    id: 'notif_004',
    title: 'New institutional report generated',
    description: 'NAAC AQAR Master compilation draft has been prepared and is ready for executive preview.',
    timestamp: 'Yesterday at 04:15 PM',
    read: true,
    type: 'SYSTEM',
  },
  {
    id: 'notif_005',
    title: 'Internal Quality Audit Scheduled',
    description: 'Academic & Administrative Audit (AAA) for Mechanical Engineering scheduled for next week.',
    timestamp: '2 days ago',
    read: true,
    type: 'AUDIT',
  },
];
