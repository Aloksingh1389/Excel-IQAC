import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { GraduationCap, BookOpen, PlusCircle, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, Card } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/forms/Input';
import { academicService } from '../../services/achievementService';
import { ACADEMIC_YEARS } from '../../config/academicYears';

export const AcademicRecordList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await academicService.getAcademicRecords();
        setRecords(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns = [
    {
      key: 'subjectName',
      header: 'Subject & Course Code',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900">{val}</div>
          <div className="text-[10px] text-slate-400 font-mono">
            {row.subjectCode} &bull; Semester {row.semester}
          </div>
        </div>
      ),
    },
    {
      key: 'facultyName',
      header: 'Faculty Instructor',
      sortable: true,
    },
    {
      key: 'passPercentage',
      header: 'Pass Rate (%)',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-emerald-600">
          {val}%
        </span>
      ),
    },
    {
      key: 'studentFeedbackRating',
      header: 'Student Feedback',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-1 font-semibold text-amber-600">
          ★ {val} / 5.0
        </div>
      ),
    },
    {
      key: 'courseFileStatus',
      header: 'Course File',
      render: (val) => (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-700">
          {val || 'Submitted'}
        </span>
      ),
    },
    {
      key: 'academicYear',
      header: 'Academic Year',
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Teaching & Academic Course Portfolio"
        subtitle="Course outcomes, pass percentages, student feedback ratings and course files"
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/academic/add')}
          >
            Log Semester Course
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={records}
        loading={loading}
        searchPlaceholder="Search courses, subject code, instructor..."
        searchKeys={['subjectName', 'subjectCode', 'facultyName']}
      />
    </PageContainer>
  );
};

export const AddAcademicRecord = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subjectName: '',
      subjectCode: '',
      semester: '5',
      academicYear: '2026 - 2027',
      totalStudents: '64',
      passedStudents: '62',
      passPercentage: '96.8',
      studentFeedbackRating: '4.8',
      courseFileStatus: 'VERIFIED',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await academicService.createAcademicRecord(
        {
          ...data,
          passPercentage: Number(data.passPercentage) || 95,
          studentFeedbackRating: Number(data.studentFeedbackRating) || 4.5,
        },
        user
      );
      toast.success('Teaching course record updated!');
      navigate('/academic');
    } catch (err) {
      toast.error('Failed to save course record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Log Teaching Course Record"
        subtitle="Record semester course performance for NBA Tier-1 OBE Criterion 2"
        breadcrumb={[
          { label: 'Academic Records', path: '/academic' },
          { label: 'Log Course' },
        ]}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/academic')}
          >
            Back
          </Button>
        }
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Course / Subject Name"
                required
                placeholder="e.g. Distributed Cloud Computing Architecture"
                error={errors.subjectName}
                {...register('subjectName', { required: 'Subject name required' })}
              />

              <Input
                label="Subject Code"
                required
                placeholder="e.g. CS601PC"
                error={errors.subjectCode}
                {...register('subjectCode', { required: 'Subject code required' })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Semester"
                options={['1', '2', '3', '4', '5', '6', '7', '8']}
                {...register('semester')}
              />

              <Input
                label="Pass Percentage (%)"
                type="number"
                step="0.1"
                placeholder="96.5"
                {...register('passPercentage')}
              />

              <Input
                label="Student Feedback (out of 5.0)"
                type="number"
                step="0.1"
                placeholder="4.8"
                {...register('studentFeedbackRating')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="submit" variant="primary" size="md" icon={Send} loading={submitting}>
              Save Course Performance
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};
