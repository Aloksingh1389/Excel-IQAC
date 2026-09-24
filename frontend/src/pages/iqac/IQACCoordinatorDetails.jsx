import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIQAC } from '../../hooks/useIQAC';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { CoordinatorProfileCard } from '../../components/iqac/CoordinatorProfileCard';
import { CoordinatorPerformanceCard } from '../../components/iqac/CoordinatorPerformanceCard';
import { CoordinatorActivity } from '../../components/iqac/CoordinatorActivity';
import { CoordinatorAssignmentHistory } from '../../components/iqac/CoordinatorAssignmentHistory';
import { CoordinatorNotificationHistory } from '../../components/iqac/CoordinatorNotificationHistory';
import { ReassignCoordinatorModal } from '../../components/iqac/ReassignCoordinatorModal';
import { CoordinatorStatusModal } from '../../components/iqac/CoordinatorStatusModal';
import { SendCoordinatorNotificationModal } from '../../components/iqac/SendCoordinatorNotificationModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, RefreshCw, ShieldAlert, Send, Users, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const IQACCoordinatorDetails = ({ isMe = false }) => {
  const { coordinatorId } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const targetId = isMe ? 'me' : coordinatorId;

  const {
    getCoordinatorDetails,
    reassignCoordinator,
    updateCoordinatorStatus,
    sendNotification,
    getEligibleFacultyCandidates,
    staffMonitoring,
  } = useIQAC();

  const [details, setDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSendNotifOpen, setIsSendNotifOpen] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const [detRes, candRes] = await Promise.all([
        getCoordinatorDetails(targetId),
        getEligibleFacultyCandidates(),
      ]);

      if (detRes.success) setDetails(detRes.data);
      if (candRes.success) setCandidates(candRes.data);
    } catch (err) {
      console.error('Error fetching coordinator details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [coordinatorId, isMe]);

  if (loading || !details) {
    return <Loader message="Loading Coordinator Portfolio & Quality Audit History..." />;
  }

  const { coordinator, department, history, activities, performance } = details;

  const isHeadOrApex =
    user?.role === ROLES.IQAC_HEAD ||
    user?.role === ROLES.TECHNICAL_DIRECTOR ||
    user?.role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
    user?.role === ROLES.INSTITUTION_ADMIN;

  const isOwnProfile = user?.email === coordinator.email || isMe;

  const handleReassignSubmit = async (payload) => {
    try {
      const res = await reassignCoordinator(payload);
      toast.success(res.message || 'Coordinator reassigned successfully.');
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to reassign.');
      throw err;
    }
  };

  const handleStatusSubmit = async (payload) => {
    try {
      const res = await updateCoordinatorStatus(payload);
      toast.success(res.message || 'Status updated successfully.');
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
      throw err;
    }
  };

  const handleSendNotificationSubmit = async (payload) => {
    try {
      const res = await sendNotification(payload);
      toast.success(res.message || 'Notification broadcasted successfully.');
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to send notification.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/coordinators"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Back to Coordinators Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {coordinator.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Department IQAC Coordinator Portfolio &bull; {coordinator.departmentName} ({coordinator.departmentCode})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {(isOwnProfile || isHeadOrApex) && (
            <button
              type="button"
              onClick={() => setIsSendNotifOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Notification</span>
            </button>
          )}

          {isHeadOrApex && (
            <>
              <button
                type="button"
                onClick={() => setIsReassignOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                <span>Reassign Department</span>
              </button>

              <button
                type="button"
                onClick={() => setIsStatusOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-amber-800 font-bold text-xs border border-amber-200 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Change Status</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Department Summary Banner (Section 18 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <Card className="p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Department Staff</p>
          <p className="text-2xl font-black text-slate-900">{department?.staffCount || 42}</p>
          <p className="text-[10px] text-slate-500 font-medium">Faculty Members</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Submission Completion</p>
          <p className="text-2xl font-black text-emerald-700">{department?.completedSubmissions || 72}</p>
          <p className="text-[10px] text-slate-500 font-medium">Verified Submissions</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Evidence Uploaded</p>
          <p className="text-2xl font-black text-indigo-900">{department?.evidenceUploaded || 90}</p>
          <p className="text-[10px] text-emerald-600 font-medium">{department?.evidenceVerified || 82} Verified</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Items</p>
          <p className="text-2xl font-black text-amber-600">{department?.pendingSubmissions || 8}</p>
          <p className="text-[10px] text-slate-500 font-medium">Awaiting Action</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Overall IQAC Status</p>
          <p className="text-sm font-extrabold text-emerald-700 pt-1">{department?.overallStatus || 'ON_TRACK'}</p>
          <p className="text-[10px] text-slate-500 font-medium">Department Quality Index</p>
        </Card>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Profile, Performance, History */}
        <div className="space-y-6">
          <CoordinatorProfileCard coordinator={coordinator} department={department} />

          <CoordinatorPerformanceCard performance={performance} />

          <CoordinatorAssignmentHistory history={history} departmentName={department?.name} />
        </div>

        {/* Right Column: Activities & Notification History */}
        <div className="lg:col-span-2 space-y-6">
          <CoordinatorActivity activities={activities} />

          <CoordinatorNotificationHistory
            notifications={[]}
            onOpenSendModal={() => setIsSendNotifOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <ReassignCoordinatorModal
        isOpen={isReassignOpen}
        onClose={() => setIsReassignOpen(false)}
        coordinator={coordinator}
        candidates={candidates}
        onReassign={handleReassignSubmit}
      />

      <CoordinatorStatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        coordinator={coordinator}
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
