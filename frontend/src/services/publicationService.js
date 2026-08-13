import { getItem, setItem, STORAGE_KEYS } from './localStorageHelper';
import { mockResponse, mockError } from './api';

export const publicationService = {
  async getPublications(filters = {}) {
    let list = getItem(STORAGE_KEYS.PUBLICATIONS) || [];

    if (filters.userId) {
      list = list.filter((p) => p.userId === filters.userId);
    }
    if (filters.departmentId) {
      list = list.filter((p) => p.departmentId === filters.departmentId);
    }
    if (filters.status) {
      list = list.filter((p) => p.status === filters.status);
    }
    if (filters.academicYear) {
      list = list.filter((p) => p.academicYear === filters.academicYear);
    }

    return mockResponse(list);
  },

  async getPublicationById(id) {
    const list = getItem(STORAGE_KEYS.PUBLICATIONS) || [];
    const item = list.find((p) => p.id === id);
    if (!item) return mockError('Publication not found', 404);
    return mockResponse(item);
  },

  async createPublication(pubData, currentUser) {
    const list = getItem(STORAGE_KEYS.PUBLICATIONS) || [];
    const newPub = {
      id: `pub_${Date.now()}`,
      userId: currentUser.id,
      authorName: currentUser.name,
      departmentId: currentUser.departmentId || 'dept_cse',
      academicYear: pubData.academicYear || '2026 - 2027',
      status: pubData.status || 'DRAFT',
      submittedAt: pubData.status === 'SUBMITTED' ? new Date().toISOString().split('T')[0] : null,
      ...pubData,
    };

    const updated = [newPub, ...list];
    setItem(STORAGE_KEYS.PUBLICATIONS, updated);

    // If submitted, create an approval request for HOD
    if (newPub.status === 'SUBMITTED') {
      const approvals = getItem(STORAGE_KEYS.APPROVALS) || [];
      const newAppr = {
        id: `appr_${Date.now()}`,
        type: 'PUBLICATION',
        targetId: newPub.id,
        title: newPub.title,
        category: `${newPub.publicationType} (${newPub.indexing})`,
        submittedBy: currentUser.name,
        submitterRole: currentUser.role,
        departmentId: currentUser.departmentId,
        departmentName: currentUser.departmentName || 'Computer Science and Engineering',
        submissionDate: new Date().toISOString().split('T')[0],
        summary: `Paper: ${newPub.title} in ${newPub.journal}`,
        evidenceName: newPub.evidenceDocument || 'Proof_Document.pdf',
        evidenceUrl: '#',
        status: 'PENDING',
        approvalLevel: 'HOD',
      };
      setItem(STORAGE_KEYS.APPROVALS, [newAppr, ...approvals]);
    }

    return mockResponse(newPub);
  },

  async updatePublication(id, updates) {
    const list = getItem(STORAGE_KEYS.PUBLICATIONS) || [];
    let updatedItem = null;
    const updatedList = list.map((p) => {
      if (p.id === id) {
        updatedItem = { ...p, ...updates };
        return updatedItem;
      }
      return p;
    });

    if (!updatedItem) return mockError('Publication not found', 404);
    setItem(STORAGE_KEYS.PUBLICATIONS, updatedList);
    return mockResponse(updatedItem);
  },

  async deletePublication(id) {
    const list = getItem(STORAGE_KEYS.PUBLICATIONS) || [];
    const filtered = list.filter((p) => p.id !== id);
    setItem(STORAGE_KEYS.PUBLICATIONS, filtered);
    return mockResponse({ success: true, id });
  },

  async submitForApproval(id) {
    const list = getItem(STORAGE_KEYS.PUBLICATIONS) || [];
    const item = list.find((p) => p.id === id);
    if (!item) return mockError('Publication not found', 404);

    return this.updatePublication(id, {
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString().split('T')[0],
    });
  },
};
