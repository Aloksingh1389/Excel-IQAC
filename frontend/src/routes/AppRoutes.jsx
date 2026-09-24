import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute } from './ProtectedRoute';
import { InstitutionAdminLayout } from '../layouts/InstitutionAdminLayout';
import { DepartmentLayout } from '../layouts/DepartmentLayout';
import { DeanLayout } from '../layouts/DeanLayout';
import { ManagementLayout } from '../layouts/ManagementLayout';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/roles';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Institution Pages (Stage 1 & 2)
import { Dashboard } from '../pages/institution/Dashboard';
import { InstitutionOverview } from '../pages/institution/InstitutionOverview';
import { Departments } from '../pages/institution/Departments';
import { DepartmentDetails } from '../pages/institution/DepartmentDetails';
import { Profile } from '../pages/institution/Profile';
import { Notifications } from '../pages/institution/Notifications';
import { Settings } from '../pages/institution/Settings';

// Stage 3 Analytics Pages
import { AnalyticsOverview } from '../pages/analytics/AnalyticsOverview';
import { AcademicAnalytics } from '../pages/analytics/AcademicAnalytics';
import { StudentAnalytics } from '../pages/analytics/StudentAnalytics';
import { FacultyAnalytics } from '../pages/analytics/FacultyAnalytics';
import { ResearchAnalytics } from '../pages/analytics/ResearchAnalytics';
import { PublicationAnalytics } from '../pages/analytics/PublicationAnalytics';
import { PlacementAnalytics } from '../pages/analytics/PlacementAnalytics';
import { DepartmentComparison } from '../pages/analytics/DepartmentComparison';

// Stage 4 Report Management Pages
import { ReportCenter } from '../pages/reports/ReportCenter';
import { GenerateReport } from '../pages/reports/GenerateReport';
import { ReportHistory } from '../pages/reports/ReportHistory';
import { ReportDetails } from '../pages/reports/ReportDetails';

// Stage 5A, 5B, 5C, 5D, 5E & 5F IQAC Pages
import { IQACDashboard } from '../pages/iqac/IQACDashboard';
import { IQACDepartments } from '../pages/iqac/IQACDepartments';
import { IQACCoordinators } from '../pages/iqac/IQACCoordinators';
import { IQACCoordinatorDetails } from '../pages/iqac/IQACCoordinatorDetails';
import { IQACMonitoring } from '../pages/iqac/IQACMonitoring';
import { IQACReports } from '../pages/iqac/IQACReports';
import { SubmissionCenter } from '../pages/iqac/SubmissionCenter';
import { ReviewCenter } from '../pages/iqac/ReviewCenter';
import { SubmissionDetails } from '../pages/iqac/SubmissionDetails';
import { EvidenceRepository } from '../pages/iqac/EvidenceRepository';
import { EvidenceReviewCenter } from '../pages/iqac/EvidenceReviewCenter';
import { EvidenceDetails } from '../pages/iqac/EvidenceDetails';
import { IQACMeetings } from '../pages/iqac/IQACMeetings';
import { MeetingDetails } from '../pages/iqac/MeetingDetails';
import { ActionItems } from '../pages/iqac/ActionItems';
import { ActionItemDetails } from '../pages/iqac/ActionItemDetails';
import { IQACActivities } from '../pages/iqac/IQACActivities';
import { ActivityDetails } from '../pages/iqac/ActivityDetails';

// Stage 5F Pages
import { QualityMonitoring } from '../pages/iqac/QualityMonitoring';
import { QualityIndicators } from '../pages/iqac/QualityIndicators';
import { DepartmentQualityScorecards } from '../pages/iqac/DepartmentQualityScorecards';
import { DepartmentQualityDetails } from '../pages/iqac/DepartmentQualityDetails';
import { DepartmentQualityComparison } from '../pages/iqac/DepartmentQualityComparison';
import { QualityTrends } from '../pages/iqac/QualityTrends';
import { ComplianceCenter } from '../pages/iqac/ComplianceCenter';
import { ComplianceDetails } from '../pages/iqac/ComplianceDetails';
import { ImprovementPlans } from '../pages/iqac/ImprovementPlans';
import { ImprovementPlanDetails } from '../pages/iqac/ImprovementPlanDetails';

