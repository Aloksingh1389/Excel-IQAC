// Institutional Role & Designation Definitions

export const ROLES = {
  TECHNICAL_DIRECTOR: 'TECHNICAL_DIRECTOR',
  EXECUTIVE_DIRECTOR_PRINCIPAL: 'EXECUTIVE_DIRECTOR_PRINCIPAL',
  INSTITUTION_ADMIN: 'INSTITUTION_ADMIN',
  IQAC_HEAD: 'IQAC_HEAD',
  IQAC_MEMBER: 'IQAC_MEMBER',
  IQAC_COORDINATOR: 'IQAC_COORDINATOR',
  DEAN: 'DEAN',
  HOD: 'HOD',
  STAFF: 'STAFF',
};

export const DESIGNATIONS = {
  TECHNICAL_DIRECTOR: 'TECHNICAL_DIRECTOR',
  EXECUTIVE_DIRECTOR_PRINCIPAL: 'EXECUTIVE_DIRECTOR_PRINCIPAL',
  PRINCIPAL: 'EXECUTIVE_DIRECTOR_PRINCIPAL',
  DIRECTOR: 'TECHNICAL_DIRECTOR',
  IQAC_HEAD: 'IQAC_HEAD',
  IQAC_COORDINATOR: 'IQAC_COORDINATOR',
  DEAN_ACADEMICS: 'DEAN_ACADEMICS',
  DEAN_RESEARCH: 'DEAN_RESEARCH',
  HOD_CSE: 'HOD_CSE',
  PROFESSOR: 'PROFESSOR',
  ASSOCIATE_PROFESSOR: 'ASSOCIATE_PROFESSOR',
  ASSISTANT_PROFESSOR: 'ASSISTANT_PROFESSOR',
};

/**
 * Returns human-readable label for user-facing UI.
 * Never displays raw "INSTITUTION_ADMIN" to the user.
 */
export const getDesignationDisplay = (designation, role) => {
  if (
    designation === DESIGNATIONS.TECHNICAL_DIRECTOR ||
    designation === 'TECHNICAL_DIRECTOR' ||
    designation === 'DIRECTOR' ||
    role === ROLES.TECHNICAL_DIRECTOR
  ) {
    return 'Technical Director';
  }
  if (
    designation === DESIGNATIONS.EXECUTIVE_DIRECTOR_PRINCIPAL ||
    designation === 'EXECUTIVE_DIRECTOR_PRINCIPAL' ||
    designation === 'PRINCIPAL' ||
    role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL
  ) {
    return 'Executive Director & Principal';
  }
  if (role === ROLES.INSTITUTION_ADMIN) {
    return 'Technical Director';
  }
  if (role === ROLES.IQAC_HEAD) {
    return 'IQAC Head / Director';
  }
  if (role === ROLES.IQAC_COORDINATOR || designation === 'IQAC_COORDINATOR') {
    return 'Department IQAC Coordinator';
  }
  if (role === ROLES.IQAC_MEMBER) {
    return 'IQAC Committee Member';
  }
  if (role === ROLES.DEAN) {
    return 'Dean';
  }
  if (role === ROLES.HOD) {
    return 'Head of Department (HOD)';
  }
  if (role === ROLES.STAFF) {
    return 'Faculty / Staff';
  }
  return designation || role || 'Faculty';
};
