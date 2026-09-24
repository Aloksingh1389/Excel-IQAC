import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
export const StaffDetails = () => {
  const { staffId } = useParams();
  const { user } = useAuth();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user || !staffId) return undefined;
    setLoading(true);
    setError(null);
    departmentPortalService.getDepartmentStaffMember(staffId, user)
      .then((res) => { if (!cancelled) setDetail(res.data); })
      .catch(() => { if (!cancelled) setError('Staff member not found in your department.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [staffId, user?.id, user?.role, user?.departmentCode]);

  if (loading) return <Loader message="Loading staff details..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;
  if (!detail) return <EmptyState title="No staff details" description="Staff record could not be loaded." />;

  const { profile = {}, contributions = {}, workflow = {}, tasks = {} } = detail;
  const section = (title, children) => (
    <Card className="p-4 sm:p-6 space-y-3">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {children}
    </Card>
  );
  const row = (label, value) => (
    <div className="flex items-center justify-between gap-2 text-xs py-1.5 border-b border-slate-100 last:border-0">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="font-bold text-slate-900 text-right">{value ?? '—'}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{profile.name || 'Staff Details'}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{`${profile.designation || ''} · ${profile.employeeId || ''}`}</p>
      </div>
      <Link to="/department/staff" className="text-xs font-bold text-indigo-700 hover:underline">← Back to Staff</Link>
      {section('Profile', (
        <div>
          {row('Name', profile.name)}
          {row('Employee ID', profile.employeeId)}
          {row('Designation', profile.designation)}
          {row('Email', profile.email)}
          {row('Qualification', profile.qualification)}
          {row('Specialization', profile.specialization)}
          {row('Profile Completion', profile.profileCompletion != null ? `${profile.profileCompletion}%` : '—')}
          {row('Status', profile.status)}
        </div>
      ))}
      {section('Contributions', (
        <div>
          {row('Submissions', contributions.submissions)}
          {row('Verified', contributions.verified)}
          {row('Evidence', contributions.evidence)}
        </div>
      ))}
      {section('Workflow', (
        <div className="text-xs space-y-1.5">
          <p className="font-bold text-slate-700">Pending: {(workflow.pending || []).length}</p>
          <p className="font-bold text-slate-700">Returned: {(workflow.returned || []).length}</p>
          <p className="font-bold text-slate-700">Pending Evidence: {(workflow.pendingEvidence || []).length}</p>
        </div>
      ))}
      {section('Tasks', (
        <div className="text-xs space-y-1.5">
          {(tasks.assigned || []).length === 0 ? (
            <p className="text-slate-500 font-medium">No tasks assigned.</p>
          ) : (tasks.assigned || []).map((t) => (
            <div key={t.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-800">{t.title || t.id}</span>
              <span className="font-bold text-slate-600">{t.status}</span>
            </div>
          ))}
          {(tasks.overdue || []).length > 0 && (
            <p className="font-bold text-rose-700">{tasks.overdue.length} overdue task(s)</p>
          )}
        </div>
      ))}
    </div>
  );
};
