// Centralized Quality Alerts & Attention Engine (Stage 5F)

export const qualityAlertService = {
  getQualityAlerts: async () => {
    return [
      {
        id: 'alt_001',
        title: 'Mechanical Engineering FDP Rate Below Warning Threshold',
        description: 'FDP completion rate is 45%, falling below the 75% warning benchmark. Improvement Plan IP-001 active.',
        priority: 'CRITICAL',
        departmentCode: 'MECH',
        category: 'TRAINING',
        timestamp: 'Today at 09:00 AM',
        targetRoute: '/iqac/improvement-plans/IP-2026-00101',
      },
      {
        id: 'alt_002',
        title: 'ECE Department Missing 3 Scopus Paper Landing Page Proofs',
        description: '3 publication submissions pending evidence verificationlanding page proofs.',
        priority: 'HIGH',
        departmentCode: 'ECE',
        category: 'EVIDENCE',
        timestamp: 'Yesterday at 04:30 PM',
        targetRoute: '/iqac/evidence',
      },
      {
        id: 'alt_003',
        title: 'Civil Engineering Has 4 Overdue IQAC Resolution Action Items',
        description: 'Action items pending past target due dates requiring HOD intervention.',
        priority: 'HIGH',
        departmentCode: 'CIVIL',
        category: 'OPERATIONS',
        timestamp: '12 Sep 2026',
        targetRoute: '/iqac/action-items',
      },
    ];
  },
};
