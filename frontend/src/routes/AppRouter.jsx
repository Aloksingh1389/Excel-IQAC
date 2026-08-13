import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute } from './ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { ROLES } from '../config/roles';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Dashboard Router
import { DashboardRouter } from '../pages/dashboards/DashboardRouter';

// Publications
import { PublicationList } from '../pages/publications/PublicationList';
import { AddPublication } from '../pages/publications/AddPublication';
import { PublicationDetails } from '../pages/publications/PublicationDetails';

// Research & Grants
import { ResearchList } from '../pages/research/ResearchList';
import { AddResearch } from '../pages/research/AddResearch';

// FDP
import { FdpList } from '../pages/fdp/FdpList';
import { AddFdp } from '../pages/fdp/AddFdp';

// Achievements
import { AchievementList } from '../pages/achievements/AchievementList';
import { AddAchievement } from '../pages/achievements/AddAchievement';

// Academic Records
import { AcademicRecordList } from '../pages/academic/AcademicRecordList';
import { AddAcademicRecord } from '../pages/academic/AddAcademicRecord';

// HOD & Department Management
import { DepartmentApprovals } from '../pages/hod/DepartmentApprovals';
import { FacultyManagement } from '../pages/hod/FacultyManagement';

// IQAC Quality & Audits
import { QualityInitiatives } from '../pages/iqac/QualityInitiatives';
import { InternalAudits } from '../pages/iqac/InternalAudits';
import { AccreditationCriteria } from '../pages/iqac/AccreditationCriteria';

// Documents
import { DocumentRepository } from '../pages/documents/DocumentRepository';

// Reports
import { ReportGenerator } from '../pages/reports/ReportGenerator';
import { ReportViewer } from '../pages/reports/ReportViewer';

// Profile & Notifications
import { NotificationsList } from '../pages/notifications/NotificationsList';
import { UserProfile } from '../pages/profile/UserProfile';
import { Settings } from '../pages/profile/Settings';

// Error Pages
import { NotFound } from '../pages/common/NotFound';
import { Unauthorized } from '../pages/common/Unauthorized';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Main Layout Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardRouter />} />

          {/* Publications */}
          <Route path="/publications" element={<PublicationList />} />
          <Route path="/publications/add" element={<AddPublication />} />
          <Route path="/publications/:id" element={<PublicationDetails />} />

          {/* Research & Grants */}
          <Route path="/research" element={<ResearchList />} />
          <Route path="/research/add" element={<AddResearch />} />

          {/* FDP & Training */}
          <Route path="/fdp" element={<FdpList />} />
          <Route path="/fdp/add" element={<AddFdp />} />

          {/* Achievements */}
          <Route path="/achievements" element={<AchievementList />} />
          <Route path="/achievements/add" element={<AddAchievement />} />

          {/* Academic Records */}
          <Route path="/academic" element={<AcademicRecordList />} />
          <Route path="/academic/add" element={<AddAcademicRecord />} />

          {/* Department Admin (HOD / DEAN / IQAC / DIRECTOR) */}
          <Route
            path="/hod/approvals"
            element={
              <RoleRoute
                allowedRoles={[
                  ROLES.HOD,
                  ROLES.DEAN,
                  ROLES.IQAC_MEMBER,
                  ROLES.IQAC_HEAD,
                  ROLES.DIRECTOR,
                ]}
              />
            }
          >
            <Route index element={<DepartmentApprovals />} />
          </Route>

          <Route
            path="/hod/faculty"
            element={
              <RoleRoute
                allowedRoles={[
                  ROLES.HOD,
                  ROLES.DEAN,
                  ROLES.IQAC_MEMBER,
                  ROLES.IQAC_HEAD,
                  ROLES.DIRECTOR,
                ]}
              />
            }
          >
            <Route index element={<FacultyManagement />} />
          </Route>

          {/* IQAC Central Management */}
          <Route path="/iqac/initiatives" element={<QualityInitiatives />} />
          <Route path="/iqac/audits" element={<InternalAudits />} />
          <Route path="/iqac/accreditation" element={<AccreditationCriteria />} />

          {/* Documents & Reports */}
          <Route path="/documents" element={<DocumentRepository />} />
          <Route path="/reports/generate" element={<ReportGenerator />} />
          <Route path="/reports/view/:id" element={<ReportViewer />} />

          {/* Notifications, Profile & Settings */}
          <Route path="/notifications" element={<NotificationsList />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
