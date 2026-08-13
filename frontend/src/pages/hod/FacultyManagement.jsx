import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, Card } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Drawer } from '../../components/overlay/Modal';
import { ConfirmModal } from '../../components/overlay/ConfirmModal';
import { facultyService } from '../../services/departmentService';
import { userService } from '../../services/userService';
import { User, BookOpen, GraduationCap, ShieldAlert, CheckCircle2, Award, Mail, Phone, Calendar } from 'lucide-react';

export const FacultyManagement = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadFaculty();
  }, [user]);

  const loadFaculty = async () => {
    setLoading(true);
    try {
      const res = await facultyService.getFaculty(user?.departmentId || 'dept_cse');
      setFaculty(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!suspendTarget) return;
    setActionLoading(true);
    const newStatus = suspendTarget.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await facultyService.updateFacultyStatus(suspendTarget.id, newStatus);
      toast.success(`Faculty status updated to ${newStatus}`);
      setSuspendTarget(null);
      loadFaculty();
    } catch (err) {
      toast.error('Failed to change status.');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Faculty Member',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={val} size="sm" />
          <div>
            <div className="font-bold text-slate-900">{val}</div>
            <div className="text-[10px] text-slate-400 font-mono">{row.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'designation',
      header: 'Designation & Specialization',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-800">{val}</div>
          <div className="text-[10px] text-slate-500">{row.specialization}</div>
        </div>
      ),
    },
    {
      key: 'qualification',
      header: 'Ph.D. / Degree',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
          {val}
        </span>
      ),
    },
    {
      key: 'publicationsCount',
      header: 'Papers',
      sortable: true,
      render: (val) => <span className="font-bold text-blue-600">{val || 8}</span>,
    },
    {
      key: 'workloadHours',
      header: 'Teaching Load',
      render: (val) => <span>{val || 16} hrs/week</span>,
    },
    {
      key: 'status',
      header: 'Account Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setSelectedMember(row)}
          >
            View Portfolio
          </Button>
          <Button
            variant={row.status === 'ACTIVE' ? 'ghost' : 'outline'}
            size="xs"
            className={row.status === 'ACTIVE' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600'}
            onClick={() => setSuspendTarget(row)}
          >
            {row.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Department Faculty Roster & Workload"
        subtitle="Manage faculty credentials, academic portfolios, workload assignments, and account statuses"
      />

      <DataTable
        columns={columns}
        data={faculty}
        loading={loading}
        searchPlaceholder="Search faculty by name, employee ID, specialization..."
        searchKeys={['name', 'employeeId', 'designation', 'specialization', 'qualification']}
      />

      {/* Faculty Profile Drawer */}
      <Drawer
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title="Faculty Academic Portfolio"
        width="max-w-xl"
      >
        {selectedMember && (
          <div className="space-y-6 text-xs">
            {/* Top Profile Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
              <Avatar src={selectedMember.avatar} name={selectedMember.name} size="lg" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedMember.name}</h4>
                <p className="text-slate-500 font-medium">{selectedMember.designation}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {selectedMember.qualification}
                  </span>
                  <StatusBadge status={selectedMember.status} size="xs" />
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Publications</span>
                <span className="text-lg font-bold text-blue-600">{selectedMember.publicationsCount || 12}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Grants</span>
                <span className="text-lg font-bold text-indigo-600">₹28.5L</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Teaching Load</span>
                <span className="text-lg font-bold text-emerald-600">{selectedMember.workloadHours || 16}h</span>
              </div>
            </div>

            {/* Details Table */}
            <div className="space-y-2 divide-y divide-slate-100">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Employee ID:</span>
                <span className="font-mono font-bold text-slate-800">{selectedMember.employeeId}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-800">{selectedMember.email}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Specialization:</span>
                <span className="text-slate-800">{selectedMember.specialization}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Date of Joining:</span>
                <span className="text-slate-800">{selectedMember.joiningDate || '2019-06-15'}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="text-slate-800">{selectedMember.departmentName}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Suspend / Activate Confirm Modal */}
      <ConfirmModal
        isOpen={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleToggleStatus}
        title={`${suspendTarget?.status === 'ACTIVE' ? 'Suspend' : 'Activate'} Faculty Account?`}
        message={`Are you sure you want to ${suspendTarget?.status === 'ACTIVE' ? 'suspend' : 'activate'} login access for ${suspendTarget?.name}?`}
        confirmText={suspendTarget?.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
        variant={suspendTarget?.status === 'ACTIVE' ? 'danger' : 'primary'}
        loading={actionLoading}
      />
    </PageContainer>
  );
};