// Stage 5G NAAC Accreditation Pages
import { AccreditationDashboard } from '../pages/accreditation/AccreditationDashboard';
import { CriterionDetails } from '../pages/accreditation/CriterionDetails';
import { MetricDetails } from '../pages/accreditation/MetricDetails';
import { AccreditationGaps } from '../pages/accreditation/AccreditationGaps';
import { EvidenceGaps } from '../pages/accreditation/EvidenceGaps';
import { DataGaps } from '../pages/accreditation/DataGaps';
import { DepartmentAccreditationScorecards } from '../pages/accreditation/DepartmentAccreditationScorecards';
import { FrameworkManagement } from '../pages/accreditation/FrameworkManagement';

// Stage 5H Auto-AQAR Generation Pages
import { AQARReportCenter } from '../pages/aqar/AQARReportCenter';
import { CreateAQAR } from '../pages/aqar/CreateAQAR';
import { AQARBuilder } from '../pages/aqar/AQARBuilder';
import { AQARPreview } from '../pages/aqar/AQARPreview';
import { AQARHistory } from '../pages/aqar/AQARHistory';
import { AQARVersionCompare } from '../pages/aqar/AQARVersionCompare';

// Common / Error Pages
import { NotFound } from '../pages/common/NotFound';
import { Unauthorized } from '../pages/common/Unauthorized';

// Stage 7 HOD & IQAC Coordinator Department Portal Pages
import { DepartmentDashboard } from '../pages/department/DepartmentDashboard';
import { DepartmentStaff } from '../pages/department/DepartmentStaff';
import { StaffDetails } from '../pages/department/StaffDetails';
import { DepartmentReviewCenter } from '../pages/department/DepartmentReviewCenter';
import { DepartmentSubmissionReview } from '../pages/department/DepartmentSubmissionReview';
import { DepartmentEvidence } from '../pages/department/DepartmentEvidence';
import { DepartmentEvidenceDetails } from '../pages/department/DepartmentEvidenceDetails';
import { DepartmentActivities } from '../pages/department/DepartmentActivities';
import { DepartmentMeetings } from '../pages/department/DepartmentMeetings';
import { DepartmentActionItems } from '../pages/department/DepartmentActionItems';
import { DepartmentQuality } from '../pages/department/DepartmentQuality';
import { DepartmentCompliance } from '../pages/department/DepartmentCompliance';
import { DepartmentAccreditation } from '../pages/department/DepartmentAccreditation';
import { DepartmentImprovementPlans } from '../pages/department/DepartmentImprovementPlans';
import { DepartmentNotifications } from '../pages/department/DepartmentNotifications';

// Stage 8 Dean Portal Pages
import { DeanDashboard } from '../pages/dean/DeanDashboard';
import { DeanDepartments } from '../pages/dean/DeanDepartments';
import { DeanDepartmentDetails } from '../pages/dean/DeanDepartmentDetails';
import { DeanDepartmentComparison } from '../pages/dean/DeanDepartmentComparison';
import { DeanReviewCenter } from '../pages/dean/DeanReviewCenter';
import { DeanSubmissionDetails } from '../pages/dean/DeanSubmissionDetails';
import { DeanEvidence } from '../pages/dean/DeanEvidence';
import { DeanEvidenceDetails } from '../pages/dean/DeanEvidenceDetails';
import { DeanActivities } from '../pages/dean/DeanActivities';
import { DeanActivityDetails } from '../pages/dean/DeanActivityDetails';
import { DeanMeetings } from '../pages/dean/DeanMeetings';
import { DeanMeetingDetails } from '../pages/dean/DeanMeetingDetails';
import { DeanActionItems } from '../pages/dean/DeanActionItems';
import { DeanActionItemDetails } from '../pages/dean/DeanActionItemDetails';
import { DeanQualityMonitoring } from '../pages/dean/DeanQualityMonitoring';
import { DeanCompliance } from '../pages/dean/DeanCompliance';
import { DeanAccreditation } from '../pages/dean/DeanAccreditation';
import { DeanImprovementPlans } from '../pages/dean/DeanImprovementPlans';
import { DeanImprovementPlanDetails } from '../pages/dean/DeanImprovementPlanDetails';
import { DeanReports } from '../pages/dean/DeanReports';
import { DeanNotifications } from '../pages/dean/DeanNotifications';

