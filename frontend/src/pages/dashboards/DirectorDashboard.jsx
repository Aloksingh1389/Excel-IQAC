import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Award, 
  Users, 
  GraduationCap, 
  FlaskConical, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  UserCheck, 
  Send, 
  Sparkles,
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, SectionCard, Card } from '../../components/layout/PageContainer';
import { StatCard } from '../../components/dashboard/StatCard';
import { BarChartWidget } from '../../components/charts/BarChartWidget';
import { Button } from '../../components/common/Button';
import { ConfirmModal } from '../../components/overlay/ConfirmModal';

export const DirectorDashboard = () => {
  const { user, subType } = useAuth();
  const { canManageIqacHead } = usePermissions();
  const toast = useToast();
  const navigate = useNavigate();

  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [isAqarModalOpen, setIsAqarModalOpen] = useState(false);
  const [isIqacModalOpen, setIsIqacModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deptComparison = [
    { name: 'CSE', research: 142, publications: 46, placements: 94 },
    { name: 'ECE', research: 110, publications: 38, placements: 91 },
    { name: 'Mech', research: 85, publications: 24, placements: 82 },
    { name: 'EEE', research: 92, publications: 29, placements: 86 },
    { name: 'Civil', research: 48, publications: 16, placements: 78 },
    { name: 'IT', research: 98, publications: 34, placements: 92 },
  ];

  const handleFreezeData = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsFreezeModalOpen(false);
      toast.success('Academic Year 2026-27 data locked for statutory NAAC audit.');
    }, 600);
  };

  const handleApproveAqar = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsAqarModalOpen(false);
      toast.success('AQAR 2026-27 formally signed & approved for NAAC submission.');
    }, 600);
  };

  const handleAppointIqacHead = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsIqacModalOpen(false);
      toast.success('IQAC Coordinator commission updated in institutional registry.');
    }, 600);
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Directorate Executive Governance Portal`}
        subtitle={`${user?.name} &bull; ${subType || 'Academic & Institutional Affairs'} Directorate`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/reports/generate')}
            >
              Institutional Master Report
            </Button>
          </div>
        }
      />

      {/* Top Directorate Governance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="NIRF Forecast"
          value="Rank 78"
          subtitle="Top 100 Engineering"
          icon={Award}
          iconBg="bg-blue-50 text-blue-600"
          trend={{ value: '+12 Ranks', isPositive: true, label: 'vs last cycle' }}
        />
        <StatCard
          title="Total Students"
          value="3,840"
          subtitle="6 Engineering Depts"
          icon={GraduationCap}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Faculty Strength"
          value="184"
          subtitle="144 Doctorates (78.2%)"
          icon={Users}
          iconBg="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Research Grants"
          value="₹7.85 Cr"
          subtitle="Sponsored Grants Pool"
          icon={FlaskConical}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Placement Index"
          value="89.4%"
          subtitle="Avg Package ₹8.65 LPA"
          icon={TrendingUp}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Special Executive Power Banner (MANAGE_IQAC_HEAD & Statutory NAAC Controls) */}
      {canManageIqacHead() && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-800/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight">
                  Academic Director Statutory Governance Panel
                </h3>
                <p className="text-xs text-indigo-200">
                  Authorized permissions: <code className="bg-indigo-950 px-1.5 py-0.5 rounded text-indigo-300 font-mono">MANAGE_IQAC_HEAD</code> &bull; <code className="bg-indigo-950 px-1.5 py-0.5 rounded text-indigo-300 font-mono">FREEZE_ACADEMIC_YEAR</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => setIsIqacModalOpen(true)}
              >
                <UserCheck className="w-4 h-4 mr-1.5" />
                Appoint / Manage IQAC Head
              </Button>
              <Button
                variant="warning"
                size="sm"
                onClick={() => setIsFreezeModalOpen(true)}
              >
                <Lock className="w-4 h-4 mr-1.5" />
                Freeze Academic Year Data
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => setIsAqarModalOpen(true)}
              >
                <Send className="w-4 h-4 mr-1.5" />
                Approve & Sign AQAR 2026-27
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cross-Department Comparison Chart & Audit Compliance Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionCard
            title="Institutional Department Benchmarking"
            subtitle="Comparing research funds (₹ Lakhs), publications count, and placement percentage"
          >
            <BarChartWidget
              data={deptComparison}
              xAxisKey="name"
              dataKeys={[
                { key: 'research', name: 'Grants Mobilized (₹L)', color: '#6366f1' },
                { key: 'publications', name: 'Indexed Papers', color: '#3b82f6' },
                { key: 'placements', name: 'Placements (%)', color: '#10b981' },
              ]}
            />
          </SectionCard>
        </div>

        <div>
          <SectionCard
            title="Statutory Compliance Index"
            subtitle="Accreditation bodies status"
          >
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>NAAC Cycle-3 Accreditation</span>
                  <span className="text-emerald-600">Grade A++ (3.64)</span>
                </div>
                <p className="text-slate-500">Self Study Report (SSR) validated</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>NBA Tier-1 Compliance</span>
                  <span className="text-blue-600">5 Depts Accredited</span>
                </div>
                <p className="text-slate-500">Valid through June 2029</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>AICTE Annual Approval</span>
                  <span className="text-emerald-600">Compliant</span>
                </div>
                <p className="text-slate-500">Faculty-Student ratio verified (1:14.2)</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Confirmation Modals for Director Actions */}
      <ConfirmModal
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        onConfirm={handleFreezeData}
        title="Freeze Academic Year 2026-27 Data?"
        message="Freezing will lock all departmental publications, faculty records, and student grades from further edits by Staff or HODs. This is required for official external audit."
        confirmText="Confirm Lock"
        variant="warning"
        loading={loading}
      />

      <ConfirmModal
        isOpen={isAqarModalOpen}
        onClose={() => setIsAqarModalOpen(false)}
        onConfirm={handleApproveAqar}
        title="Formally Sign & Approve AQAR 2026-27?"
        message="This applies digital institutional seal and dispatches the compiled AQAR dossier to the National Assessment and Accreditation Council (NAAC) portal."
        confirmText="Sign & Dispatch"
        variant="primary"
        loading={loading}
      />

      <ConfirmModal
        isOpen={isIqacModalOpen}
        onClose={() => setIsIqacModalOpen(false)}
        onConfirm={handleAppointIqacHead}
        title="Manage IQAC Coordinator Designation"
        message="Re-authorize Dr. M. S. Swaminathan as Chief Institutional Quality Assurance Coordinator for Academic Cycle 2026-2029."
        confirmText="Re-Authorize"
        variant="primary"
        loading={loading}
      />
    </PageContainer>
  );
};
