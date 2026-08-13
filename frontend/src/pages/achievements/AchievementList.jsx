import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Trophy, Award, PlusCircle, Download, Eye, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, Card } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Input, Select, FileInput } from '../../components/forms/Input';
import { EvidenceViewerModal } from '../../components/approval/ApprovalActionModal';
import { achievementService } from '../../services/achievementService';
import { ACADEMIC_YEARS } from '../../config/academicYears';

export const AchievementList = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    loadAchievements();
  }, [typeFilter]);

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (typeFilter) filters.type = typeFilter;
      const res = await achievementService.getAchievements(filters);
      setAchievements(res.data);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'achievementTitle',
      header: 'Achievement / Award Title',
      sortable: true,
      render: (val, row) => (
        <div className="max-w-md">
          <div className="font-bold text-slate-900 line-clamp-1">{val}</div>
          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
            {row.awardeeName} ({row.type}) &bull; {row.competition}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category & Level',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800">{val}</span>
          <div className="text-[10px] text-slate-400">{row.level}</div>
        </div>
      ),
    },
    {
      key: 'position',
      header: 'Position / Prize',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800">
          {val}
        </span>
      ),
    },
    {
      key: 'departmentName',
      header: 'Department',
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
        <button
          onClick={() => setPreviewItem(row)}
          title="Preview Award Certificate"
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
        title="Student & Faculty Achievements"
        subtitle="National hackathons, sports awards, academic fellowships, and professional recognitions"
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/achievements/add')}
          >
            Submit Achievement
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={achievements}
        loading={loading}
        searchPlaceholder="Search awards, student names, competitions..."
        searchKeys={['achievementTitle', 'awardeeName', 'competition', 'category']}
        filters={
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="STUDENT">Student Achievements</option>
            <option value="FACULTY">Faculty Honors & Awards</option>
          </select>
        }
      />

      <EvidenceViewerModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        evidenceName={previewItem?.certificateDocument || 'Certificate.pdf'}
        title={previewItem?.achievementTitle}
        category={`${previewItem?.awardeeName} &bull; ${previewItem?.position}`}
      />
    </PageContainer>
  );
};

export const AddAchievement = () => {
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
      type: 'STUDENT',
      awardeeName: '',
      registerNumber: '',
      achievementTitle: '',
      competition: '',
      organizer: '',
      category: 'Hackathon',
      level: 'National Level',
      position: '1st Prize (Winner)',
      cashPrize: '',
      awardDate: '2026-08-01',
      academicYear: '2026 - 2027',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await achievementService.createAchievement(
        {
          ...data,
          certificateDocument: evidenceFileName || 'Certificate.pdf',
        },
        user
      );
      toast.success('Achievement submitted for verification!');
      navigate('/achievements');
    } catch (err) {
      toast.error('Failed to submit achievement.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Log Achievement / Recognition"
        subtitle="Record prizes, fellowships, patents and hackathon wins for NAAC Criterion 5"
        breadcrumb={[
          { label: 'Achievements', path: '/achievements' },
          { label: 'Submit Achievement' },
        ]}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/achievements')}
          >
            Back
          </Button>
        }
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Achievement Category"
                required
                options={[
                  { value: 'STUDENT', label: 'Student Achievement' },
                  { value: 'FACULTY', label: 'Faculty Recognition / Award' },
                ]}
                {...register('type')}
              />

              <Input
                label="Awardee Name(s)"
                required
                placeholder="e.g. Rahul Verma & Team CyberForge"
                error={errors.awardeeName}
                {...register('awardeeName', { required: 'Name is required' })}
              />
            </div>

            <Input
              label="Achievement Title / Prize Description"
              required
              placeholder="e.g. 1st Prize in Smart India Hackathon 2026 (Hardware Edition)"
              error={errors.achievementTitle}
              {...register('achievementTitle', { required: 'Title is required' })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Competition / Event Name"
                required
                placeholder="e.g. Smart India Hackathon"
                {...register('competition')}
              />

              <Select
                label="Competition Level"
                options={['Institutional', 'State Level', 'National Level', 'International Level']}
                {...register('level')}
              />

              <Select
                label="Position / Standing"
                options={[
                  '1st Prize (Winner)',
                  '2nd Prize (Runner Up)',
                  '3rd Prize',
                  'Special Jury Mention',
                  'Best Paper Award',
                  'Fellowship Award',
                ]}
                {...register('position')}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <FileInput
              label="Upload Certificate / Proof of Award (PDF/PNG)"
              fileName={evidenceFileName}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setEvidenceFileName(e.target.files[0].name);
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="submit" variant="primary" size="md" icon={Send} loading={submitting}>
              Submit Achievement
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};
