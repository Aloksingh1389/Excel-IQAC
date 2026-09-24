import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { X, FileText, Send, Save, Upload } from 'lucide-react';
import { SUBMISSION_TYPES, SUBMISSION_TYPE_LABELS } from '../../config/submissionTypes';
import { useAuth } from '../../context/AuthContext';

export const SubmissionFormModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  editingSubmission = null,
}) => {
  const { user } = useAuth();
  const [type, setType] = useState(SUBMISSION_TYPES.PUBLICATION);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [description, setDescription] = useState('');
  const [journal, setJournal] = useState('');
  const [doi, setDoi] = useState('');
  const [authors, setAuthors] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingSubmission) {
      setType(editingSubmission.type || SUBMISSION_TYPES.PUBLICATION);
      setTitle(editingSubmission.title || '');
      setPriority(editingSubmission.priority || 'NORMAL');
      setDescription(editingSubmission.data?.description || '');
      setJournal(editingSubmission.data?.journal || '');
      setDoi(editingSubmission.data?.doi || '');
      setAuthors(editingSubmission.data?.authors || '');
    } else {
      setType(SUBMISSION_TYPES.PUBLICATION);
      setTitle('');
      setPriority('NORMAL');
      setDescription('');
      setJournal('');
      setDoi('');
      setAuthors('');
    }
  }, [editingSubmission, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (e, isSubmitDirect = true) => {
    e?.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter a submission title.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await onSubmit({
        type,
        title,
        priority,
        isSubmit: isSubmitDirect,
        departmentCode: user?.departmentCode || 'CSE',
        departmentId: user?.departmentId || 'dept_cse',
        departmentName: user?.department || 'Computer Science & Engineering',
        data: {
          description,
          journal,
          doi,
          authors: authors || user?.name,
          publicationYear: new Date().getFullYear(),
        },
        evidenceFiles: [
          { id: `ev_${Date.now()}`, name: `${type.toLowerCase()}_evidence_doc.pdf`, size: '1.5 MB', type: 'PDF' },
        ],
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <Card className="w-full max-w-xl p-6 space-y-5 bg-white shadow-2xl border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingSubmission ? 'Edit & Resubmit Portfolio' : 'Create New IQAC Submission'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Submit academic, research, or department quality metrics into institutional review workflow
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
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={(e) => handleFormSubmit(e, true)} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">
                Submission Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              >
                {Object.keys(SUBMISSION_TYPES).map((key) => (
                  <option key={key} value={key}>
                    {SUBMISSION_TYPE_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="NORMAL">Normal Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent Deadline</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Deep Learning Fault Detection in Microgrid Systems"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
              required
            />
          </div>

          {/* Dynamic Module Fields */}
          {(type === SUBMISSION_TYPES.PUBLICATION || type === SUBMISSION_TYPES.RESEARCH) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Input
                label="Journal / Venue Name"
                placeholder="e.g. IEEE Transactions on Smart Grid"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
              />
              <Input
                label="DOI / Sanction Number"
                placeholder="e.g. 10.1109/TSG.2026.30129"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Authors / Investigators"
                  placeholder="e.g. Dr. Rajesh Kumar, Prof. Ananya Gupta"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Description & Supporting Details
            </label>
            <textarea
              rows={3}
              placeholder="Provide context, abstract, or supporting evidence notes for reviewer..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Dummy Evidence Upload */}
          <div className="p-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 text-center space-y-1">
            <Upload className="w-4 h-4 text-indigo-600 mx-auto" />
            <p className="font-bold text-slate-800">Attach Evidence Document (PDF / Scanned Proof)</p>
            <p className="text-[10px] text-slate-400">Mock evidence PDF will be attached automatically upon submit.</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={(e) => handleFormSubmit(e, false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save as Draft</span>
            </button>
            <Button type="submit" variant="primary" size="md" loading={loading} icon={Send}>
              Submit for Review
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
