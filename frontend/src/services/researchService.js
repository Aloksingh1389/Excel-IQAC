import { getItem, setItem, STORAGE_KEYS } from './localStorageHelper';
import { mockResponse, mockError } from './api';

export const researchService = {
  async getResearch(filters = {}) {
    let list = getItem(STORAGE_KEYS.RESEARCH) || [];
    if (filters.userId) list = list.filter((r) => r.userId === filters.userId);
    if (filters.departmentId) list = list.filter((r) => r.departmentId === filters.departmentId);
    if (filters.status) list = list.filter((r) => r.status === filters.status);
    return mockResponse(list);
  },

  async createResearch(data, currentUser) {
    const list = getItem(STORAGE_KEYS.RESEARCH) || [];
    const newRes = {
      id: `res_${Date.now()}`,
      userId: currentUser.id,
      principalInvestigator: data.principalInvestigator || currentUser.name,
      departmentId: currentUser.departmentId || 'dept_cse',
      academicYear: data.academicYear || '2026 - 2027',
      status: data.status || 'ACTIVE',
      approvalStatus: 'SUBMITTED',
      submittedAt: new Date().toISOString().split('T')[0],
      ...data,
    };
    setItem(STORAGE_KEYS.RESEARCH, [newRes, ...list]);

    // Create approval item
    const approvals = getItem(STORAGE_KEYS.APPROVALS) || [];
    const newAppr = {
      id: `appr_${Date.now()}`,
      type: 'RESEARCH',
      targetId: newRes.id,
      title: newRes.projectTitle,
      category: `${newRes.projectType} (₹${(newRes.amount || 0).toLocaleString()})`,
      submittedBy: currentUser.name,
      submitterRole: currentUser.role,
      departmentId: currentUser.departmentId,
      departmentName: currentUser.departmentName || 'Computer Science and Engineering',
      submissionDate: new Date().toISOString().split('T')[0],
      summary: `Research grant proposal to ${newRes.fundingAgency}`,
      evidenceName: newRes.evidenceDocument || 'Sanction_Order.pdf',
      evidenceUrl: '#',
      status: 'PENDING',
      approvalLevel: 'HOD',
    };
    setItem(STORAGE_KEYS.APPROVALS, [newAppr, ...approvals]);

    return mockResponse(newRes);
  },

  async updateResearch(id, updates) {
    const list = getItem(STORAGE_KEYS.RESEARCH) || [];
    const updated = list.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setItem(STORAGE_KEYS.RESEARCH, updated);
    return mockResponse(updated.find((r) => r.id === id));
  },

  async deleteResearch(id) {
    const list = getItem(STORAGE_KEYS.RESEARCH) || [];
    setItem(STORAGE_KEYS.RESEARCH, list.filter((r) => r.id !== id));
    return mockResponse({ success: true });
  },
};

export const fdpService = {
  async getFdps(filters = {}) {
    let list = getItem(STORAGE_KEYS.FDPS) || [];
    if (filters.userId) list = list.filter((f) => f.userId === filters.userId);
    if (filters.departmentId) list = list.filter((f) => f.departmentId === filters.departmentId);
    return mockResponse(list);
  },

  async createFdp(data, currentUser) {
    const list = getItem(STORAGE_KEYS.FDPS) || [];
    const newFdp = {
      id: `fdp_${Date.now()}`,
      userId: currentUser.id,
      facultyName: currentUser.name,
      departmentId: currentUser.departmentId || 'dept_cse',
      academicYear: data.academicYear || '2026 - 2027',
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString().split('T')[0],
      ...data,
    };
    setItem(STORAGE_KEYS.FDPS, [newFdp, ...list]);

    const approvals = getItem(STORAGE_KEYS.APPROVALS) || [];
    const newAppr = {
      id: `appr_${Date.now()}`,
      type: 'FDP',
      targetId: newFdp.id,
      title: newFdp.title,
      category: `${newFdp.type} - ${newFdp.organizer}`,
      submittedBy: currentUser.name,
      submitterRole: currentUser.role,
      departmentId: currentUser.departmentId,
      departmentName: currentUser.departmentName || 'Computer Science and Engineering',
      submissionDate: new Date().toISOString().split('T')[0],
      summary: `${newFdp.duration} ${newFdp.mode} program (${newFdp.participationType})`,
      evidenceName: newFdp.certificateDocument || 'Certificate.pdf',
      evidenceUrl: '#',
      status: 'PENDING',
      approvalLevel: 'HOD',
    };
    setItem(STORAGE_KEYS.APPROVALS, [newAppr, ...approvals]);

    return mockResponse(newFdp);
  },

  async updateFdp(id, updates) {
    const list = getItem(STORAGE_KEYS.FDPS) || [];
    const updated = list.map((f) => (f.id === id ? { ...f, ...updates } : f));
    setItem(STORAGE_KEYS.FDPS, updated);
    return mockResponse(updated.find((f) => f.id === id));
  },

  async deleteFdp(id) {
    const list = getItem(STORAGE_KEYS.FDPS) || [];
    setItem(STORAGE_KEYS.FDPS, list.filter((f) => f.id !== id));
    return mockResponse({ success: true });
  },
};
