import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, Card } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/overlay/Modal';
import { Input, Select, Textarea } from '../../components/forms/Input';
import { qualityService } from '../../services/qualityService';
import { Sparkles, PlusCircle, Target, CheckCircle2 } from 'lucide-react';

export const QualityInitiatives = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pedagogical Reform');
  const [targetOutcome, setTargetOutcome] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('Dr. M. S. Swaminathan');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadInitiatives();
  }, []);

  const loadInitiatives = async () => {
    setLoading(true);
    try {
      const res = await qualityService.getQualityInitiatives();
      setInitiatives(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setModalLoading(true);
    try {
      await qualityService.createQualityInitiative({
        title,
        category,
        targetOutcome,
        responsiblePerson,
        description,
        academicYear: '2026 - 2027',
      });
      toast.success('New Institutional Quality Initiative created!');
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      loadInitiatives();
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateProgress = async (id, currentProgress) => {
    const newProgress = Math.min(100, currentProgress + 20);
    const newStatus = newProgress >= 100 ? 'COMPLETED' : 'ACTIVE';
    await qualityService.updateQualityInitiative(id, {
      currentProgress: newProgress,
      status: newStatus,
    });
    toast.success(`Progress updated to ${newProgress}%`);
    loadInitiatives();
  };

  const columns = [
    {
      key: 'title',
      header: 'Strategic Initiative & Scope',
      sortable: true,
      render: (val, row) => (
        <div className="max-w-md">
          <div className="font-bold text-slate-900 line-clamp-1">{val}</div>
          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Quality Dimension',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-700">
          {val}
        </span>
      ),
    },
    {
      key: 'responsiblePerson',
      header: 'Lead / Coordinator',
      sortable: true,
    },
    {
      key: 'currentProgress',
      header: 'Execution Progress',
      sortable: true,
      render: (val, row) => (
        <div className="w-36 space-y-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-600">{val}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                val >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${val}%` }}
            />
          </div>
        </div>
      ),
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
        <Button
          variant="secondary"
          size="xs"
          disabled={row.currentProgress >= 100}
          onClick={() => handleUpdateProgress(row.id, row.currentProgress)}
        >
          + Step Progress
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Institutional Quality Enhancement Initiatives"
        subtitle="Strategic programs, curriculum overhauls, and accreditation milestone trackers"
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setIsModalOpen(true)}
          >
            Create Initiative
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={initiatives}
        loading={loading}
        searchPlaceholder="Search initiatives by title or lead coordinator..."
        searchKeys={['title', 'category', 'responsiblePerson', 'targetOutcome']}
      />

      {/* Create Initiative Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Launch Quality Enhancement Initiative"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Initiative Title"
            required
            placeholder="e.g. Outcome Based Education (OBE) Attainment Automation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Quality Dimension"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                'Pedagogical Reform',
                'Research Enhancement',
                'Industry Collaboration',
                'Digital Governance',
                'Student Progression',
                'Green Campus & Sustainability',
              ]}
            />

            <Input
              label="Lead Coordinator"
              required
              value={responsiblePerson}
              onChange={(e) => setResponsiblePerson(e.target.value)}
            />
          </div>

          <Input
            label="Target Metric / KPI Goal"
            placeholder="e.g. 100% Course Outcomes mapped with Bloom's Taxonomy"
            value={targetOutcome}
            onChange={(e) => setTargetOutcome(e.target.value)}
          />

          <Textarea
            label="Executive Description & Action Plan"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline objectives, milestone phases and stakeholder departments..."
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={modalLoading}>
              Launch Initiative
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};