// Stage 9 Management Portal Pages
import { ManagementDashboard } from '../pages/management/ManagementDashboard';
import { ManagementOverview } from '../pages/management/ManagementOverview';
import { ManagementDepartments } from '../pages/management/ManagementDepartments';
import { ManagementDepartmentDetails } from '../pages/management/ManagementDepartmentDetails';
import { ManagementComparison } from '../pages/management/ManagementComparison';
import { ManagementTrends } from '../pages/management/ManagementTrends';
import { ManagementAnalytics } from '../pages/management/ManagementAnalytics';
import { ManagementQuality } from '../pages/management/ManagementQuality';
import { ManagementCompliance } from '../pages/management/ManagementCompliance';
import { ManagementAccreditation } from '../pages/management/ManagementAccreditation';
import { ManagementSubmissions } from '../pages/management/ManagementSubmissions';
import { ManagementEvidence } from '../pages/management/ManagementEvidence';
import { ManagementActivities } from '../pages/management/ManagementActivities';
import { ManagementMeetings } from '../pages/management/ManagementMeetings';
import { ManagementActionItems } from '../pages/management/ManagementActionItems';
import { ManagementImprovementPlans } from '../pages/management/ManagementImprovementPlans';
import { ManagementReports } from '../pages/management/ManagementReports';
import { ManagementAQAR } from '../pages/management/ManagementAQAR';
import { ManagementAudit } from '../pages/management/ManagementAudit';
import { ManagementNotifications } from '../pages/management/ManagementNotifications';
import { ManagementSettings } from '../pages/management/ManagementSettings';

const DEPARTMENT_ROLES = [ROLES.HOD, ROLES.IQAC_COORDINATOR];
const DEAN_ROLES = [ROLES.DEAN];
const MANAGEMENT_ROLES = [ROLES.TECHNICAL_DIRECTOR, ROLES.INSTITUTION_ADMIN, ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL];

// Role-aware landing: department, dean and management roles start in their portals.
const LandingRedirect = () => {
  const { role } = useAuth();
  if (DEPARTMENT_ROLES.includes(role)) {
    return <Navigate to="/department" replace />;
  }
  if (DEAN_ROLES.includes(role)) {
    return <Navigate to="/dean" replace />;
  }
  if (MANAGEMENT_ROLES.includes(role)) {
    return <Navigate to="/management" replace />;
  }
  return <Navigate to="/iqac/dashboard" replace />;
};

