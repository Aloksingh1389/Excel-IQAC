// Deterministic department-portal enrichment data (Stage 7).
// Extends the existing MOCK_DEPARTMENTS (src/data/mockIQAC.js) with quality,
// compliance, accreditation and staffing scenarios. All values are static and
// deterministic so dashboards render meaningfully without a backend.

const FIRST_NAMES = [
  'Rajesh', 'Ananya', 'Vikramaditya', 'Sameer', 'Malini', 'Arvind', 'Rohini',
  'Suresh', 'Meenakshi', 'Anand', 'Kavya', 'Deepak', 'Lakshmi', 'Manoj',
  'Nandini', 'Prakash', 'Divya', 'Karthik', 'Shalini', 'Ravi',
];

const LAST_NAMES = [
  'Kumar', 'Gupta', 'Sen', 'Khan', 'Roy', 'Sharma', 'Das', 'Iyer',
  'Menon', 'Verma', 'Reddy', 'Nair', 'Pillai', 'Joshi', 'Patel',
  'Singh', 'Chandra', 'Bose', 'Kulkarni', 'Mishra',
];

const DESIGNATIONS = [
  'Professor', 'Associate Professor', 'Associate Professor',
  'Assistant Professor', 'Assistant Professor', 'Assistant Professor',
];

// Simple deterministic hash so generated staff are stable across reloads.
const hashString = (str = '') => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

