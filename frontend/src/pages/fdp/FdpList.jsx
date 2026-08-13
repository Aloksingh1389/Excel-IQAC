import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Award, PlusCircle, Download, Eye, Calendar, User, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, Card } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Input, Select, FileInput } from '../../components/forms/Input';
import { EvidenceViewerModal } from '../../components/approval/ApprovalActionModal';
import { fdpService } from '../../services/researchService';
import { ACADEMIC_YEARS } from '../../config/academicYears';

export const FdpList = () => {
  const { user, role } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [fdps, setFdps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    loadFdps();
  }, [user]);

  const loadFdps = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (role === 'STAFF') filters.userId = user?.id;
      if (role === 'HOD') filters.departmentId = user?.departmentId;

      const res = await fdpService.getFdps(filters);
      setFdps(res.data);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Program Title & Organizer',
      sortable: true,
      render: (val, row) => (
        <div className="max-w-md">
          <div className="font-bold text-slate-900 line-clamp-1">{val}</div>
          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
            Organized by: {row.organizer}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type & Mode',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800">{val}</span>
          <div className="text-[10px] text-slate-400">{row.mode} &bull; {row.duration}</div>
        </div>
      ),
    },
    {
      key: 'facultyName',
      header: 'Faculty Member',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-800">{val}</span>,
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (_, row) => (
        <span className="text-[11px] text-slate-600">
          {row.startDate} to {row.endDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Approval Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (_, row) => (
        <button
          onClick={() => setPreviewItem(row)}
          title="Preview Certificate"
          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Faculty Development & STTP Programs"
        subtitle="AICTE ATAL, NPTEL, Short-Term Training Programs & Industrial Pedagogical Upskilling"
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/fdp/add')}
          >
            Log FDP Participation
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={fdps}
        loading={loading}
        searchPlaceholder="Search by program title, organizer, or faculty..."
        searchKeys={['title', 'organizer', 'facultyName', 'type']}
      />

      <EvidenceViewerModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        evidenceName={previewItem?.certificateDocument || 'FDP_Certificate.pdf'}
        title={previewItem?.title}
        category={`${previewItem?.type} &bull; ${previewItem?.duration}`}
      />
    </PageContainer>
  );
};

export const AddFdp = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [certificateFileName, setCertificateFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      organizer: 'IIT Madras / AICTE ATAL Academy',
      type: 'Faculty Development Program (FDP)',
      duration: '5 Days',
      startDate: '2026-07-15',
      endDate: '2026-07-19',
      mode: 'Offline / In-Person',
      participationType: 'Participant',
      academicYear: '2026 - 2027',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await fdpService.createFdp(
        {
          ...data,
          certificateDocument: certificateFileName || 'FDP_Certificate.pdf',
        },
        user
      );
      toast.success('FDP certificate submitted for HOD validation!');
      navigate('/fdp');
    } catch (err) {
      toast.error('Failed to log FDP.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Log FDP / STTP Participation"
        subtitle="Upload training proof for annual faculty appraisal and NAAC Criterion 6"
        breadcrumb={[
          { label: 'FDP Records', path: '/fdp' },
          { label: 'Log Program' },
        ]}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/fdp')}
          >
            Back to FDPs
          </Button>
        }
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Program Title"
              required
              placeholder="e.g. AICTE ATAL FDP on Deep Generative AI and Large Language Models"
              error={errors.title}
              {...register('title', { required: 'Program title is required' })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Host / Organizing Institution"
                required
                placeholder="e.g. IIT Bombay / NPTEL / IBM Systems"
                error={errors.organizer}
                {...register('organizer', { required: 'Organizer is required' })}
              />

              <Select
                label="Program Classification"
                required
                options={[
                  'Faculty Development Program (FDP)',
                  'Short Term Training Program (STTP)',
                  'Professional Workshop',
                  'Industrial Training',
                  'Pedagogy & Teaching Orientation',
                ]}
                {...register('type')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Duration (in Days / Weeks)"
                required
                placeholder="e.g. 5 Days"
                {...register('duration')}
              />

              <Select
                label="Delivery Mode"
                options={['Offline / In-Person', 'Online / Virtual', 'Hybrid']}
                {...register('mode')}
              />

              <Select
                label="Participation Role"
                options={['Participant', 'Resource Person / Keynote Speaker', 'Session Chair']}
                {...register('participationType')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Start Date" type="date" {...register('startDate')} />
              <Input label="End Date" type="date" {...register('endDate')} />
              <Select
                label="Academic Assessment Year"
                options={ACADEMIC_YEARS.map((y) => ({ value: y.label, label: y.label }))}
                {...register('academicYear')}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <FileInput
              label="Upload Participation / Completion Certificate (PDF)"
              fileName={certificateFileName}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setCertificateFileName(e.target.files[0].name);
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="submit" variant="primary" size="md" icon={Send} loading={submitting}>
              Submit FDP for Approval
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};
