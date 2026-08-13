import { INITIAL_USERS } from '../data/users';
import { INITIAL_DEPARTMENTS } from '../data/departments';
import { INITIAL_FACULTY } from '../data/faculty';
import { INITIAL_STUDENTS } from '../data/students';
import { INITIAL_PUBLICATIONS } from '../data/publications';
import { INITIAL_RESEARCH } from '../data/research';
import { INITIAL_FDPS } from '../data/fdps';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { INITIAL_ACADEMIC_RECORDS } from '../data/academicRecords';
import { INITIAL_DOCUMENTS } from '../data/documents';
import { INITIAL_APPROVALS } from '../data/approvals';
import { INITIAL_QUALITY_INITIATIVES } from '../data/qualityInitiatives';
import { INITIAL_AUDITS } from '../data/audits';
import { NAAC_CRITERIA } from '../data/accreditation';
import { INITIAL_NOTIFICATIONS } from '../data/notifications';
import { INITIAL_GENERATED_REPORTS } from '../data/reports';

const STORAGE_KEYS = {
  USERS: 'iqac_users_data',
  CURRENT_USER: 'iqac_current_user',
  CURRENT_ACADEMIC_YEAR: 'iqac_academic_year',
  DEPARTMENTS: 'iqac_departments_data',
  FACULTY: 'iqac_faculty_data',
  STUDENTS: 'iqac_students_data',
  PUBLICATIONS: 'iqac_publications_data',
  RESEARCH: 'iqac_research_data',
  FDPS: 'iqac_fdps_data',
  ACHIEVEMENTS: 'iqac_achievements_data',
  ACADEMIC_RECORDS: 'iqac_academic_records_data',
  DOCUMENTS: 'iqac_documents_data',
  APPROVALS: 'iqac_approvals_data',
  QUALITY_INITIATIVES: 'iqac_quality_initiatives_data',
  AUDITS: 'iqac_audits_data',
  ACCREDITATION: 'iqac_accreditation_data',
  NOTIFICATIONS: 'iqac_notifications_data',
  REPORTS: 'iqac_reports_data',
  SETTINGS: 'iqac_settings_data',
};

// Seed storage if empty
export const initializeLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default to Staff user for demo
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_ACADEMIC_YEAR)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ACADEMIC_YEAR, '2026 - 2027');
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FACULTY)) {
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(INITIAL_FACULTY));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PUBLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.PUBLICATIONS, JSON.stringify(INITIAL_PUBLICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESEARCH)) {
    localStorage.setItem(STORAGE_KEYS.RESEARCH, JSON.stringify(INITIAL_RESEARCH));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FDPS)) {
    localStorage.setItem(STORAGE_KEYS.FDPS, JSON.stringify(INITIAL_FDPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(INITIAL_ACHIEVEMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACADEMIC_RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.ACADEMIC_RECORDS, JSON.stringify(INITIAL_ACADEMIC_RECORDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPROVALS)) {
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(INITIAL_APPROVALS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUALITY_INITIATIVES)) {
    localStorage.setItem(STORAGE_KEYS.QUALITY_INITIATIVES, JSON.stringify(INITIAL_QUALITY_INITIATIVES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDITS)) {
    localStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(INITIAL_AUDITS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACCREDITATION)) {
    localStorage.setItem(STORAGE_KEYS.ACCREDITATION, JSON.stringify(NAAC_CRITERIA));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_GENERATED_REPORTS));
  }
};

export const getItem = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error writing to localStorage:', err);
  }
};

export { STORAGE_KEYS };
