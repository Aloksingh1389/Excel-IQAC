import React, { useState } from 'react';
import { FileText, Download, Trash2, Eye, Calendar, User, HardDrive } from 'lucide-react';
import { Card } from '../layout/PageContainer';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../overlay/Modal';
import { Input, Select, FileInput } from '../forms/Input';
import { Button } from '../common/Button';

export const DocumentCard = ({ doc, onPreview, onDelete, onDownload }) => {
  const getFileBadge = (type) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return 'bg-rose-100 text-rose-700';
      case 'DOCX':
        return 'bg-blue-100 text-blue-700';
      case 'XLSX':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <Card className="p-4 flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getFileBadge(doc.fileType)}`}>
            {doc.fileType || 'PDF'}
          </span>
          <StatusBadge status={doc.status || 'ACTIVE'} size="xs" />
        </div>

        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-2" title={doc.name}>
          {doc.name}
        </h4>

        <div className="space-y-1 text-[11px] text-slate-500 mb-4">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{doc.uploadedBy}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-slate-400" />
              {doc.uploadDate}
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-slate-400" />
              {doc.fileSize}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {doc.module}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPreview(doc)}
            title="Preview"
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDownload(doc)}
            title="Download"
            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(doc)}
              title="Delete"
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export const DocumentUploadModal = ({ isOpen, onClose, onUpload, academicYears = [] }) => {
  const [name, setName] = useState('');
  const [module, setModule] = useState('Publications');
  const [academicYear, setAcademicYear] = useState('2026 - 2027');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onUpload({
        name,
        fileName: fileName || `${name.replace(/\s+/g, '_')}.pdf`,
        fileSize: '2.4 MB',
        fileType: 'PDF',
        module,
        academicYear,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Institutional Document" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Document Title / Description"
          required
          placeholder="e.g. NBA Tier-1 Self Assessment Report"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Module / Category"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            options={[
              { value: 'Accreditation', label: 'Accreditation (NAAC/NBA)' },
              { value: 'Publications', label: 'Publications Evidence' },
              { value: 'Research', label: 'Research & Grants' },
              { value: 'FDP', label: 'FDP & Training' },
              { value: 'Achievements', label: 'Achievements Evidence' },
              { value: 'Minutes', label: 'Minutes of Meeting' },
              { value: 'Curriculum', label: 'Curriculum & Syllabi' },
            ]}
          />

          <Select
            label="Academic Year"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            options={[
              { value: '2026 - 2027', label: '2026 - 2027' },
              { value: '2025 - 2026', label: '2025 - 2026' },
              { value: '2024 - 2025', label: '2024 - 2025' },
            ]}
          />
        </div>

        <FileInput
          label="Select File"
          required
          fileName={fileName}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFileName(e.target.files[0].name);
              if (!name) setName(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
            }
          }}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={loading}>
            Upload Document
          </Button>
        </div>
      </form>
    </Modal>
  );
};
