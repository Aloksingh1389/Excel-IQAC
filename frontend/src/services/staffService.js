// Centralized Staff Portal Data & Workflow Service (Stage 6)

import { submissionService } from './submissionService';
import { evidenceService } from './evidenceService';
import { actionItemService } from './actionItemService';
import { qualityService } from './qualityService';
import { complianceService } from './complianceService';
import { storage } from '../utils/storage';

const PROFILES_STORAGE_KEY = 'excel_iqac_staff_profiles';

const SIMULATED_LATENCY_MS = 150;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const staffService = {
  getStaffProfile: async (user) => {
    await delay();
    const storedProfiles = storage.get(PROFILES_STORAGE_KEY) || {};
    const staffId = user?.email || 'user@college.edu';

    const defaultProfile = {
      staffId,
      name: user?.name || 'Dr. Ramesh Sharma',
      email: user?.email || 'ramesh.sharma@excel.edu',
      designation: user?.designation || 'Assistant Professor',
      departmentCode: user?.departmentCode || 'CSE',
      phone: '+91 98765 43210',
      dateOfJoining: '2019-06-15',
      employeeType: 'Full-Time Permanent',
      qualification: 'Ph.D. in Computer Science',
      specialization: 'Artificial Intelligence & Machine Learning',
      university: 'Anna University, Chennai',
      experienceYears: 8,
      orcidId: '0000-0002-1825-0097',
      scopusId: '57204918200',
      googleScholarUrl: 'https://scholar.google.com/citations?user=sample',
    };

    const profile = storedProfiles[staffId] || defaultProfile;

    // Calculate completion %
    let filledFields = 0;
    const totalFields = 12;
    if (profile.name) filledFields++;
    if (profile.email) filledFields++;
    if (profile.designation) filledFields++;
    if (profile.departmentCode) filledFields++;
    if (profile.phone) filledFields++;
    if (profile.qualification) filledFields++;
    if (profile.specialization) filledFields++;
    if (profile.university) filledFields++;
    if (profile.experienceYears) filledFields++;
    if (profile.orcidId) filledFields++;
    if (profile.scopusId) filledFields++;
    if (profile.googleScholarUrl) filledFields++;

    const completionPercentage = Math.round((filledFields / totalFields) * 100);

    return {
      success: true,
      data: {
        ...profile,
        completionPercentage,
      },
    };
  },

  updateStaffProfile: async (profileData, user) => {
    await delay();
    const storedProfiles = storage.get(PROFILES_STORAGE_KEY) || {};
    const staffId = user?.email || 'user@college.edu';

    const updatedProfile = {
      ...storedProfiles[staffId],
      ...profileData,
    };

    storedProfiles[staffId] = updatedProfile;
    storage.set(PROFILES_STORAGE_KEY, storedProfiles);

    return {
      success: true,
      message: 'Staff profile updated successfully.',
      data: updatedProfile,
    };
  },

  getStaffDashboard: async (user) => {
    await delay();
    const [profileRes, subRes, evRes, actionRes] = await Promise.all([
      staffService.getStaffProfile(user),
      submissionService.getSubmissions({}, user),
      evidenceService.getEvidenceList({}, user),
      actionItemService.getActionItems({}, user),
    ]);

    const submissions = subRes.data || [];
    const evidenceList = evRes.data || [];
    const actionItems = actionRes.data || [];

    const mySubmissions = submissions.filter(
      (s) => s.submittedBy === user?.name || s.departmentCode === user?.departmentCode
    );

    const myReturned = mySubmissions.filter((s) => s.status === 'RETURNED');
    const myDrafts = mySubmissions.filter((s) => s.status === 'DRAFT');
    const myUnderReview = mySubmissions.filter((s) => s.status === 'SUBMITTED' || s.status === 'UNDER_REVIEW');
    const myVerified = mySubmissions.filter((s) => s.status === 'VERIFIED' || s.status === 'APPROVED');

    const attentionItems = [];

    if (myReturned.length > 0) {
      attentionItems.push({
        id: 'att_ret_1',
        title: `${myReturned.length} submission(s) returned for correction`,
        type: 'RETURNED_SUBMISSION',
        route: `/staff/submissions/${myReturned[0].id}`,
      });
    }

    if (profileRes.data.completionPercentage < 90) {
      attentionItems.push({
        id: 'att_prof_1',
        title: `Faculty Profile completion at ${profileRes.data.completionPercentage}%`,
        type: 'PROFILE_INCOMPLETE',
        route: '/staff/profile',
      });
    }

    return {
      success: true,
      data: {
        profileCompletion: profileRes.data.completionPercentage,
        draftsCount: myDrafts.length,
        underReviewCount: myUnderReview.length,
        returnedCount: myReturned.length,
        verifiedCount: myVerified.length,
        pendingEvidenceCount: evidenceList.filter((e) => e.status === 'UNDER_REVIEW').length,
        assignedTasksCount: actionItems.length,
        overdueTasksCount: actionItems.filter((a) => a.status === 'OVERDUE').length,
        attentionItems,
      },
    };
  },

  getStaffQualityContribution: async (user) => {
    await delay();
    return {
      success: true,
      data: {
        verifiedPublicationsCount: 6,
        fundedResearchProjectsCount: 2,
        fdpCompletionsCount: 5,
        verifiedEvidenceFilesCount: 14,
        completedQualityTasksCount: 8,
      },
    };
  },
};
