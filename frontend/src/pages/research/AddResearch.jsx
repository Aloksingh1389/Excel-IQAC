import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, Card } from '../../components/layout/PageContainer';
import { Input, Select, Textarea, FileInput } from '../../components/forms/Input';
import { Button } from '../../components/common/Button';
import { ACADEMIC_YEARS } from '../../config/academicYears';
import { researchService } from '../../services/researchService';
import { FlaskConical, Send, ArrowLeft } from 'lucide-react';

export const AddResearch = () => {
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
      projectTitle: '',
      principalInvestigator: user?.name || '',
      coInvestigators: '',
      fundingAgency: 'DST-SERB',
      scheme: 'Core Research Grant (CRG)',
      amount: '',
      sanctionOrderNumber: '',
      projectType: 'Government Funded',
      startDate: '2026-06-01',
      endDate: '2029-05-31',
      academicYear: '2026 - 2027',
      objectives: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await researchService.createResearch(
        {
          ...data,
          amount: Number(data.amount) || 0,
          evidenceDocument: evidenceFileName || 'Sanction_Order.pdf',
        },
        user
      );

      toast.success('Research grant record submitted for HOD & Dean verification!');
      navigate('/research');
    } catch (err) {
      toast.error('Failed to submit grant proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Add Research Project / Grant"
        subtitle="Log funded projects, consultancy assignments, or seed grants for institutional metrics"
        breadcrumb={[
          { label: 'Research & Grants', path: '/research' },
          { label: 'New Project' },
        ]}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/research')}
          >
            Back to List
          </Button>
        }
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              1. Project Title & Investigators
            </h3>

            <Input
              label="Project Title"
              required
              placeholder="e.g. Design and Development of Next-Generation Quantum Cryptographic Hardware"
              error={errors.projectTitle}
              {...register('projectTitle', { required: 'Project title is required' })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Principal Investigator (PI)"
                required
                error={errors.principalInvestigator}
                {...register('principalInvestigator', { required: 'PI is required' })}
              />

              <Input
                label="Co-Principal Investigators (Co-PI)"
                placeholder="e.g. Dr. Priya Nair, Dr. S. Rao"
                {...register('coInvestigators')}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              2. Funding Agency & Grant Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Funding Agency"
                required
                placeholder="e.g. DST-SERB, ISRO, DRDO, AICTE, Industry"
                error={errors.fundingAgency}
                {...register('fundingAgency', { required: 'Funding agency is required' })}
              />

              <Input
                label="Scheme / Program Name"
                placeholder="e.g. CRG / EMR / TARE / SPARC"
                {...register('scheme')}
              />

              <Select
                label="Funding Category"
                required
                options={[
                  'Government Funded',
                  'Industry Sponsored',
                  'Institutional Seed Grant',
                  'Consultancy',
                ]}
                {...register('projectType')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Total Sanctioned Amount (in ₹ INR)"
                type="number"
                required
                placeholder="e.g. 3500000"
                error={errors.amount}
                {...register('amount', { required: 'Sanction amount is required' })}
              />

              <Input
                label="Sanction Order Number"
                placeholder="e.g. CRG/2026/001429"
                {...register('sanctionOrderNumber')}
              />

              <Select
                label="Academic Assessment Year"
                required
                options={ACADEMIC_YEARS.map((y) => ({ value: y.label, label: y.label }))}
                {...register('academicYear')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                {...register('startDate')}
              />
              <Input
                label="End Date / Completion Date"
                type="date"
                {...register('endDate')}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              3. Sanction Letter / Sanction Order Upload
            </h3>

            <FileInput
              label="Upload Official Sanction Order (PDF)"
              helperText="Upload official sanction letter showing approved budget heads and duration."
              fileName={evidenceFileName}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setEvidenceFileName(e.target.files[0].name);
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Send}
              loading={submitting}
            >
              Submit Project for Verification
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};
