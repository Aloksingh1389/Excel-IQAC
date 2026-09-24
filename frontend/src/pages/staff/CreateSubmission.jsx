import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { STAFF_SUBMISSION_TYPES } from '../../config/staffPortalConfig';
import { submissionService } from '../../services/submissionService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ArrowLeft, FileText, CheckCircle2, ChevronRight, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const STEPS = ['Select Type', 'Fill Details', 'Attach Evidence', 'Review & Submit'];

export const CreateSubmission = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});
  const [evidenceNote, setEvidenceNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleTypeSelect = (typeKey) => {
    setSelectedType(typeKey);
    setFormData({});
    setStep(1);
  };

  const handleFieldChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveDraft = async () => {
    if (!selectedType) return;
    setSaving(true);
    try {
      await submissionService.createSubmission({
        type: selectedType,
        title: formData.title || `${STAFF_SUBMISSION_TYPES[selectedType].label} Submission`,
        ...formData,
        status: 'DRAFT',
        academicYear: '2025-26',
      }, user);
      toast.success('Draft saved successfully.');
      navigate('/staff/submissions');
    } catch (err) {
      toast.error('Failed to save draft.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    setSubmitting(true);
    try {
      await submissionService.createSubmission({
        type: selectedType,
        title: formData.title || `${STAFF_SUBMISSION_TYPES[selectedType].label} Submission`,
        ...formData,
        status: 'SUBMITTED',
        academicYear: '2025-26',
        evidenceNote,
      }, user);
      toast.success('Submission created and sent for review.');
      navigate('/staff/submissions');
    } catch (err) {
      toast.error('Failed to submit.');
    } finally {
      setSubmitting(false);
    }
  };

  const config = selectedType ? STAFF_SUBMISSION_TYPES[selectedType] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
        <Link to="/staff/submissions" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Create New Submission</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-1 ${i <= step ? 'text-indigo-700' : 'text-slate-300'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${
                i < step ? 'bg-indigo-600 border-indigo-600 text-white' :
                i === step ? 'border-indigo-600 text-indigo-600' : 'border-slate-200 text-slate-300'
              }`}>{i < step ? '✓' : i + 1}</span>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      <Card className="p-6 space-y-5 bg-white border-slate-200">
        {/* Step 0: Type Selection */}
        {step === 0 && (
          <div className="space-y-3 text-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">Select Submission Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(STAFF_SUBMISSION_TYPES).map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeSelect(type.id)}
                  className="p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left font-bold text-slate-800 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{type.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-normal">Required evidence: {type.requiredEvidenceTypes.join(', ')}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Form Fields */}
        {step === 1 && config && (
          <div className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">{config.label} — Data Entry Form</h2>
            {config.fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleFieldChange}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleFieldChange}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none"
                    required={field.required}
                  />
                )}
              </div>
            ))}
            <div className="flex justify-between pt-3">
              <Button type="button" variant="secondary" size="md" onClick={() => setStep(0)}>Back</Button>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="md" onClick={handleSaveDraft} loading={saving} icon={Save}>Save Draft</Button>
                <Button type="button" variant="primary" size="md" onClick={() => setStep(2)}>Next: Attach Evidence</Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Evidence */}
        {step === 2 && config && (
          <div className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">Attach Supporting Evidence</h2>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
              <p className="font-bold">Frontend Prototype: File Upload Demo Mode</p>
              <p className="text-[11px] mt-1">Required evidence types: <strong>{config.requiredEvidenceTypes.join(', ')}</strong></p>
              <p className="text-[11px] mt-1">In the production system, file upload will be handled via the Evidence Repository (Stage 5D). Please describe the evidence you are attaching.</p>
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Evidence Description / File Reference</label>
              <textarea
                rows={3}
                value={evidenceNote}
                onChange={(e) => setEvidenceNote(e.target.value)}
                placeholder="Describe the evidence attached (e.g., Scopus DOI proof PDF, FDP Certificate from organizer)"
                className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none"
              />
            </div>
            <div className="flex justify-between pt-3">
              <Button type="button" variant="secondary" size="md" onClick={() => setStep(1)}>Back</Button>
              <Button type="button" variant="primary" size="md" onClick={() => setStep(3)}>Next: Review</Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && config && (
          <div className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">Review & Submit</h2>
            <div className="p-4 rounded-xl bg-slate-50 border space-y-2">
              <p className="font-bold text-slate-700">Submission Type: <span className="text-indigo-900">{config.label}</span></p>
              {Object.entries(formData).map(([key, val]) => (
                <p key={key} className="text-slate-600"><span className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {val}</p>
              ))}
              {evidenceNote && <p className="text-slate-600"><span className="font-bold">Evidence:</span> {evidenceNote}</p>}
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-[11px] font-semibold">
              Submission will be routed to your HOD / IQAC Coordinator for initial review and then to IQAC for final verification.
            </div>
            <div className="flex justify-between pt-3">
              <Button type="button" variant="secondary" size="md" onClick={() => setStep(2)}>Back</Button>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="md" onClick={handleSaveDraft} loading={saving} icon={Save}>Save Draft</Button>
                <Button type="button" variant="primary" size="md" onClick={handleSubmit} loading={submitting} icon={CheckCircle2}>Submit for Review</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