export const DEPARTMENT_PORTAL_PROFILES = {
  CSE: {
    scenario: 'HIGH_PERFORMING',
    hodName: 'Dr. Ramesh Sharma', hodEmail: 'hod@iqac.demo',
    coordinatorName: 'Prof. Priya Nair', coordinatorEmail: 'coordinator.cse@iqac.demo',
    qualityScore: 91, complianceRate: 96, accreditationReadiness: 89,
    openActions: 4, overdueActions: 0,
    categories: { Academic: 93, Faculty: 90, Research: 94, Student: 89, Evidence: 92, Compliance: 96, Activities: 88, IQAC: 93 },
    criteriaReadiness: { 1: 92, 2: 88, 3: 95, 4: 84, 5: 86, 6: 90, 7: 88 },
    trend: [86, 87, 89, 90, 91],
    staffSize: 24,
  },
  EEE: {
    scenario: 'MANY_PENDING_REVIEWS',
    hodName: 'Dr. N. K. Balaji', hodEmail: 'hod.eee@iqac.demo',
    coordinatorName: 'Dr. Sunita Rao', coordinatorEmail: 'coordinator.eee@iqac.demo',
    qualityScore: 68, complianceRate: 61, accreditationReadiness: 58,
    openActions: 18, overdueActions: 6,
    categories: { Academic: 70, Faculty: 62, Research: 66, Student: 71, Evidence: 58, Compliance: 61, Activities: 64, IQAC: 60 },
    criteriaReadiness: { 1: 66, 2: 61, 3: 64, 4: 52, 5: 58, 6: 63, 7: 55 },
    trend: [72, 70, 69, 68, 68],
    staffSize: 20,
  },
  ECE: {
    scenario: 'EVIDENCE_GAPS',
    hodName: 'Dr. K. V. Raman', hodEmail: 'hod.ece@iqac.demo',
    coordinatorName: 'Dr. K. V. Raman', coordinatorEmail: 'coordinator.ece@iqac.demo',
    qualityScore: 76, complianceRate: 82, accreditationReadiness: 70,
    openActions: 10, overdueActions: 2,
    categories: { Academic: 80, Faculty: 78, Research: 79, Student: 77, Evidence: 61, Compliance: 82, Activities: 75, IQAC: 74 },
    criteriaReadiness: { 1: 78, 2: 74, 3: 77, 4: 60, 5: 68, 6: 75, 7: 66 },
    trend: [74, 75, 74, 76, 76],
    staffSize: 22,
  },
  CIVIL: {
    scenario: 'COMPLIANCE_ISSUES',
    hodName: 'Dr. Meera Nambiar', hodEmail: 'hod.civil@iqac.demo',
    coordinatorName: 'Dr. Mahesh Babu', coordinatorEmail: 'coordinator.civil@iqac.demo',
    qualityScore: 71, complianceRate: 58, accreditationReadiness: 64,
    openActions: 12, overdueActions: 4,
    categories: { Academic: 74, Faculty: 70, Research: 66, Student: 72, Evidence: 69, Compliance: 58, Activities: 70, IQAC: 68 },
    criteriaReadiness: { 1: 70, 2: 66, 3: 62, 4: 64, 5: 60, 6: 68, 7: 63 },
    trend: [70, 69, 70, 71, 71],
    staffSize: 18,
  },
  MECH: {
    scenario: 'STRONG_IMPROVEMENT',
    hodName: 'Dr. Anand Verma', hodEmail: 'hod.mech@iqac.demo',
    coordinatorName: 'Prof. Suresh V.', coordinatorEmail: 'coordinator.mech@iqac.demo',
    qualityScore: 86, complianceRate: 90, accreditationReadiness: 83,
    openActions: 6, overdueActions: 1,
    categories: { Academic: 87, Faculty: 85, Research: 88, Student: 84, Evidence: 86, Compliance: 90, Activities: 85, IQAC: 87 },
    criteriaReadiness: { 1: 86, 2: 84, 3: 89, 4: 78, 5: 80, 6: 85, 7: 82 },
    trend: [76, 79, 82, 84, 86],
    staffSize: 22,
  },
  'AI-DS': {
    scenario: 'ACCREDITATION_GAPS',
    hodName: 'Dr. Anand Verma', hodEmail: 'hod.aids@iqac.demo',
    coordinatorName: 'Dr. Anand Verma', coordinatorEmail: 'coordinator.aids@iqac.demo',
    qualityScore: 73, complianceRate: 78, accreditationReadiness: 59,
    openActions: 9, overdueActions: 2,
    categories: { Academic: 78, Faculty: 74, Research: 72, Student: 76, Evidence: 70, Compliance: 78, Activities: 73, IQAC: 71 },
    criteriaReadiness: { 1: 72, 2: 68, 3: 70, 4: 52, 5: 55, 6: 66, 7: 58 },
    trend: [70, 71, 72, 72, 73],
    staffSize: 18,
  },
  IT: {
    scenario: 'STABLE',
    hodName: 'Dr. Sunita Rao', hodEmail: 'hod.it@iqac.demo',
    coordinatorName: 'Prof. Meenakshi S.', coordinatorEmail: 'coordinator.it@iqac.demo',
    qualityScore: 84, complianceRate: 89, accreditationReadiness: 80,
    openActions: 6, overdueActions: 1,
    categories: { Academic: 85, Faculty: 83, Research: 82, Student: 84, Evidence: 83, Compliance: 89, Activities: 82, IQAC: 84 },
    criteriaReadiness: { 1: 84, 2: 80, 3: 83, 4: 74, 5: 77, 6: 82, 7: 79 },
    trend: [81, 82, 83, 83, 84],
    staffSize: 20,
  },
  BIOTECH: {
    scenario: 'STABLE',
    hodName: 'Dr. P. Chakraborty', hodEmail: 'hod.biotech@iqac.demo',
    coordinatorName: 'Dr. Rohini Das', coordinatorEmail: 'coordinator.biotech@iqac.demo',
    qualityScore: 88, complianceRate: 92, accreditationReadiness: 84,
    openActions: 4, overdueActions: 0,
    categories: { Academic: 89, Faculty: 87, Research: 91, Student: 86, Evidence: 88, Compliance: 92, Activities: 85, IQAC: 88 },
    criteriaReadiness: { 1: 88, 2: 85, 3: 92, 4: 78, 5: 80, 6: 86, 7: 83 },
    trend: [85, 86, 87, 87, 88],
    staffSize: 16,
  },
  BME: {
    scenario: 'STABLE',
    hodName: 'Dr. S. K. Roy', hodEmail: 'hod.bme@iqac.demo',
    coordinatorName: 'Dr. S. K. Roy', coordinatorEmail: 'coordinator.bme@iqac.demo',
    qualityScore: 85, complianceRate: 90, accreditationReadiness: 81,
    openActions: 3, overdueActions: 0,
    categories: { Academic: 86, Faculty: 84, Research: 85, Student: 83, Evidence: 84, Compliance: 90, Activities: 83, IQAC: 85 },
    criteriaReadiness: { 1: 85, 2: 82, 3: 84, 4: 76, 5: 78, 6: 83, 7: 80 },
    trend: [82, 83, 84, 84, 85],
    staffSize: 15,
  },
  AGRI: {
    scenario: 'NEEDS_COORDINATOR',
    hodName: 'Dr. Ramesh Chandra', hodEmail: 'hod.agri@iqac.demo',
    coordinatorName: 'Unassigned', coordinatorEmail: '',
    qualityScore: 66, complianceRate: 64, accreditationReadiness: 57,
    openActions: 8, overdueActions: 3,
    categories: { Academic: 68, Faculty: 64, Research: 62, Student: 67, Evidence: 63, Compliance: 64, Activities: 65, IQAC: 60 },
    criteriaReadiness: { 1: 65, 2: 62, 3: 60, 4: 54, 5: 56, 6: 61, 7: 55 },
    trend: [64, 65, 65, 66, 66],
    staffSize: 15,
  },
  DEFAULT: {},
};

