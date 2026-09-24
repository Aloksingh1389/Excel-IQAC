import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIQAC } from '../../hooks/useIQAC';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { CoordinatorTable } from '../../components/iqac/CoordinatorTable';
import { DepartmentCoverageCard } from '../../components/iqac/DepartmentCoverageCard';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { AssignCoordinatorModal } from '../../components/iqac/AssignCoordinatorModal';
import { ReassignCoordinatorModal } from '../../components/iqac/ReassignCoordinatorModal';
import { CoordinatorStatusModal } from '../../components/iqac/CoordinatorStatusModal';
import { SendCoordinatorNotificationModal } from '../../components/iqac/SendCoordinatorNotificationModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Users, UserCheck, AlertTriangle, ShieldCheck, UserPlus, Send, ArrowRight, Building2 } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

export const IQACCoordinators = () => {
  const { user } = useAuth();
  const toast = useToast();

  // Section 27 requirement: If logged-in user is IQAC Coordinator, redirect to own coordinator view
  if (user?.role === ROLES.IQAC_COORDINATOR) {
    return <Navigate to="/iqac/coordinators/me" replace />;
  }

  const {
    coordinators,
    coordinatorStats,
    departments,
    unassignedDepartments,
    staffMonitoring,
    loading,
    assignCoordinator,
    reassignCoordinator,
    updateCoordinatorStatus,
    sendNotification,
    getEligibleFacultyCandidates,
  } = useIQAC();

  const [candidates, setCandidates] = useState([]);

  // Modal states
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isSendNotifOpen, setIsSendNotifOpen] = useState(false);

  const [selectedCoord, setSelectedCoord] = useState(null);
  const [selectedDeptForAssign, setSelectedDeptForAssign] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await getEligibleFacultyCandidates();
        if (res.success) setCandidates(res.data);
      } catch (err) {
        console.error('Error loading candidates:', err);
      }
    };
    fetchCandidates();
  }, []);

  if (loading || !coordinatorStats) {
    return <Loader message="Loading IQAC Coordinators Directory & Management Hub..." />;
  }

  const isHeadOrApex =
    user?.role === ROLES.IQAC_HEAD ||
    user?.role === ROLES.TECHNICAL_DIRECTOR ||
    user?.role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
    user?.role === ROLES.INSTITUTION_ADMIN;

  const canManage = isHeadOrApex;

  // Handlers
  const handleOpenAssign = (dept = null) => {
    setSelectedDeptForAssign(dept);
    setIsAssignOpen(true);
  };

  const handleOpenReassign = (coord) => {
    setSelectedCoord(coord);
    setIsReassignOpen(true);
  };

  const handleOpenStatusModal = (coord) => {
    setSelectedCoord(coord);
    setIsStatusModalOpen(true);
  };

  const handleAssignSubmit = async (payload) => {
    try {
      const res = await assignCoordinator(payload);
      toast.success(res.message || 'Coordinator assigned successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to assign coordinator.');
      throw err;
    }
  };

  const handleReassignSubmit = async (payload) => {
    try {
      const res = await reassignCoordinator(payload);
      toast.success(res.message || 'Coordinator reassigned successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to reassign coordinator.');
      throw err;
    }
  };

  const handleStatusSubmit = async (payload) => {
    try {
      const res = await updateCoordinatorStatus(payload);
      toast.success(res.message || 'Coordinator status updated successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
      throw err;
    }
  };

  const handleSendNotificationSubmit = async (payload) => {
    try {
      const res = await sendNotification(payload);
      toast.success(res.message || 'Notification broadcasted successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to send notification.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Department IQAC Coordinator Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Institutional overview of department leads, assignment workflows, status management & activity monitoring
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canManage && (
            <button
              type="button"
              onClick={() => handleOpenAssign(null)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Assign New Coordinator</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsSendNotifOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Send Broadcast</span>
          </button>
        </div>
      </div>

      {/* 2. Top Statistics Cards (Section 12 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <IQACStatCard
          title="Total Coordinators"
          value={coordinatorStats.total}
          subtitle="Department Leads"
          icon={Users}
          color="indigo"
        />
        <IQACStatCard
          title="Active Coordinators"
          value={coordinatorStats.active}
          subtitle="Operational Roles"
          icon={UserCheck}
          color="emerald"
        />
        <IQACStatCard
          title="Pending Assignment"
          value={coordinatorStats.pendingAssignment}
          subtitle="Departments Without Lead"
          icon={Building2}
          color="amber"
        />
        <IQACStatCard
          title="Suspended"
          value={coordinatorStats.suspended}
          subtitle="Audit Review Required"
          icon={AlertTriangle}
          color="rose"
        />
        <IQACStatCard
          title="Deactivated"
          value={coordinatorStats.deactivated}
          subtitle="Past Assignments"
          icon={ShieldCheck}
          color="blue"
        />
      </div>

      {/* 3. Department Coverage Grid (Section 13 & 14 requirement) */}
      <DepartmentCoverageCard
        departments={departments}
        coordinators={coordinators}
        canManage={canManage}
        onOpenAssign={handleOpenAssign}
      />

      {/* 4. Coordinators Table (Section 11 requirement) */}
      <CoordinatorTable
        coordinators={coordinators}
        departments={departments}
        canManage={canManage}
        onOpenAssign={() => handleOpenAssign(null)}
        onOpenReassign={handleOpenReassign}
        onOpenStatusModal={handleOpenStatusModal}
      />

      {/* 5. Modals */}
      <AssignCoordinatorModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        unassignedDepartments={unassignedDepartments}
        allDepartments={departments}
        candidates={candidates}
        onAssign={handleAssignSubmit}
        preselectedDepartment={selectedDeptForAssign}
      />

      <ReassignCoordinatorModal
        isOpen={isReassignOpen}
        onClose={() => setIsReassignOpen(false)}
        coordinator={selectedCoord}
        candidates={candidates}
        onReassign={handleReassignSubmit}
      />

      <CoordinatorStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        coordinator={selectedCoord}
        onUpdateStatus={handleStatusSubmit}
      />

      <SendCoordinatorNotificationModal
        isOpen={isSendNotifOpen}
        onClose={() => setIsSendNotifOpen(false)}
        onSend={handleSendNotificationSubmit}
        staffList={staffMonitoring}
      />
    </div>
  );
};
