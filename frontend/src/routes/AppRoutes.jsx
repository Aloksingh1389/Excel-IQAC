import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute } from './ProtectedRoute';
import { InstitutionAdminLayout } from '../layouts/InstitutionAdminLayout';
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

// Common / Error Pages
import { NotFound } from '../pages/common/NotFound';
import { Unauthorized } from '../pages/common/Unauthorized';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Director & Principal Shell Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={[ROLES.INSTITUTION_ADMIN]} />}>
          <Route element={<InstitutionAdminLayout />}>
            <Route path="/" element={<Navigate to="/director/dashboard" replace />} />
            <Route path="/director" element={<Navigate to="/director/dashboard" replace />} />
            <Route path="/director/dashboard" element={<Dashboard />} />

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
