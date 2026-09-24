import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import { EVIDENCE_TYPES, EVIDENCE_TYPE_LABELS, MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES } from '../../config/evidenceConfig';
import { useAuth } from '../../context/AuthContext';

export const EvidenceUploadFormModal = ({
  isOpen = false,
  onClose,
  onUpload,
  preselectedSubmissionId = null,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState(EVIDENCE_TYPES.PUBLICATION_PROOF);
  const [description, setDescription] = useState('');
  const [submissionId, setSubmissionId] = useState(preselectedSubmissionId || '');
  const [mockFileName, setMockFileName] = useState('evidence_document_proof.pdf');
  const [mockFileSizeMB, setMockFileSizeMB] = useState(2.5);
  const [fileType, setFileType] = useState('PDF');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter an evidence document title.');
      return;
    }
    if (!ALLOWED_FILE_TYPES.includes(fileType.toUpperCase())) {
      setErrorMessage(`Invalid file type '${fileType}'. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}.`);
      return;
    }
    if (mockFileSizeMB > MAX_FILE_SIZE_MB) {
      setErrorMessage(`File size (${mockFileSizeMB} MB) exceeds maximum allowed limit of ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await onUpload({
        title,
        evidenceType,
        description,
        submissionId: submissionId || preselectedSubmissionId || null,
        fileName: mockFileName,
        fileType: fileType.toUpperCase(),
        fileSizeMB: mockFileSizeMB,
        academicYear: '2026-27',
        departmentCode: user?.departmentCode || 'CSE',
        departmentId: user?.departmentId || 'dept_cse',
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to upload evidence metadata.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <Card className="w-full max-w-lg p-6 space-y-5 bg-white shadow-2xl border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Upload Supporting Evidence Document
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Attach document proof to institutional records or quality submissions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Evidence Document Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            >
              {Object.keys(EVIDENCE_TYPES).map((key) => (
                <option key={key} value={key}>
                  {EVIDENCE_TYPE_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Scopus Publication Indexing Certificate Page 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
              required
            />
          </div>

          <Input
            label="Related Submission ID (Optional)"
            placeholder="e.g. SUB-2026-00101"
            value={submissionId}
            onChange={(e) => setSubmissionId(e.target.value)}
          />

          {/* Prototype File Selector */}
          <div className="p-3.5 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                Simulated Upload File
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Max Limit: {MAX_FILE_SIZE_MB} MB</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Mock File Name"
                value={mockFileName}
                onChange={(e) => setMockFileName(e.target.value)}
              />
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">File Type</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none font-semibold"
                >
                  {ALLOWED_FILE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Description & Remarks</label>
            <textarea
              rows={2}
              placeholder="Provide verification notes or document details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading} icon={Upload}>
              Upload Evidence
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
