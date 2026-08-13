import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FlaskConical, 
  PlusCircle, 
  Download, 
  Eye, 
  Trash2, 
  DollarSign, 
  FileText,
  Building 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { EvidenceViewerModal } from '../../components/approval/ApprovalActionModal';
import { researchService } from '../../services/researchService';

export const ResearchList = () => {
  const { user, role } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    loadResearch();
  }, [user, typeFilter]);

  const loadResearch = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (role === 'STAFF') filters.userId = user?.id;
      if (role === 'HOD') filters.departmentId = user?.departmentId;

      const res = await researchService.getResearch(filters);
      let list = res.data;
      if (typeFilter) {
        list = list.filter((r) => r.projectType === typeFilter);
      }
      setResearchList(list);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'projectTitle',
      header: 'Project Title & Scheme',
      sortable: true,
      render: (val, row) => (
        <div className="max-w-md">
          <div className="font-bold text-slate-900 line-clamp-1">{val}</div>
          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
            PI: {row.principalInvestigator} &bull; {row.scheme || 'Sponsored Project'}
          </div>
        </div>
      ),
    },
    {
      key: 'fundingAgency',
      header: 'Funding Agency',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-800">{val}</div>
          <div className="text-[10px] text-slate-400 font-mono">Sanction: {row.sanctionOrderNumber || 'SAN-2026/09'}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Grant Amount',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-indigo-700">
          ₹{(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (val, row) => (
        <div className="text-[11px] text-slate-600">
          {val || '3 Years'} ({row.startDate ? row.startDate.slice(0, 4) : '2026'} - {row.endDate ? row.endDate.slice(0, 4) : '2029'})
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Project Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setPreviewItem(row)}
            title="Preview Sanction Order"
            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Sponsored Research & Grants"
        subtitle="Government, industrial, international funding agency projects and seed money grants"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={() => toast.success('Exporting Research Projects to Excel...')}
            >
              Export Excel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
              onClick={() => navigate('/research/add')}
            >
              Add Grant Proposal
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={researchList}
        loading={loading}
        searchPlaceholder="Search by title, agency, PI or sanction number..."
        searchKeys={['projectTitle', 'fundingAgency', 'principalInvestigator', 'sanctionOrderNumber']}
        filters={
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
          >
            <option value="">All Funding Types</option>
            <option value="Government Funded">Government Funded (DST/DBT/AICTE)</option>
            <option value="Industry Sponsored">Industry Sponsored</option>
            <option value="Institutional Seed Grant">Institutional Seed Grant</option>
            <option value="Consultancy">Consultancy Project</option>
          </select>
        }
      />

      <EvidenceViewerModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        evidenceName={previewItem?.evidenceDocument || 'Sanction_Order.pdf'}
        title={previewItem?.projectTitle}
        category={`Grant Amount: ₹${(previewItem?.amount || 0).toLocaleString()}`}
      />
    </PageContainer>
  );
};
