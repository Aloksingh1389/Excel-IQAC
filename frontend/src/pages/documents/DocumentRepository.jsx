import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { DocumentCard, DocumentUploadModal } from '../../components/documents/DocumentCard';
import { EvidenceViewerModal } from '../../components/approval/ApprovalActionModal';
import { ConfirmModal } from '../../components/overlay/ConfirmModal';
import { Button } from '../../components/common/Button';
import { documentService } from '../../services/documentService';
import { ACADEMIC_YEARS } from '../../config/academicYears';
import { PlusCircle, Search, Filter } from 'lucide-react';

export const DocumentRepository = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [moduleFilter, yearFilter]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (moduleFilter) filters.module = moduleFilter;
      if (yearFilter) filters.academicYear = yearFilter;
      const res = await documentService.getDocuments(filters);
      setDocuments(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (docData) => {
    try {
      await documentService.uploadDocument(docData, user);
      toast.success('Document uploaded to institutional repository!');
      loadDocuments();
    } catch (err) {
      toast.error('Upload failed.');
    }
  };

  const handleDelete = async () => {
    if (!deleteDoc) return;
    setDeleteLoading(true);
    try {
      await documentService.deleteDocument(deleteDoc.id);
      toast.success('Document deleted.');
      setDeleteDoc(null);
      loadDocuments();
    } catch (err) {
      toast.error('Failed to delete document.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <PageHeader
        title="Central Document Repository & Dossiers"
        subtitle="Institutional proof documents, accreditation dossiers, meeting minutes, and statutory compliance files"
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setIsUploadOpen(true)}
          >
            Upload Document
          </Button>
        }
      />

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by title, author, module..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Accreditation">Accreditation (NAAC/NBA)</option>
            <option value="Publications">Publications</option>
            <option value="Research">Research & Grants</option>
            <option value="FDP">FDP & STTP</option>
            <option value="Minutes">Minutes of Meeting</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="">All Academic Years</option>
            {ACADEMIC_YEARS.map((y) => (
              <option key={y.id} value={y.label}>
                {y.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading documents...</div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          No documents found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onPreview={(d) => setPreviewDoc(d)}
              onDownload={(d) => toast.success(`Downloading ${d.name}...`)}
              onDelete={(d) => setDeleteDoc(d)}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />

      {/* Preview Modal */}
      <EvidenceViewerModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        evidenceName={previewDoc?.fileName || previewDoc?.name}
        title={previewDoc?.name}
        category={previewDoc?.module}
      />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteDoc}
        onClose={() => setDeleteDoc(null)}
        onConfirm={handleDelete}
        title="Delete Document?"
        message={`Are you sure you want to permanently remove "${deleteDoc?.name}" from institutional records?`}
        confirmText="Delete Document"
        variant="danger"
        loading={deleteLoading}
      />
    </PageContainer>
  );
};
