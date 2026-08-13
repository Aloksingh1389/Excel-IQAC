import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, Card } from '../../components/layout/PageContainer';
import { Input, Select, Textarea, FileInput } from '../../components/forms/Input';
import { Button } from '../../components/common/Button';
import { ACADEMIC_YEARS } from '../../config/academicYears';
import { publicationService } from '../../services/publicationService';
import { BookOpen, FileCheck, Save, Send, ArrowLeft } from 'lucide-react';

export const AddPublication = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [evidenceFileName, setEvidenceFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      authors: user?.name || '',
      publicationType: 'Journal',
      journal: '',
      volumeIssue: '',
      publicationYear: '2026',
      issn: '',
      doi: '',
      indexing: 'Scopus',
      impactFactor: '',
      academicYear: '2026 - 2027',
      abstract: '',
    },
  });

  const onSubmit = async (data, isDraft = false) => {
    setSubmitting(true);
    try {
      await publicationService.createPublication(
        {
          ...data,
          status: isDraft ? 'DRAFT' : 'SUBMITTED',
          evidenceDocument: evidenceFileName || 'Publication_Manuscript.pdf',
        },
        user
      );

      toast.success(
        isDraft
          ? 'Publication saved as draft.'
          : 'Publication submitted to HOD for institutional verification!'
      );
      navigate('/publications');
    } catch (err) {
      toast.error(err.message || 'Failed to submit publication.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Add Research Publication"
        subtitle="Submit academic paper or conference proceeding for IQAC validation"
        breadcrumb={[
          { label: 'Publications', path: '/publications' },
          { label: 'Add New' },
        ]}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/publications')}
          >
            Back to List
          </Button>
        }
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
          {/* Section 1: Paper Core Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              1. Publication Metadata
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Paper / Article Title"
                required
                placeholder="e.g. Deep Learning Approaches for Quantum Key Distribution"
                error={errors.title}
                {...register('title', { required: 'Paper title is required' })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Authors (in published sequence)"
                required
                placeholder="e.g. Dr. Rajesh Kumar, Dr. Anita Desai, John Doe"
                error={errors.authors}
                {...register('authors', { required: 'Authors list is required' })}
              />

              <Select
                label="Publication Type"
                required
                options={[
                  'Journal',
                  'Conference Proceeding',
                  'Book Chapter',
                  'Authored Book',
                  'Monograph',
                ]}
                {...register('publicationType')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Journal / Conference Name"
                required
                placeholder="e.g. IEEE Transactions on Cloud Computing"
                error={errors.journal}
                {...register('journal', { required: 'Journal name is required' })}
              />

              <Input
                label="Volume & Issue / Page Range"
                placeholder="e.g. Vol. 14, Issue 2, pp. 120-135"
                {...register('volumeIssue')}
              />

              <Input
                label="Publication Year"
                type="number"
                required
                {...register('publicationYear', { required: 'Year is required' })}
              />
            </div>
          </div>

          {/* Section 2: Indexing & Impact Metrics */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              2. Indexing & Statutory Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Select
                label="Indexing Agency"
                required
                options={['SCI', 'SCIE', 'Scopus', 'Web of Science', 'UGC-CARE', 'IEEE Xplore', 'Peer-Reviewed']}
                {...register('indexing')}
              />

              <Input
                label="Impact Factor (Clarivate / JCR)"
                placeholder="e.g. 4.82"
                {...register('impactFactor')}
              />

              <Input
                label="ISSN / ISBN Number"
                placeholder="e.g. 2168-7161"
                {...register('issn')}
              />

              <Input
                label="DOI / Web Link"
                placeholder="e.g. 10.1109/TCC.2026.12345"
                {...register('doi')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Academic Assessment Year"
                required
                options={ACADEMIC_YEARS.map((y) => ({ value: y.label, label: y.label }))}
                {...register('academicYear')}
              />
            </div>

            <Textarea
              label="Abstract / Paper Executive Summary"
              rows={3}
              placeholder="Briefly state the research objectives, methodology, and key contributions..."
              {...register('abstract')}
            />
          </div>

          {/* Section 3: Evidence Upload */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              3. Evidence & Proof Document
            </h3>

            <FileInput
              label="Upload Published Paper / Acceptance Letter (PDF)"
              helperText="Upload first page showing authors, journal name, ISSN & DOI. Max size 10MB."
              fileName={evidenceFileName}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setEvidenceFileName(e.target.files[0].name);
                }
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <Button
              variant="secondary"
              size="md"
              icon={Save}
              disabled={submitting}
              onClick={handleSubmit((data) => onSubmit(data, true))}
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Send}
              loading={submitting}
            >
              Submit for HOD Approval
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};