const ALL_ROLES = [
  ROLES.TECHNICAL_DIRECTOR,
  ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL,
  ROLES.INSTITUTION_ADMIN,
  ROLES.IQAC_HEAD,
  ROLES.IQAC_MEMBER,
  ROLES.IQAC_COORDINATOR,
  ROLES.DEAN,
  ROLES.HOD,
  ROLES.STAFF,
];

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Institutional Application Shell Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Stage 7 Department Portal (HOD & IQAC Coordinator, scoped to own department) */}
        <Route element={<RoleRoute allowedRoles={DEPARTMENT_ROLES} />}>
          <Route element={<DepartmentLayout />}>
            <Route path="/department" element={<DepartmentDashboard />} />
            <Route path="/department/staff" element={<DepartmentStaff />} />
            <Route path="/department/staff/:staffId" element={<StaffDetails />} />
            <Route path="/department/review" element={<DepartmentReviewCenter />} />
            <Route path="/department/review/:submissionId" element={<DepartmentSubmissionReview />} />
            <Route path="/department/evidence" element={<DepartmentEvidence />} />
            <Route path="/department/evidence/:evidenceId" element={<DepartmentEvidenceDetails />} />
            <Route path="/department/activities" element={<DepartmentActivities />} />
            <Route path="/department/meetings" element={<DepartmentMeetings />} />
            <Route path="/department/action-items" element={<DepartmentActionItems />} />
            <Route path="/department/quality" element={<DepartmentQuality />} />
            <Route path="/department/compliance" element={<DepartmentCompliance />} />
            <Route path="/department/accreditation" element={<DepartmentAccreditation />} />
            <Route path="/department/improvement-plans" element={<DepartmentImprovementPlans />} />
            <Route path="/department/notifications" element={<DepartmentNotifications />} />
          </Route>
          <Route path="/hod" element={<Navigate to="/department" replace />} />
          <Route path="/coordinator" element={<Navigate to="/department" replace />} />
        </Route>
        {/* Stage 8 Dean Portal (multi-department monitoring, assigned scope only) */}
        <Route element={<RoleRoute allowedRoles={DEAN_ROLES} />}>
          <Route element={<DeanLayout />}>
            <Route path="/dean" element={<DeanDashboard />} />
            <Route path="/dean/departments" element={<DeanDepartments />} />
            <Route path="/dean/departments/:departmentId" element={<DeanDepartmentDetails />} />
            <Route path="/dean/comparison" element={<DeanDepartmentComparison />} />
            <Route path="/dean/review" element={<DeanReviewCenter />} />
            <Route path="/dean/review/:submissionId" element={<DeanSubmissionDetails />} />
            <Route path="/dean/evidence" element={<DeanEvidence />} />
            <Route path="/dean/evidence/:evidenceId" element={<DeanEvidenceDetails />} />
            <Route path="/dean/activities" element={<DeanActivities />} />
            <Route path="/dean/activities/:activityId" element={<DeanActivityDetails />} />
            <Route path="/dean/meetings" element={<DeanMeetings />} />
            <Route path="/dean/meetings/:meetingId" element={<DeanMeetingDetails />} />
            <Route path="/dean/action-items" element={<DeanActionItems />} />
            <Route path="/dean/action-items/:actionItemId" element={<DeanActionItemDetails />} />
            <Route path="/dean/quality" element={<DeanQualityMonitoring />} />
            <Route path="/dean/quality/:departmentId" element={<DeanQualityMonitoring />} />
            <Route path="/dean/compliance" element={<DeanCompliance />} />
            <Route path="/dean/compliance/:departmentId" element={<DeanCompliance />} />
            <Route path="/dean/accreditation" element={<DeanAccreditation />} />
            <Route path="/dean/accreditation/:departmentId" element={<DeanAccreditation />} />
            <Route path="/dean/improvement-plans" element={<DeanImprovementPlans />} />
            <Route path="/dean/improvement-plans/:planId" element={<DeanImprovementPlanDetails />} />
            <Route path="/dean/reports" element={<DeanReports />} />
            <Route path="/dean/notifications" element={<DeanNotifications />} />
          </Route>
        </Route>
        {/* Stage 9 Management Portal (institution-wide executive layer) */}
        <Route element={<RoleRoute allowedRoles={MANAGEMENT_ROLES} />}>
          <Route element={<ManagementLayout />}>
            <Route path="/management" element={<ManagementDashboard />} />
            <Route path="/management/overview" element={<ManagementOverview />} />
            <Route path="/management/departments" element={<ManagementDepartments />} />
            <Route path="/management/departments/:departmentId" element={<ManagementDepartmentDetails />} />
            <Route path="/management/analytics" element={<ManagementAnalytics />} />
            <Route path="/management/analytics/:pillar" element={<ManagementAnalytics />} />
            <Route path="/management/comparison" element={<ManagementComparison />} />
            <Route path="/management/trends" element={<ManagementTrends />} />
            <Route path="/management/quality" element={<ManagementQuality />} />
            <Route path="/management/compliance" element={<ManagementCompliance />} />
            <Route path="/management/accreditation" element={<ManagementAccreditation />} />
            <Route path="/management/submissions" element={<ManagementSubmissions />} />
            <Route path="/management/evidence" element={<ManagementEvidence />} />
            <Route path="/management/activities" element={<ManagementActivities />} />
            <Route path="/management/meetings" element={<ManagementMeetings />} />
            <Route path="/management/action-items" element={<ManagementActionItems />} />
            <Route path="/management/improvement-plans" element={<ManagementImprovementPlans />} />
            <Route path="/management/reports" element={<ManagementReports />} />
            <Route path="/management/aqar" element={<ManagementAQAR />} />
            <Route path="/management/notifications" element={<ManagementNotifications />} />
            <Route path="/management/audit" element={<ManagementAudit />} />
            <Route path="/management/settings" element={<ManagementSettings />} />
          </Route>
        </Route>
        <Route element={<RoleRoute allowedRoles={ALL_ROLES} />}>
          <Route element={<InstitutionAdminLayout />}>
            <Route path="/" element={<LandingRedirect />} />
            <Route path="/director" element={<Navigate to="/director/dashboard" replace />} />
            <Route path="/director/dashboard" element={<Dashboard />} />

            {/* Stage 5 Operations & Quality Monitoring */}
            <Route path="/iqac" element={<Navigate to="/iqac/dashboard" replace />} />
            <Route path="/iqac/dashboard" element={<IQACDashboard />} />
            <Route path="/iqac/submissions" element={<SubmissionCenter />} />
            <Route path="/iqac/submissions/:submissionId" element={<SubmissionDetails />} />
            <Route path="/iqac/review" element={<ReviewCenter />} />
            <Route path="/iqac/evidence" element={<EvidenceRepository />} />
            <Route path="/iqac/evidence/review" element={<EvidenceReviewCenter />} />
            <Route path="/iqac/evidence/:evidenceId" element={<EvidenceDetails />} />
            <Route path="/iqac/meetings" element={<IQACMeetings />} />
            <Route path="/iqac/meetings/:meetingId" element={<MeetingDetails />} />
            <Route path="/iqac/action-items" element={<ActionItems />} />
            <Route path="/iqac/action-items/:actionItemId" element={<ActionItemDetails />} />
            <Route path="/iqac/activities" element={<IQACActivities />} />
            <Route path="/iqac/activities/:activityId" element={<ActivityDetails />} />
            <Route path="/iqac/departments" element={<IQACDepartments />} />
            <Route path="/iqac/coordinators" element={<IQACCoordinators />} />
            <Route path="/iqac/coordinators/me" element={<IQACCoordinatorDetails isMe />} />
            <Route path="/iqac/coordinators/:coordinatorId" element={<IQACCoordinatorDetails />} />
            <Route path="/iqac/monitoring" element={<IQACMonitoring />} />
            <Route path="/iqac/reports" element={<IQACReports />} />

            {/* Stage 5F Quality Monitoring & Compliance Routes */}
            <Route path="/iqac/quality-monitoring" element={<QualityMonitoring />} />
            <Route path="/iqac/quality-monitoring/indicators" element={<QualityIndicators />} />
            <Route path="/iqac/quality-monitoring/departments" element={<DepartmentQualityScorecards />} />
            <Route path="/iqac/quality-monitoring/departments/:departmentId" element={<DepartmentQualityDetails />} />
            <Route path="/iqac/quality-monitoring/comparison" element={<DepartmentQualityComparison />} />
            <Route path="/iqac/quality-monitoring/trends" element={<QualityTrends />} />
            <Route path="/iqac/compliance" element={<ComplianceCenter />} />
            <Route path="/iqac/compliance/:complianceId" element={<ComplianceDetails />} />
            <Route path="/iqac/improvement-plans" element={<ImprovementPlans />} />
            <Route path="/iqac/improvement-plans/:planId" element={<ImprovementPlanDetails />} />

            {/* Stage 5G NAAC Accreditation Framework Routes */}
            <Route path="/accreditation" element={<AccreditationDashboard />} />
            <Route path="/accreditation/criteria/:criterionId" element={<CriterionDetails />} />
            <Route path="/accreditation/metrics" element={<QualityIndicators />} />
            <Route path="/accreditation/metrics/:metricId" element={<MetricDetails />} />
            <Route path="/accreditation/evidence-gaps" element={<EvidenceGaps />} />
            <Route path="/accreditation/data-gaps" element={<DataGaps />} />
            <Route path="/accreditation/gaps" element={<AccreditationGaps />} />
            <Route path="/accreditation/departments" element={<DepartmentAccreditationScorecards />} />
            <Route path="/accreditation/framework" element={<FrameworkManagement />} />

            {/* Stage 5H Auto-AQAR Generation Engine Routes */}
            <Route path="/aqar" element={<AQARReportCenter />} />
            <Route path="/aqar/create" element={<CreateAQAR />} />
            <Route path="/aqar/:reportId/edit" element={<AQARBuilder />} />
            <Route path="/aqar/:reportId/preview" element={<AQARPreview />} />
            <Route path="/aqar/history" element={<AQARHistory />} />
            <Route path="/aqar/:reportId/compare" element={<AQARVersionCompare />} />

            {/* Stage 2 Institution Overview & Department Drill-Down */}
            <Route path="/director/institution" element={<InstitutionOverview />} />
            <Route path="/director/institution/departments" element={<Departments />} />
            <Route path="/director/institution/departments/:departmentId" element={<DepartmentDetails />} />

            {/* Stage 3 Advanced Institutional Analytics Modules */}
            <Route path="/director/analytics" element={<AnalyticsOverview />} />
            <Route path="/director/analytics/academic" element={<AcademicAnalytics />} />
            <Route path="/director/analytics/students" element={<StudentAnalytics />} />
            <Route path="/director/analytics/faculty" element={<FacultyAnalytics />} />
            <Route path="/director/analytics/research" element={<ResearchAnalytics />} />
            <Route path="/director/analytics/publications" element={<PublicationAnalytics />} />
            <Route path="/director/analytics/placement" element={<PlacementAnalytics />} />
            <Route path="/director/analytics/departments" element={<DepartmentComparison />} />

            {/* Stage 4 Report Management & Generation Modules */}
            <Route path="/director/reports" element={<ReportCenter />} />
            <Route path="/director/reports/generate" element={<GenerateReport />} />
            <Route path="/director/reports/history" element={<ReportHistory />} />
            <Route path="/director/reports/:reportId" element={<ReportDetails />} />

            {/* Profile, Notifications, Settings */}
            <Route path="/director/profile" element={<Profile />} />
            <Route path="/director/notifications" element={<Notifications />} />
            <Route path="/director/settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
