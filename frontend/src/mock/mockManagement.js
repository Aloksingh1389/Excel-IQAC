// Management Portal mock data (Stage 9).
// Executive profiles for the two institution-wide management roles.
// There is no separate PRINCIPAL role: Executive Director IS the Principal.

export const MOCK_MANAGEMENT_PROFILES = [
  {
    id: 'technical-001',
    userId: 'TD001',
    name: 'Dr. Vikram Seth',
    email: 'technical@iqac.demo',
    role: 'TECHNICAL_DIRECTOR',
    designation: 'Technical Director',
    title: 'Technical Director — Highest Management Authority',
    office: 'Directorate, Admin Block',
    scope: 'INSTITUTION_WIDE',
    responsibilities: [
      'Institution-wide visibility and management',
      'All departments and all Deans',
      'Institutional analytics and configuration',
      'Dean assignment management',
      'Audit oversight',
    ],
  },
  {
    id: 'principal-001',
    userId: 'ED001',
    name: 'Dr. H. J. Bhabha',
    email: 'principal@iqac.demo',
    role: 'EXECUTIVE_DIRECTOR_PRINCIPAL',
    designation: 'Executive Director / Principal',
    title: 'Executive Director / Principal — Executive Authority',
    office: 'Principal Office, Admin Block',
    scope: 'INSTITUTION_WIDE',
    responsibilities: [
      'Institution-wide executive management',
      'Departments, analytics and quality oversight',
      'Reports and AQAR review',
      'Activities, actions and improvement monitoring',
    ],
  },
];

export const getManagementProfileByUser = (user) => {
  if (!user) return null;
  return MOCK_MANAGEMENT_PROFILES.find((p) => p.email === user.email || p.id === user.id) || null;
};
