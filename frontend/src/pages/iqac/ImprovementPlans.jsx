import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useImprovementPlans } from '../../hooks/useImprovementPlans';
import { ImprovementPlanTable } from '../../components/quality/ImprovementPlanTable';
import { CreateImprovementPlanModal } from '../../components/quality/CreateImprovementPlanModal';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { Loader } from '../../components/common/Loader';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { Target, AlertTriangle, CheckCircle2, Clock, Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ImprovementPlans = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { plans, statistics, loading, createImprovementPlan } = useImprovementPlans();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading || !statistics) {
    return <Loader message="Loading Quality Improvement Plans & Interventions..." />;
  }

  const handleCreateSubmit = async (payload) => {
    try {
      const res = await createImprovementPlan(payload);
      toast.success(res.message || 'Improvement plan launched.');
    } catch (err) {
      toast.error(err.message || 'Failed to launch plan.');
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
              Quality Improvement Plans & Department Interventions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Strategic corrective action plans for indicators below benchmark & non-compliant departments
          </p>
        </div>

        {user?.role !== ROLES.STAFF && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Improvement Plan</span>
          </button>
        )}
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <IQACStatCard
          title="Total Active Plans"
          value={statistics.total}
          subtitle="Intervention Scope"
          icon={Target}
          color="indigo"
        />
        <IQACStatCard
          title="On Track"
          value={statistics.onTrack}
          subtitle="Meeting Milestones"
          icon={CheckCircle2}
          color="emerald"
        />
        <IQACStatCard
          title="At Risk"
          value={statistics.atRisk}
          subtitle="Requires Monitoring"
          icon={AlertTriangle}
          color="amber"
        />
        <IQACStatCard
          title="Overdue"
          value={statistics.overdue}
          subtitle="Past Target Date"
          icon={Clock}
          color="rose"
        />
        <IQACStatCard
          title="Completed"
          value={statistics.completed}
          subtitle="Target Achieved"
          icon={CheckCircle2}
          color="teal"
        />
      </div>

      {/* Improvement Plan Table Component */}
      <ImprovementPlanTable plans={plans} />

      {/* Create Modal */}
      <CreateImprovementPlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};
