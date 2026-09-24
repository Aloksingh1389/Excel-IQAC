import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useActionItems } from '../../hooks/useActionItems';
import { useIQAC } from '../../hooks/useIQAC';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { ActionItemTable } from '../../components/iqac/ActionItemTable';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { CreateActionItemModal } from '../../components/iqac/CreateActionItemModal';
import { Loader } from '../../components/common/Loader';
import { CheckSquare, Clock, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';

export const ActionItems = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { departments } = useIQAC();
  const { actionItems, statistics, loading, createActionItem } = useActionItems();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading || !statistics) {
    return <Loader message="Loading IQAC Action Items & Compliance Directory..." />;
  }

  const handleCreateSubmit = async (payload) => {
    try {
      const res = await createActionItem(payload);
      toast.success(res.message || 'Action item created & assigned.');
    } catch (err) {
      toast.error(err.message || 'Failed to create action item.');
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
              IQAC Action Items & Decision Tracking
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Operational action item dashboard for tracking owner assignments, deadlines, progress % & evidence completion
          </p>
        </div>

        {user?.role !== ROLES.STAFF && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Action Item</span>
          </button>
        )}
      </div>

      {/* Top Statistics Cards (Section 31 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <IQACStatCard
          title="Total Action Items"
          value={statistics.total}
          subtitle="Action Scope"
          icon={CheckSquare}
          color="indigo"
        />
        <IQACStatCard
          title="Open Actions"
          value={statistics.open}
          subtitle="Pending Assignment"
          icon={Clock}
          color="blue"
        />
        <IQACStatCard
          title="In Progress"
          value={statistics.inProgress}
          subtitle="Active Progress Tracking"
          icon={Clock}
          color="amber"
        />
        <IQACStatCard
          title="Completed Actions"
          value={statistics.completed}
          subtitle="Verified & Done"
          icon={CheckCircle2}
          color="emerald"
        />
        <IQACStatCard
          title="Overdue Actions"
          value={statistics.overdue}
          subtitle="Past Due Date"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Action Item Table */}
      <ActionItemTable actionItems={actionItems} departments={departments} />

      {/* Create Modal */}
      <CreateActionItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};
