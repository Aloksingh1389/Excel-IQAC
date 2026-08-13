import { getItem, setItem, STORAGE_KEYS } from './localStorageHelper';
import { mockResponse, mockError } from './api';

export const qualityService = {
  async getQualityInitiatives() {
    const list = getItem(STORAGE_KEYS.QUALITY_INITIATIVES) || [];
    return mockResponse(list);
  },

  async createQualityInitiative(data) {
    const list = getItem(STORAGE_KEYS.QUALITY_INITIATIVES) || [];
    const newInit = {
      id: `qi_${Date.now()}`,
      status: 'ACTIVE',
      currentProgress: 0,
      ...data,
    };
    setItem(STORAGE_KEYS.QUALITY_INITIATIVES, [newInit, ...list]);
    return mockResponse(newInit);
  },

  async updateQualityInitiative(id, updates) {
    const list = getItem(STORAGE_KEYS.QUALITY_INITIATIVES) || [];
    const updated = list.map((q) => (q.id === id ? { ...q, ...updates } : q));
    setItem(STORAGE_KEYS.QUALITY_INITIATIVES, updated);
    return mockResponse(updated.find((q) => q.id === id));
  },
};

export const auditService = {
  async getAudits() {
    const list = getItem(STORAGE_KEYS.AUDITS) || [];
    return mockResponse(list);
  },

  async createAudit(data) {
    const list = getItem(STORAGE_KEYS.AUDITS) || [];
    const newAudit = {
      id: `audit_${Date.now()}`,
      status: data.status || 'SCHEDULED',
      observations: data.observations || [],
      ...data,
    };
    setItem(STORAGE_KEYS.AUDITS, [newAudit, ...list]);
    return mockResponse(newAudit);
  },

  async updateAudit(id, updates) {
    const list = getItem(STORAGE_KEYS.AUDITS) || [];
    const updated = list.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setItem(STORAGE_KEYS.AUDITS, updated);
    return mockResponse(updated.find((a) => a.id === id));
  },
};

export const accreditationService = {
  async getCriteria() {
    const list = getItem(STORAGE_KEYS.ACCREDITATION) || [];
    return mockResponse(list);
  },

  async updateCriterionMetric(criterionId, metricId, updates) {
    const list = getItem(STORAGE_KEYS.ACCREDITATION) || [];
    const updatedList = list.map((crit) => {
      if (crit.id === criterionId) {
        const updatedMetrics = crit.metrics.map((m) =>
          m.id === metricId ? { ...m, ...updates } : m
        );
        return { ...crit, metrics: updatedMetrics };
      }
      return crit;
    });
    setItem(STORAGE_KEYS.ACCREDITATION, updatedList);
    return mockResponse(updatedList.find((c) => c.id === criterionId));
  },
};
