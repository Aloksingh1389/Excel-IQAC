import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, SectionCard, Card } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { ApprovalActionModal, EvidenceViewerModal } from '../../components/approval/ApprovalActionModal';
import { approvalService } from '../../services/approvalService';
import { CheckCircle2, Eye, XCircle, AlertTriangle, Filter, Sparkles } from 'lucide-react';

export const DepartmentApprovals = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PUBLICATION, RESEARCH, FDP, ACHIEVEMENT

  // Modals
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState('APPROVE');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadApprovals();
  }, [user]);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const res = await approvalService.getApprovals({ departmentId: user?.departmentId });
      setApprovals(res.data);
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
        toast.success(`Approved: ${selectedItem.title}`);
      } else if (type === 'REJECT') {
        await approvalService.rejectItem(selectedItem.id, user.name, remarks);
        toast.error(`Rejected submission.`);
      } else if (type === 'CORRECTION') {
        await approvalService.requestCorrection(selectedItem.id, user.name, remarks);
        toast.warning(`Correction request dispatched to submitter.`);
      }
      setIsActionModalOpen(false);
      loadApprovals();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApprovals = activeTab === 'ALL'
    ? approvals
    : approvals.filter((a) => a.type === activeTab);

  const pendingCount = approvals.filter((a) => a.status === 'PENDING').length;

  const columns = [
    {
      key: 'type',
      header: 'Category',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-800 uppercase">
          {val}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Title & Proposal Summary',
      sortable: true,
      render: (val, row) => (
        <div className="max-w-md">
          <div className="font-bold text-slate-900 line-clamp-1">{val}</div>
          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{row.summary}</div>
        </div>
      ),
    },
    {
      key: 'submittedBy',
      header: 'Submitter',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-800">{val}</div>
          <div className="text-[10px] text-slate-400">{row.submitterRole}</div>
        </div>
      ),
    },
    {
      key: 'submissionDate',
      header: 'Submitted On',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'evidence',
      header: 'Evidence',
      render: (_, row) => (
        <button
          onClick={() => handleOpenEvidence(row)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Verification Decision',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          {row.status === 'PENDING' ? (
            <>
              <Button
                variant="success"
                size="xs"
                onClick={() => handleOpenAction(row, 'APPROVE')}
              >
                Approve
              </Button>
              <Button
                variant="warning"
                size="xs"
                onClick={() => handleOpenAction(row, 'CORRECTION')}
              >
                Correction
              </Button>
              <Button
                variant="danger"
                size="xs"
                onClick={() => handleOpenAction(row, 'REJECT')}
              >
                Reject
              </Button>
            </>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">Completed</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Department Approval Queue"
        subtitle={`Verify academic submissions, grants, FDPs and student achievements &bull; ${pendingCount} Pending Decisions`}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {['ALL', 'PUBLICATION', 'RESEARCH', 'FDP', 'ACHIEVEMENT'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'ALL' ? 'All Requests' : tab}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredApprovals}
        loading={loading}
        searchPlaceholder="Search approvals by title, submitter or category..."
        searchKeys={['title', 'submittedBy', 'type', 'summary']}
      />

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
