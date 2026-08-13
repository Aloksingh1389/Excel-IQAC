import { getItem, setItem, STORAGE_KEYS } from './localStorageHelper';
import { mockResponse, mockError } from './api';

export const achievementService = {
  async getAchievements(filters = {}) {
    let list = getItem(STORAGE_KEYS.ACHIEVEMENTS) || [];
    if (filters.departmentId) list = list.filter((a) => a.departmentId === filters.departmentId);
    if (filters.type) list = list.filter((a) => a.type === filters.type);
    if (filters.category) list = list.filter((a) => a.category === filters.category);
    return mockResponse(list);
  },

  async createAchievement(data, currentUser) {
    const list = getItem(STORAGE_KEYS.ACHIEVEMENTS) || [];
    const newAch = {
      id: `ach_${Date.now()}`,
      departmentId: currentUser.departmentId || 'dept_cse',
      departmentName: currentUser.departmentName || 'Computer Science and Engineering',
      academicYear: data.academicYear || '2026 - 2027',
      submittedBy: currentUser.name,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED',
      ...data,
    };
    setItem(STORAGE_KEYS.ACHIEVEMENTS, [newAch, ...list]);

    const approvals = getItem(STORAGE_KEYS.APPROVALS) || [];
    const newAppr = {
      id: `appr_${Date.now()}`,
      type: 'ACHIEVEMENT',
      targetId: newAch.id,
      title: `${newAch.type === 'STUDENT' ? 'Student' : 'Faculty'} Achievement: ${newAch.achievementTitle}`,
      category: `${newAch.category} (${newAch.level})`,
      submittedBy: currentUser.name,
      submitterRole: currentUser.role,
      departmentId: currentUser.departmentId,
      departmentName: currentUser.departmentName || 'Computer Science and Engineering',
      submissionDate: new Date().toISOString().split('T')[0],
      summary: `${newAch.position} at ${newAch.competition}`,
      evidenceName: newAch.certificateDocument || 'Certificate.pdf',
      evidenceUrl: '#',
      status: 'PENDING',
      approvalLevel: 'HOD',
    };
    setItem(STORAGE_KEYS.APPROVALS, [newAppr, ...approvals]);

    return mockResponse(newAch);
  },

  async updateAchievement(id, updates) {
    const list = getItem(STORAGE_KEYS.ACHIEVEMENTS) || [];
    const updated = list.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
    return mockResponse(updated.find((a) => a.id === id));
  },

  async deleteAchievement(id) {
    const list = getItem(STORAGE_KEYS.ACHIEVEMENTS) || [];
    setItem(STORAGE_KEYS.ACHIEVEMENTS, list.filter((a) => a.id !== id));
    return mockResponse({ success: true });
  },
};

export const academicService = {
  async getAcademicRecords(filters = {}) {
    let list = getItem(STORAGE_KEYS.ACADEMIC_RECORDS) || [];
    if (filters.userId) list = list.filter((r) => r.userId === filters.userId);
    if (filters.departmentId) list = list.filter((r) => r.departmentId === filters.departmentId);
    if (filters.academicYear) list = list.filter((r) => r.academicYear === filters.academicYear);
    return mockResponse(list);
  },

  async createAcademicRecord(data, currentUser) {
    const list = getItem(STORAGE_KEYS.ACADEMIC_RECORDS) || [];
    const newRecord = {
      id: `acad_${Date.now()}`,
      userId: currentUser.id,
      facultyName: currentUser.name,
      departmentId: currentUser.departmentId || 'dept_cse',
      status: 'SUBMITTED',
      createdAt: new Date().toISOString().split('T')[0],
      ...data,
    };
    setItem(STORAGE_KEYS.ACADEMIC_RECORDS, [newRecord, ...list]);
    return mockResponse(newRecord);
  },

  async updateAcademicRecord(id, updates) {
    const list = getItem(STORAGE_KEYS.ACADEMIC_RECORDS) || [];
    const updated = list.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setItem(STORAGE_KEYS.ACADEMIC_RECORDS, updated);
    return mockResponse(updated.find((r) => r.id === id));
  },

  async deleteAcademicRecord(id) {
    const list = getItem(STORAGE_KEYS.ACADEMIC_RECORDS) || [];
    setItem(STORAGE_KEYS.ACADEMIC_RECORDS, list.filter((r) => r.id !== id));
    return mockResponse({ success: true });
  },
};
