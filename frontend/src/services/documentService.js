import { getItem, setItem, STORAGE_KEYS } from './localStorageHelper';
import { mockResponse, mockError } from './api';

export const documentService = {
  async getDocuments(filters = {}) {
    let list = getItem(STORAGE_KEYS.DOCUMENTS) || [];
    if (filters.module) list = list.filter((d) => d.module === filters.module);
    if (filters.departmentId) list = list.filter((d) => d.departmentId === filters.departmentId);
    if (filters.academicYear) list = list.filter((d) => d.academicYear === filters.academicYear);
    if (filters.status) list = list.filter((d) => d.status === filters.status);
    return mockResponse(list);
  },

  async uploadDocument(data, currentUser) {
    const list = getItem(STORAGE_KEYS.DOCUMENTS) || [];
    const newDoc = {
      id: `doc_${Date.now()}`,
      departmentId: currentUser.departmentId || 'dept_cse',
      academicYear: data.academicYear || '2026 - 2027',
      uploadedBy: currentUser.name,
      uploadDate: new Date().toISOString().split('T')[0],
      downloadCount: 0,
      status: 'ACTIVE',
      url: '#',
      ...data,
    };
    setItem(STORAGE_KEYS.DOCUMENTS, [newDoc, ...list]);
    return mockResponse(newDoc);
  },

  async deleteDocument(id) {
    const list = getItem(STORAGE_KEYS.DOCUMENTS) || [];
    setItem(STORAGE_KEYS.DOCUMENTS, list.filter((d) => d.id !== id));
    return mockResponse({ success: true, id });
  },

  async updateDocumentStatus(id, status) {
    const list = getItem(STORAGE_KEYS.DOCUMENTS) || [];
    const updated = list.map((d) => (d.id === id ? { ...d, status } : d));
    setItem(STORAGE_KEYS.DOCUMENTS, updated);
    return mockResponse(updated.find((d) => d.id === id));
  },
};
