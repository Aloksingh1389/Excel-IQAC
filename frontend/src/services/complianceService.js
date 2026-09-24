// Centralized Compliance Management Service for Stage 5F

import { MOCK_COMPLIANCE_RECORDS } from '../data/mockCompliance';
import { COMPLIANCE_REQUIREMENTS, COMPLIANCE_STATUS } from '../config/complianceConfig';
import { ROLES } from '../config/roles';
import { storage } from '../utils/storage';

const STORAGE_KEY = 'excel_iqac_compliance_records';

const getStoredComplianceRecords = () => {
  const data = storage.get(STORAGE_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) {
    storage.set(STORAGE_KEY, MOCK_COMPLIANCE_RECORDS);
    return MOCK_COMPLIANCE_RECORDS;
  }
  return data;
};

const SIMULATED_LATENCY_MS = 150;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const complianceService = {
  getAccessibleCompliance: (user, list = null) => {
    if (!user) return [];
    const records = list || getStoredComplianceRecords();
    const role = user.role;

    if (
      role === ROLES.TECHNICAL_DIRECTOR ||
      role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
      role === ROLES.INSTITUTION_ADMIN ||
      role === ROLES.IQAC_HEAD
    ) {
      return records;
    }

    if (role === ROLES.DEAN) {
      const assignedCodes = user.assignedDepartments || ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
      return records.filter((cr) => assignedCodes.includes(cr.departmentCode));
    }

    if (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) {
      const userDeptCode = user.departmentCode || 'CSE';
      return records.filter((cr) => cr.departmentCode === userDeptCode);
    }

    if (role === ROLES.STAFF) {
      return records.filter((cr) => cr.departmentCode === user.departmentCode);
    }

    return records;
  },

  getComplianceRecords: async (filters = {}, user) => {
    await delay();
    const accessible = complianceService.getAccessibleCompliance(user);
    const { searchQuery, statusFilter, categoryFilter, deptFilter, academicYear } = filters;

    let result = accessible;

    if (academicYear && academicYear !== 'ALL') {
      result = result.filter((cr) => cr.academicYear === academicYear);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((cr) => cr.status === statusFilter);
    }

    if (categoryFilter && categoryFilter !== 'ALL') {
      result = result.filter((cr) => cr.category === categoryFilter);
    }

    if (deptFilter && deptFilter !== 'ALL') {
      result = result.filter((cr) => cr.departmentCode === deptFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (cr) =>
          cr.requirementCode.toLowerCase().includes(q) ||
          cr.requirementName.toLowerCase().includes(q) ||
          cr.departmentCode.toLowerCase().includes(q)
      );
    }

    const total = accessible.length;
    const compliant = accessible.filter((cr) => cr.status === COMPLIANCE_STATUS.COMPLIANT).length;
    const partial = accessible.filter((cr) => cr.status === COMPLIANCE_STATUS.PARTIALLY_COMPLIANT).length;
    const nonCompliant = accessible.filter((cr) => cr.status === COMPLIANCE_STATUS.NON_COMPLIANT).length;
    const overdue = accessible.filter((cr) => cr.status === COMPLIANCE_STATUS.OVERDUE).length;

    const stats = {
      total,
      compliant,
      partial,
      nonCompliant,
      overdue,
      complianceRate: Math.round((compliant / (total || 1)) * 100),
    };

    return { success: true, data: result, stats };
  },

  getComplianceById: async (id, user) => {
    await delay();
    const accessible = complianceService.getAccessibleCompliance(user);
    const item = accessible.find((cr) => cr.id === id || cr.requirementId === id);
    if (!item) throw new Error('Compliance record not found.');
    return { success: true, data: item };
  },

  getComplianceHeatmap: async (user) => {
    await delay();
    const accessible = complianceService.getAccessibleCompliance(user);

    const depts = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
    const categories = ['DOCUMENTATION', 'FACULTY', 'RESEARCH', 'TRAINING', 'OPERATIONS'];

    const heatmap = depts.map((dCode) => {
      const catStatuses = {};
      categories.forEach((cat) => {
        const found = accessible.find((cr) => cr.departmentCode === dCode && cr.category === cat);
        catStatuses[cat] = found ? found.status : COMPLIANCE_STATUS.COMPLIANT;
      });
      return {
        departmentCode: dCode,
        categories: catStatuses,
      };
    });

    return { success: true, data: heatmap };
  },
};
