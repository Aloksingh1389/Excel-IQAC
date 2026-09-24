import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIQAC } from '../../hooks/useIQAC';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { DepartmentIQACTable } from '../../components/iqac/DepartmentIQACTable';
import { StaffMonitoringTable } from '../../components/iqac/StaffMonitoringTable';
import { PendingItemsCard } from '../../components/iqac/PendingItemsCard';
import { IQACOverview } from '../../components/iqac/IQACOverview';
import { IQACStatusBadge } from '../../components/iqac/IQACStatusBadge';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  TrendingUp,
  FileText,
  UserCheck,
  Filter,
  ArrowRight,
} from 'lucide-react';

export const IQACDashboard = () => {
  const { user, academicYear, setAcademicYear } = useAuth();
  const {
    statistics,
    departments,
    coordinators,
    pendingItems,
    staffMonitoring,
    attentionRequired,
    recentActivities,
    loading,
    error,
  } = useIQAC();

  const [selectedDeptCode, setSelectedDeptCode] = useState('ALL');

  if (loading || !statistics) {
    return <Loader message="Loading IQAC Institutional Dashboard..." />;
  }

  const role = user?.role || ROLES.STAFF;
  const isApexDirector =
    role === ROLES.TECHNICAL_DIRECTOR ||
    role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
    role === ROLES.INSTITUTION_ADMIN;
  const isIqacHead = role === ROLES.IQAC_HEAD;
  const isDean = role === ROLES.DEAN;
  const isHod = role === ROLES.HOD;
  const isCoordinator = role === ROLES.IQAC_COORDINATOR;
  const isStaff = role === ROLES.STAFF;

  // Filter departments for Dean / HOD / Coordinator dropdowns
  const displayedDepartments =
    selectedDeptCode === 'ALL'
      ? departments
      : departments.filter((d) => d.code === selectedDeptCode);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with Role Scope Badge & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              IQAC Management Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            {isApexDirector &&
              'Apex Institutional Quality Portal — Institution-wide IQAC compliance, evidence verification & governance metrics.'}
            {isIqacHead &&
              'IQAC Head Command Hub — Monitoring 18 department quality submissions, evidence compliance & accreditation readiness.'}
            {isDean &&
              `Dean Governance Hub — Monitoring assigned departments: ${user?.assignedDepartments?.join(', ') || 'CSE, ECE, EEE, MECH, CIVIL'}.`}
            {isHod &&
              `HOD Department Hub — Operational & quality monitoring for ${user?.department || 'Computer Science & Engineering'}.`}
            {isCoordinator &&
              `Department IQAC Coordinator — Monitoring staff submissions, evidence uploads & review workflows for ${user?.department || 'Computer Science & Engineering'}.`}
            {isStaff &&
              'Personal IQAC Portfolio — My academic records, publication submissions & evidence upload status.'}
          </p>
        </div>

        {/* Global Controls: Academic Year & Scope Selector */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Cycle:</span>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="bg-transparent font-extrabold text-indigo-900 focus:outline-none cursor-pointer"
            >
              <option value="2026-27">2026–27</option>
              <option value="2025-26">2025–26</option>
              <option value="2024-25">2024–25</option>
            </select>
          </div>

          {!isStaff && !isHod && !isCoordinator && (
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDeptCode}
                onChange={(e) => setSelectedDeptCode(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">
                  {isDean ? 'All Assigned Departments' : 'All Departments'}
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.code}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 2. ROLE-AWARE DASHBOARD VIEWS */}

      {/* --------------------------------------------------- */}
      {/* VIEW A: IQAC HEAD / APEX DIRECTORS DASHBOARD VIEW */}
      {/* --------------------------------------------------- */}
      {(isApexDirector || isIqacHead) && (
        <div className="space-y-6">
          {/* Top Stat Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
            <IQACStatCard
              title="Departments"
              value={statistics.departmentsCount}
              subtitle="Active IQAC Units"
              icon={Building2}
              color="indigo"
            />
            <IQACStatCard
              title="Coordinators"
              value={statistics.coordinatorsCount}
              subtitle="Department Leads"
              icon={Users}
              color="blue"
            />
            <IQACStatCard
              title="Total Staff"
              value={statistics.totalStaffCount}
              subtitle="Faculty Members"
              icon={UserCheck}
              color="indigo"
            />
            <IQACStatCard
              title="Submissions"
              value={statistics.totalSubmissions.toLocaleString()}
              subtitle={`${statistics.completedSubmissions} Completed`}
              icon={FileText}
              color="emerald"
              change="+14%"
            />
            <IQACStatCard
              title="Pending Review"
              value={statistics.pendingReviewCount}
              subtitle="Awaiting Verification"
              icon={Clock}
              color="amber"
            />
            <IQACStatCard
              title="Verified"
              value={statistics.verifiedSubmissionsCount.toLocaleString()}
              subtitle="Audited Portfolio Data"
              icon={CheckCircle2}
              color="emerald"
              badgeText="VERIFIED"
            />
          </div>

          {/* Management Compliance Summary Card */}
          <Card className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                  Institutional IQAC Governance Summary
                </span>
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Institutional Quality Index Score: {statistics.institutionScore}%
                </h3>
                <p className="text-xs text-slate-300">
                  High-level institutional quality assessment across 18 departments for Cycle {academicYear}.
                </p>
              </div>

              <div className="flex items-center gap-4 text-center shrink-0">
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                  <p className="text-xs font-bold uppercase">On Track</p>
                  <p className="text-xl font-black">{statistics.departmentsOnTrack}</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
                  <p className="text-xs font-bold uppercase">Attention</p>
                  <p className="text-xl font-black">{statistics.departmentsAttention}</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300">
                  <p className="text-xs font-bold uppercase">Overdue</p>
                  <p className="text-xl font-black">{statistics.departmentsOverdue}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recharts Visualizations */}
          <IQACOverview departments={displayedDepartments} statistics={statistics} />

          {/* Department IQAC Performance Table */}
          <DepartmentIQACTable departments={displayedDepartments} />

          {/* Attention Required & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PendingItemsCard items={attentionRequired} />

            <Card className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recent IQAC Activity</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Live Audit Log</span>
              </div>

              <div className="space-y-3 custom-scroll max-h-80 overflow-y-auto pr-1">
                {recentActivities.map((act) => (
                  <div key={act.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{act.actor}</span>
                      <span className="text-[10px] font-semibold text-slate-400">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{act.action}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* VIEW B: DEAN DASHBOARD VIEW */}
      {/* --------------------------------------------------- */}
      {isDean && (
        <div className="space-y-6">
          <Card className="p-5 bg-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                DEAN'S JURISDICTIONAL SCOPE
              </span>
              <h2 className="text-lg font-black text-white">
                Assigned Departments Overview
              </h2>
              <p className="text-xs text-indigo-200 mt-1">
                Restricted metrics and progress monitoring for assigned departments: CSE, ECE, EEE, MECH, CIVIL
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-indigo-800 text-indigo-100 text-xs font-bold border border-indigo-700">
                5 Departments Managed
              </span>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <IQACStatCard
              title="Departments Managed"
              value={displayedDepartments.length}
              subtitle="Assigned Jurisdiction"
              icon={Building2}
              color="indigo"
            />
            <IQACStatCard
              title="Total Staff"
              value={statistics.totalStaffCount}
              subtitle="Faculty in Scope"
              icon={Users}
              color="blue"
            />
            <IQACStatCard
              title="Pending Submissions"
              value={statistics.pendingReviewCount}
              subtitle="Require Review"
              icon={Clock}
              color="amber"
            />
            <IQACStatCard
              title="Verified Submissions"
              value={statistics.verifiedSubmissionsCount}
              subtitle="Audited & Approved"
              icon={CheckCircle2}
              color="emerald"
            />
            <IQACStatCard
              title="Evidence Pending"
              value={statistics.pendingEvidenceCount}
              subtitle="Verification Requests"
              icon={AlertTriangle}
              color="rose"
            />
          </div>

          <IQACOverview departments={displayedDepartments} statistics={statistics} />

          <DepartmentIQACTable departments={displayedDepartments} />

          <PendingItemsCard items={attentionRequired} />
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* VIEW C: HOD DASHBOARD VIEW */}
      {/* --------------------------------------------------- */}
      {isHod && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                OWN DEPARTMENT DASHBOARD
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {user?.department || 'Computer Science & Engineering'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Head of Department Operational & Academic Quality Control
              </p>
            </div>
            <IQACStatusBadge status="ON_TRACK" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <IQACStatCard
              title="Total Staff"
              value={staffMonitoring.length || 42}
              subtitle="Department Faculty"
              icon={Users}
              color="indigo"
            />
            <IQACStatCard
              title="Pending Staff Updates"
              value={staffMonitoring.filter((s) => s.status !== 'ON_TRACK' && s.status !== 'COMPLETED').length}
              subtitle="Faculty Needing Action"
              icon={AlertTriangle}
              color="amber"
            />
            <IQACStatCard
              title="IQAC Submissions"
              value="85"
              subtitle="72 Completed"
              icon={FileText}
              color="emerald"
            />
            <IQACStatCard
              title="Evidence Pending"
              value="8"
              subtitle="Awaiting Review"
              icon={Clock}
              color="rose"
            />
            <IQACStatCard
              title="Verification Progress"
              value="85%"
              subtitle="Verified by IQAC Head"
              icon={CheckCircle2}
              color="blue"
            />
          </div>

          <StaffMonitoringTable staffList={staffMonitoring} departmentName={user?.department} />

          <PendingItemsCard items={attentionRequired} />
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* VIEW D: IQAC COORDINATOR DASHBOARD VIEW */}
      {/* --------------------------------------------------- */}
      {isCoordinator && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                DEPARTMENT IQAC COORDINATOR HUB
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                CSE Department
              </span>
            </div>
            <h2 className="text-xl font-black text-white">
              Staff & Submission Quality Monitoring
            </h2>
            <p className="text-xs text-slate-300">
              Department-scoped monitoring of faculty profile completeness, evidence documentation & submission readiness.
            </p>
          </div>

          {/* 3 Monitoring Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Staff Monitoring Summary Card */}
            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Staff Monitoring Status
              </h3>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-500 font-medium">Total Staff</p>
                  <p className="text-lg font-black text-slate-900">42</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-950">
                  <p className="text-xs font-medium">Updated</p>
                  <p className="text-lg font-black">35</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-950">
                  <p className="text-xs font-medium">Pending</p>
                  <p className="text-lg font-black">5</p>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-950">
                  <p className="text-xs font-medium">Incomplete</p>
                  <p className="text-lg font-black">2</p>
                </div>
              </div>
            </Card>

            {/* IQAC Submissions Card */}
            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                IQAC Submissions
              </h3>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-500 font-medium">Submitted</p>
                  <p className="text-lg font-black text-slate-900">72</p>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-950">
                  <p className="text-xs font-medium">Verified</p>
                  <p className="text-lg font-black">65</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-950">
                  <p className="text-xs font-medium">Pending Review</p>
                  <p className="text-lg font-black">8</p>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-950">
                  <p className="text-xs font-medium">Returned</p>
                  <p className="text-lg font-black">3</p>
                </div>
              </div>
            </Card>

            {/* Evidence Card */}
            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Evidence Documentation
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <p className="text-[10px] text-slate-500 font-medium">Uploaded</p>
                  <p className="text-lg font-black text-slate-900">90</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-950">
                  <p className="text-[10px] font-medium">Pending</p>
                  <p className="text-lg font-black">8</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-950">
                  <p className="text-[10px] font-medium">Verified</p>
                  <p className="text-lg font-black">82</p>
                </div>
              </div>
            </Card>
          </div>

          <StaffMonitoringTable staffList={staffMonitoring} departmentName={user?.department} />

          <PendingItemsCard items={attentionRequired} />
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* VIEW E: STAFF DASHBOARD VIEW */}
      {/* --------------------------------------------------- */}
      {isStaff && (
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900 text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                  MY PERSONAL IQAC PORTFOLIO
                </span>
                <h2 className="text-xl font-black text-white">
                  Welcome, {user?.name}
                </h2>
                <p className="text-xs text-slate-300">
                  {user?.designation || 'Associate Professor'} &bull; {user?.department || 'Computer Science & Engineering'}
                </p>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-right shrink-0">
                <p className="text-[10px] font-bold text-indigo-200 uppercase">Profile Completion</p>
                <p className="text-2xl font-black text-white">92%</p>
              </div>
            </div>
          </Card>

          {/* Personal Summary Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Academic Info</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-base font-bold text-slate-900">Complete</p>
              <p className="text-[10px] text-slate-400">Qualifications & Subjects Updated</p>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Research Data</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-base font-bold text-slate-900">Complete</p>
              <p className="text-[10px] text-slate-400">3 Active Projects</p>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Publications</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-base font-bold text-amber-800">Pending Update</p>
              <p className="text-[10px] text-slate-400">1 Journal Paper Pending Evidence</p>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Evidence Uploads</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-base font-bold text-rose-700">2 Pending</p>
              <p className="text-[10px] text-slate-400">Certificates awaiting upload</p>
            </Card>
          </div>

          {/* Submissions Breakdown */}
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              My Submissions Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500">Draft</p>
                <p className="text-xl font-black text-slate-800">2</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-950">
                <p className="text-xs font-semibold">Under Review</p>
                <p className="text-xl font-black">1</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-950">
                <p className="text-xs font-semibold">Returned</p>
                <p className="text-xl font-black">1</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                <p className="text-xs font-semibold">Verified</p>
                <p className="text-xl font-black">8</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
