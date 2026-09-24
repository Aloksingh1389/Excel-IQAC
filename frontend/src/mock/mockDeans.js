// Dean portal mock data (Stage 8).
// Deterministic dean profiles and their assigned department scopes.
// Dean A oversees the core engineering cluster; Dean B oversees the
// technology & applied-sciences cluster. No overlap, no random values.

export const MOCK_DEANS = [
  {
    id: 'dean-001',
    userId: 'dean-001',
    name: 'Dr. Anita Desai',
    email: 'dean@iqac.demo',
    title: 'Dean of Academics',
    school: 'School of Engineering (Core)',
    office: 'Admin Block, Room 204',
    phone: '+91 98401 66778',
    assignedDepartmentCodes: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    assignedDepartmentIds: ['dept_cse', 'dept_ece', 'dept_eee', 'dept_mech', 'dept_civil'],
    status: 'ACTIVE',
  },
  {
    id: 'dean-002',
    userId: 'dean-002',
    name: 'Dr. Farooq Ahmed',
    email: 'dean2@iqac.demo',
    title: 'Dean of Emerging Technologies',
    school: 'School of Technology & Applied Sciences',
    office: 'Admin Block, Room 208',
    phone: '+91 98401 66779',
    assignedDepartmentCodes: ['IT', 'AI-DS', 'BIOTECH', 'BME', 'AGRI'],
    assignedDepartmentIds: ['dept_it', 'dept_aids', 'dept_biotech', 'dept_bme', 'dept_agri'],
    status: 'ACTIVE',
  },
];

export const getDeanProfileByUser = (user) => {
  if (!user) return null;
  return (
    MOCK_DEANS.find((d) => d.email === user.email || d.userId === user.id) || null
  );
};

// Canonical fallback when the authenticated dean record carries its own
// assignment (e.g. legacy dean-001 shape): prefer user.assignedDepartments.
export const resolveDeanAssignments = (user) => {
  if (Array.isArray(user?.assignedDepartments) && user.assignedDepartments.length > 0) {
    return user.assignedDepartments;
  }
  const profile = getDeanProfileByUser(user);
  return profile?.assignedDepartmentCodes || [];
};
