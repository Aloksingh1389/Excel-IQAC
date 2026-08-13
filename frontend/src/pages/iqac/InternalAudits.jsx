import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, Card } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/overlay/Modal';
import { Input, Select, Textarea } from '../../components/forms/Input';
import { auditService } from '../../services/qualityService';
import { ClipboardList, PlusCircle, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

export const InternalAudits = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [auditType, setAuditType] = useState('Academic Audit');
  const [targetDepartment, setTargetDepartment] = useState('Computer Science and Engineering');
  const [leadAuditor, setLeadAuditor] = useState('Dr. S. K. Gupta');
  const [scheduledDate, setScheduledDate] = useState('2026-09-15');

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    setLoading(true);
    try {
      const res = await auditService.getAudits();
      setAudits(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAudit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setModalLoading(true);
    try {
      await auditService.createAudit({
        title,
        auditType,
        targetDepartment,
        leadAuditor,
        scheduledDate,
        observations: [],
        status: 'SCHEDULED',
      });
      toast.success('Internal Quality Audit scheduled!');
      setIsModalOpen(false);
      setTitle('');
      loadAudits();
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Audit Scope & Theme',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-500">{row.targetDepartment}</div>
        </div>
      ),
    },
    {
      key: 'auditType',
      header: 'Audit Category',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-800">
          {val}
        </span>
      ),
    },
    {
      key: 'leadAuditor',
      header: 'Lead Auditor',
      sortable: true,
    },
    {
      key: 'scheduledDate',
      header: 'Audit Date',
      sortable: true,
    },
    {
      key: 'observations',
      header: 'Non-Conformities',
      render: (val) => (
        <span className={`font-semibold ${val?.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {val?.length || 0} Observations
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Academic & Administrative Audits (AAA)"
        subtitle="Internal institutional quality audit schedules, peer review panels, and observation trackers"
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setIsModalOpen(true)}
          >
            Schedule AAA Audit
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={audits}
        loading={loading}
        searchPlaceholder="Search audits by title, department or auditor..."
        searchKeys={['title', 'targetDepartment', 'leadAuditor', 'auditType']}
      />

      {/* Schedule Audit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Academic & Administrative Audit"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateAudit} className="space-y-4">
          <Input
            label="Audit Title"
            required
            placeholder="e.g. Annual Course Files & Laboratory Infrastructure Review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Audit Type"
              value={auditType}
              onChange={(e) => setAuditType(e.target.value)}
              options={[
                'Academic Audit',
                'Administrative Audit',
                'Green & Energy Audit',
                'Examination & Evaluation Audit',
                'IT Infrastructure Audit',
              ]}
            />

            <Select
              label="Target Department"
              value={targetDepartment}
              onChange={(e) => setTargetDepartment(e.target.value)}
              options={[
                'Computer Science and Engineering',
                'Electronics and Communication Engineering',
                'Mechanical Engineering',
                'Electrical and Electronics Engineering',
                'Civil Engineering',
                'All Academic Departments',
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Lead Auditor Name"
              required
              value={leadAuditor}
              onChange={(e) => setLeadAuditor(e.target.value)}
            />

            <Input
              label="Scheduled Date"
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={modalLoading}>
              Schedule Audit
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};