export const getDepartmentPortalProfile = (departmentCode) => (
  DEPARTMENT_PORTAL_PROFILES[departmentCode] || DEPARTMENT_PORTAL_PROFILES.CSE
);

// Deterministic per-department staff directory generator.
export const generateDepartmentStaff = (departmentCode, departmentId, departmentName) => {
  const profile = getDepartmentPortalProfile(departmentCode);
  const size = profile.staffSize || 18;
  const seedBase = hashString(departmentCode || 'CSE');
  const staff = [];
  for (let i = 0; i < size; i += 1) {
    const h = hashString(`${departmentCode}-${i}-${seedBase}`);
    const first = FIRST_NAMES[h % FIRST_NAMES.length];
    const last = LAST_NAMES[Math.floor(h / 7) % LAST_NAMES.length];
    const designation = DESIGNATIONS[h % DESIGNATIONS.length];
    const submissions = 4 + (h % 20);
    const verified = Math.max(0, submissions - (h % 5) - 1);
    const pending = h % 4 === 0 ? 1 + (h % 3) : h % 2;
    const profileCompletion = 62 + (h % 39);
    const tasks = h % 5;
    const statusSeed = h % 10;
    const status = statusSeed < 7 ? 'Active' : statusSeed < 9 ? 'On Leave' : 'Active';
    staff.push({
      id: `staff-${(departmentCode || 'dept').toLowerCase()}-${String(i + 1).padStart(2, '0')}`,
      name: `${designation === 'Professor' ? 'Dr.' : 'Prof.'} ${first} ${last}`,
      employeeId: `FAC-${departmentCode}-${String(100 + i)}`,
      designation,
      departmentId,
      departmentCode,
      departmentName,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@iqac.demo`,
      phone: `+91 98${String(10000000 + (h % 89999999))}`,
      dateOfJoining: `${2012 + (h % 12)}-${String(1 + (h % 12)).padStart(2, '0')}-15`,
      qualification: designation === 'Professor' ? 'Ph.D.' : h % 2 === 0 ? 'Ph.D.' : 'M.E. / M.Tech',
      specialization: 'Core departmental specialization',
      experienceYears: 3 + (h % 18),
      profileCompletion,
      submissionsCount: submissions,
      verifiedCount: verified,
      pendingCount: pending,
      tasksCount: tasks,
      status,
    });
  }
  return staff;
};
