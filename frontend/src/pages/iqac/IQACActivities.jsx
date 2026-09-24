import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useActivities } from '../../hooks/useActivities';
import { useIQAC } from '../../hooks/useIQAC';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { ActivityTable } from '../../components/iqac/ActivityTable';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { CreateActivityModal } from '../../components/iqac/CreateActivityModal';
import { Loader } from '../../components/common/Loader';
import { Award, Clock, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';

export const IQACActivities = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { departments } = useIQAC();
  const { activities, statistics, loading, createActivity } = useActivities();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading || !statistics) {
    return <Loader message="Loading IQAC Quality Activities & Initiatives Directory..." />;
  }

  const handleCreateSubmit = async (payload) => {
    try {
      const res = await createActivity(payload);
      toast.success(res.message || 'IQAC Activity created successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to create activity.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              IQAC Quality Activities & Initiatives
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Operational quality drive portal for managing faculty development drives, academic audits, feedback collection & NAAC initiatives
          </p>
        </div>

        {user?.role !== ROLES.STAFF && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Launch New Activity</span>
          </button>
        )}
      </div>

      {/* Top Statistics Cards (Section 42 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <IQACStatCard
          title="Total Activities"
          value={statistics.total}
          subtitle="Initiatives Scope"
          icon={Award}
          color="indigo"
        />
        <IQACStatCard
          title="Planned Initiatives"
          value={statistics.planned}
          subtitle="Upcoming Drives"
          icon={Clock}
          color="blue"
        />
        <IQACStatCard
          title="In Progress"
          value={statistics.inProgress}
          subtitle="Active Progress"
          icon={Clock}
          color="amber"
        />
        <IQACStatCard
          title="Completed"
          value={statistics.completed}
          subtitle="Targets Achieved"
          icon={CheckCircle2}
          color="emerald"
        />
        <IQACStatCard
          title="Overdue Initiatives"
          value={statistics.overdue}
          subtitle="Past End Date"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Activity Directory Table */}
      <ActivityTable activities={activities} departments={departments} />

      {/* Create Modal */}
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};
