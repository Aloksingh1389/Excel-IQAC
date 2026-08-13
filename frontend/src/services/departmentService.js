import { getItem, setItem, STORAGE_KEYS } from './localStorageHelper';
import { mockResponse, mockError } from './api';

export const departmentService = {
  async getDepartments() {
    const depts = getItem(STORAGE_KEYS.DEPARTMENTS) || [];
    return mockResponse(depts);
  },

  async getDepartmentById(id) {
    const depts = getItem(STORAGE_KEYS.DEPARTMENTS) || [];
    const dept = depts.find((d) => d.id === id);
    if (!dept) return mockError('Department not found', 404);
    return mockResponse(dept);
  },

  async updateDepartment(id, updates) {
    const depts = getItem(STORAGE_KEYS.DEPARTMENTS) || [];
    const updated = depts.map((d) => (d.id === id ? { ...d, ...updates } : d));
    setItem(STORAGE_KEYS.DEPARTMENTS, updated);
    return mockResponse(updated.find((d) => d.id === id));
  },
};

export const facultyService = {
  async getFaculty(departmentId = null) {
    const faculty = getItem(STORAGE_KEYS.FACULTY) || [];
    if (departmentId) {
      return mockResponse(faculty.filter((f) => f.departmentId === departmentId));
    }
    return mockResponse(faculty);
  },

  async getFacultyById(id) {
    const faculty = getItem(STORAGE_KEYS.FACULTY) || [];
    const member = faculty.find((f) => f.id === id || f.userId === id);
    if (!member) return mockError('Faculty member not found', 404);
    return mockResponse(member);
  },

  async updateFacultyStatus(id, newStatus) {
    const faculty = getItem(STORAGE_KEYS.FACULTY) || [];
    const updated = faculty.map((f) => (f.id === id ? { ...f, status: newStatus } : f));
    setItem(STORAGE_KEYS.FACULTY, updated);
    return mockResponse(updated.find((f) => f.id === id));
  },
};
