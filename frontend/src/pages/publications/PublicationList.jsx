import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  PlusCircle, 
  Download, 
  Filter, 
  Eye, 
  Trash2, 
  Edit3, 
  FileText, 
  ExternalLink,
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/forms/Input';
import { EvidenceViewerModal } from '../../components/approval/ApprovalActionModal';
import { ConfirmModal } from '../../components/overlay/ConfirmModal';
import { publicationService } from '../../services/publicationService';
import { ACADEMIC_YEARS } from '../../config/academicYears';

export const PublicationList = () => {
  const { user, role } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [indexingFilter, setIndexingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Modals
  const [previewItem, setPreviewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadPublications();
  }, [user, indexingFilter, statusFilter, yearFilter]);

  const loadPublications = async () => {
    setLoading(true);
    try {
      // If staff, filter by current user id; if HOD/IQAC/Dean, load all or department
      const filters = {};
      if (role === 'STAFF') {
        filters.userId = user?.id;
      } else if (role === 'HOD') {
        filters.departmentId = user?.departmentId;
      }
      if (statusFilter) filters.status = statusFilter;
      if (yearFilter) filters.academicYear = yearFilter;

      const res = await publicationService.getPublications(filters);
      let list = res.data;
      if (indexingFilter) {
        list = list.filter((p) => p.indexing === indexingFilter);
      }
      setPublications(list);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleteLoading(true);
    try {
      await publicationService.deletePublication(deleteItem.id);
      toast.success('Publication record removed.');
      setDeleteItem(null);
      loadPublications();
    } catch (err) {
      toast.error('Failed to delete publication.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportCSV = () => {
    toast.success('Exporting Publications to CSV formatted for NAAC Criterion 3...');
  };

  const columns = [
    {
      key: 'title',
      header: 'Paper Title & Authors',
      sortable: true,
      render: (val, row) => (
        <div className="max-w-md">
          <div className="font-bold text-slate-900 line-clamp-1">{val}</div>
          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{row.authors}</div>
        </div>
      ),
    },
    {
      key: 'journal',
      header: 'Journal / Conf.',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-800 line-clamp-1">{val}</div>
          <div className="text-[10px] text-slate-400">
            {row.volumeIssue ? `${row.volumeIssue} • ` : ''}
            {row.publicationYear}
          </div>
        </div>
      ),
    },
    {
      key: 'indexing',
      header: 'Indexing',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-800 border border-slate-200">
          {val || 'Peer-Reviewed'}
        </span>
      ),
    },
    {
      key: 'academicYear',
      header: 'Academic Year',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
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
            title="Preview Evidence"
            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {row.doi && (
            <a
              href={`https://doi.org/${row.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open DOI Link"
              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {row.userId === user?.id && (
            <button
              onClick={() => setDeleteItem(row)}
              title="Delete"
              className="p-1 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Faculty Research Publications"
        subtitle="Manage peer-reviewed articles, journal publications, conference papers, and book chapters"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
              onClick={() => navigate('/publications/add')}
            >
              Add Publication
            </Button>
          </div>
        }
      />

      {/* Filter Row & Table */}
      <DataTable
        columns={columns}
        data={publications}
        loading={loading}
        searchPlaceholder="Search papers by title, author, journal, or indexing..."
        searchKeys={['title', 'authors', 'journal', 'indexing', 'doi']}
        filters={
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={indexingFilter}
              onChange={(e) => setIndexingFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Indexing</option>
              <option value="SCI">SCI / SCIE</option>
              <option value="Scopus">Scopus</option>
              <option value="UGC-CARE">UGC-CARE</option>
              <option value="IEEE Xplore">IEEE Xplore</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="DRAFT">Draft</option>
              <option value="CORRECTION_REQUIRED">Correction Required</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Academic Years</option>
              {ACADEMIC_YEARS.map((y) => (
                <option key={y.id} value={y.label}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Evidence Preview Modal */}
      <EvidenceViewerModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        evidenceName={previewItem?.evidenceDocument || 'Publication_Proof.pdf'}
        title={previewItem?.title}
        category={`${previewItem?.publicationType} &bull; ${previewItem?.indexing}`}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Publication Record?"
        message={`Are you sure you want to permanently remove "${deleteItem?.title}"?`}
        confirmText="Delete Record"
        variant="danger"
        loading={deleteLoading}
      />
    </PageContainer>
  );
};
