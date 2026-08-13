import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  FlaskConical, 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  ArrowRight,
  TrendingUp 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, SectionCard, Card } from '../../components/layout/PageContainer';
import { StatCard } from '../../components/dashboard/StatCard';
import { BarChartWidget } from '../../components/charts/BarChartWidget';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { ApprovalActionModal, EvidenceViewerModal } from '../../components/approval/ApprovalActionModal';
import { approvalService } from '../../services/approvalService';
import { facultyService } from '../../services/departmentService';
import { publicationService } from '../../services/publicationService';
import { researchService } from '../../services/researchService';

export const HodDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [approvals, setApprovals] = useState([]);
  const [facultyCount, setFacultyCount] = useState(28);
  const [publicationsCount, setPublicationsCount] = useState(46);
  const [researchTotal, setResearchTotal] = useState('₹1.42 Cr');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState('APPROVE');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadHodData();
  }, [user]);

  const loadHodData = async () => {
    try {
      const [apprRes, facRes, pubRes, resRes] = await Promise.all([
        approvalService.getApprovals({ approvalLevel: 'HOD' }),
        facultyService.getFaculty(user?.departmentId || 'dept_cse'),
        publicationService.getPublications({ departmentId: user?.departmentId || 'dept_cse' }),
        researchService.getResearch({ departmentId: user?.departmentId || 'dept_cse' }),
      ]);
      setApprovals(apprRes.data);
      if (facRes.data.length > 0) setFacultyCount(facRes.data.length);
      if (pubRes.data.length > 0) setPublicationsCount(pubRes.data.length);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAction = (item, type) => {
    setSelectedItem(item);
    setActionType(type);
    setIsActionModalOpen(true);
  };

  const handleOpenEvidence = (item) => {
    setSelectedItem(item);
    setIsEvidenceModalOpen(true);
  };

  const handleConfirmAction = async (type, remarks) => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      if (type === 'APPROVE') {
        await approvalService.approveItem(selectedItem.id, user.name, remarks);
        toast.success(`Submission approved successfully.`);
      } else if (type === 'REJECT') {
        await approvalService.rejectItem(selectedItem.id, user.name, remarks);
        toast.error(`Submission rejected.`);
      } else if (type === 'CORRECTION') {
        await approvalService.requestCorrection(selectedItem.id, user.name, remarks);
        toast.warning(`Correction request dispatched to submitter.`);
      }
      setIsActionModalOpen(false);
      loadHodData();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');

  const chartData = [
    { name: 'SCI / Scopus', papers: 24, target: 30 },
    { name: 'UGC-CARE', papers: 14, target: 15 },
    { name: 'Conf. (IEEE)', papers: 18, target: 20 },
    { name: 'Book Chapters', papers: 8, target: 10 },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={`HOD Dashboard &bull; ${user?.departmentName || 'Computer Science & Engineering'}`}
        subtitle={`Departmental verification, quality oversight, faculty progress & approval workflow`}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/hod/approvals')}
          >
            Review All Approvals ({pendingApprovals.length})
          </Button>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Department Faculty"
          value={facultyCount}
          subtitle="24 Doctorates (85.7%)"
          icon={Users}
          iconBg="bg-blue-50 text-blue-600"
          onClick={() => navigate('/hod/faculty')}
          trend={{ value: '+3 New', isPositive: true, label: 'joined this AY' }}
        />
        <StatCard
          title="Total Students (CSE)"
          value="742"
          subtitle="UG (620) + PG (122)"
          icon={GraduationCap}
          iconBg="bg-emerald-50 text-emerald-600"
          trend={{ value: '98.4%', isPositive: true, label: 'pass percentage' }}
        />
        <StatCard
          title="Dept Publications"
          value={publicationsCount}
          subtitle="Indexed in Scopus / SCI"
          icon={BookOpen}
          iconBg="bg-purple-50 text-purple-600"
          onClick={() => navigate('/publications')}
          trend={{ value: '+18.2%', isPositive: true, label: 'YoY growth' }}
        />
        <StatCard
          title="Research Grants"
          value={researchTotal}
          subtitle="6 Ongoing Projects"
          icon={FlaskConical}
          iconBg="bg-amber-50 text-amber-600"
          onClick={() => navigate('/research')}
          trend={{ value: '₹45L', isPositive: true, label: 'new DST grant' }}
        />
      </div>

      {/* Primary Section: Department Pending Approvals Queue */}
      <SectionCard
        title={`Pending Department Approvals (${pendingApprovals.length})`}
        subtitle="Review, verify attached proof documents, and grant departmental recommendation"
        actions={
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate('/hod/approvals')}
          >
            Go to Approval Center <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        }
      >
        {pendingApprovals.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">All submissions cleared!</h4>
            <p className="text-xs text-slate-500 mt-1">There are currently no pending departmental verification requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Submitted By</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Evidence</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingApprovals.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate" title={item.title}>
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{item.category}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{item.submittedBy}</div>
                      <div className="text-[10px] text-slate-400">{item.submitterRole}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{item.submissionDate}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleOpenEvidence(item)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Button
                          variant="success"
                          size="xs"
                          onClick={() => handleOpenAction(item, 'APPROVE')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="warning"
                          size="xs"
                          onClick={() => handleOpenAction(item, 'CORRECTION')}
                        >
                          Correction
                        </Button>
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => handleOpenAction(item, 'REJECT')}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Two Column Layout: Department Publications Chart & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Department Publications Distribution"
          subtitle="Indexed papers vs Annual Quality Targets (AY 2026-27)"
        >
          <BarChartWidget
            data={chartData}
            xAxisKey="name"
            dataKeys={[
              { key: 'papers', name: 'Published', color: '#2563eb' },
              { key: 'target', name: 'IQAC Target', color: '#cbd5e1' },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Recent Department Achievements"
          subtitle="Honors, Hackathons & Professional Certifications"
          actions={
            <Button
              variant="ghost"
              size="xs"
              onClick={() => navigate('/achievements')}
            >
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          }
        >
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="text-xs font-bold text-slate-900">1st Prize - Smart India Hackathon</h5>
                  <span className="text-[10px] text-slate-400">National Level</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Student Team "CyberForge" won ₹1,00,000 cash prize for AI Healthcare triage solution.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-lg shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="text-xs font-bold text-slate-900">Best Research Paper Award</h5>
                  <span className="text-[10px] text-slate-400">IEEE ICC 2026</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Dr. Rajesh Kumar received outstanding author citation in Cloud Distributed Computing.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Action Modals */}
      <ApprovalActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        approvalItem={selectedItem}
        actionType={actionType}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
      />

      <EvidenceViewerModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        evidenceName={selectedItem?.evidenceName}
        title={selectedItem?.title}
        category={selectedItem?.category}
      />
    </PageContainer>
  );
};
