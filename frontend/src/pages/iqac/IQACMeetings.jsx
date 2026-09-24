import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMeetings } from '../../hooks/useMeetings';
import { useIQAC } from '../../hooks/useIQAC';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { MeetingTable } from '../../components/iqac/MeetingTable';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { CreateMeetingModal } from '../../components/iqac/CreateMeetingModal';
import { Loader } from '../../components/common/Loader';
import { Calendar, Clock, CheckCircle2, FileText, Plus, Users, ShieldCheck } from 'lucide-react';

export const IQACMeetings = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { departments } = useIQAC();
  const { meetings, statistics, loading, createMeeting } = useMeetings();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading || !statistics) {
    return <Loader message="Loading IQAC Meetings Directory..." />;
  }

  const handleCreateSubmit = async (payload) => {
    try {
      const res = await createMeeting(payload);
      toast.success(res.message || 'Meeting scheduled successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to schedule meeting.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              IQAC Meetings & Minutes Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Operational meeting portal for scheduling reviews, tracking agendas, recording attendance & finalizing resolutions
          </p>
        </div>

        {user?.role !== ROLES.STAFF && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Meeting</span>
          </button>
        )}
      </div>

      {/* Top Statistics Cards (Section 12 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <IQACStatCard
          title="Total Meetings"
          value={statistics.total}
          subtitle="Institutional Scope"
          icon={Calendar}
          color="indigo"
        />
        <IQACStatCard
          title="Upcoming Meetings"
          value={statistics.upcoming}
          subtitle="Scheduled Sessions"
          icon={Clock}
          color="blue"
        />
        <IQACStatCard
          title="Completed Meetings"
          value={statistics.completed}
          subtitle="Conducted Sessions"
          icon={CheckCircle2}
          color="emerald"
        />
        <IQACStatCard
          title="Minutes Pending"
          value={statistics.minutesPending}
          subtitle="Awaiting Finalization"
          icon={FileText}
          color="amber"
        />
        <IQACStatCard
          title="Minutes Finalized"
          value={statistics.minutesFinalized}
          subtitle="Official Resolutions"
          icon={ShieldCheck}
          color="teal"
        />
      </div>

      {/* Meeting Directory Table (Section 13 requirement) */}
      <MeetingTable meetings={meetings} departments={departments} />

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};
