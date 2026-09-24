import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { DepartmentPerformanceTable } from '../../components/management';

const Alert = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{message}</div>
);

export const ManagementOverview = () => {
  const { user, academicYear } = useAuth();
  const [profile, setProfile] = useState(null);
  const [overview, setOverview] = useState(null);
  const [depts, setDepts] = useState([]);
  const [deans, setDeans] = useState([]);
  const [aqar, setAqar] = useState(null);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const [prof, over, deptRes, deanRes, aqarRes, auditRes] = await Promise.all([
          managementPortalService.getManagementProfile(user),
          managementPortalService.getInstitutionOverview(user, academicYear || '2026-27'),
          managementPortalService.getDepartmentOverview(user),
          managementPortalService.getDeanRoster(user),
          managementPortalService.getAQARStatus(user),
          managementPortalService.getAuditRecords({}, user),
        ]);
        if (!cancelled) {
          setProfile(prof.data);
          setOverview(over.data);
          setDepts(Array.isArray(deptRes.data) ? deptRes.data : []);
          setDeans(Array.isArray(deanRes.data) ? deanRes.data : []);
          setAqar(aqarRes.data);
          setAudit(Array.isArray(auditRes.data) ? auditRes.data.slice(0, 5) : []);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load institution overview.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, user?.role, academicYear]);

  if (loading) return <Loader message="Loading institution overview..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_INSTITUTION_VIEW)) return <Alert message="You do not have permission to view the institution overview." />;

  const kpis = overview?.kpis || {};
  const totals = [
    { label: 'Departments', value: kpis.totalDepartments ?? depts.length },
    { label: 'Students', value: kpis.totalStudents ?? '—' },
    { label: 'Faculty', value: kpis.totalFaculty ?? '—' },
    { label: 'Deans', value: deans.length },
    { label: 'Quality Score', value: kpis.qualityScore != null ? `${kpis.qualityScore}%` : '—' },
    { label: 'Compliance Rate', value: kpis.complianceRate != null ? `${kpis.complianceRate}%` : '—' },
  ];
  const reports = Array.isArray(aqar?.reports) ? aqar.reports.slice(0, 4) : [];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Institution Overview</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {profile?.name || user?.name} • {profile?.role || user?.role} • Institution-wide scope • {academicYear || '2026-27'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {totals.map((t) => (
          <Card key={t.label} className="p-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t.label}</p>
            <p className="text-xl font-black text-slate-900">{t.value ?? '—'}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Dean Roster Summary ({deans.length})</h3>
        {deans.length === 0 ? <EmptyState title="No deans" description="No dean assignments found." /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="py-2 pr-3">Dean</th><th className="py-2 pr-3">Departments</th><th className="py-2 pr-3">Status</th>
              </tr></thead>
              <tbody>
                {deans.map((d) => (
                  <tr key={d.email || d.id} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-bold text-slate-800">{d.name}<span className="block font-medium text-slate-500">{d.email}</span></td>
                    <td className="py-2 pr-3 text-slate-600">{(d.assignedDepartmentCodes || []).join(', ') || '—'} ({d.assignedCount ?? (d.assignedDepartmentCodes || []).length})</td>
                    <td className="py-2 pr-3">{d.status || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Departments</h3>
          <Link to="/management/departments" className="text-xs font-bold text-indigo-600 hover:underline">View all →</Link>
        </div>
        <DepartmentPerformanceTable departments={depts} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent AQAR Reports</h3>
            <Link to="/management/aqar" className="text-xs font-bold text-indigo-600 hover:underline">View all →</Link>
          </div>
          {reports.length === 0 ? <EmptyState title="No AQAR reports" description="No AQAR reports available." /> : (
            <ul className="space-y-2">
              {reports.map((r, i) => (
                <li key={r.id || i} className="text-xs text-slate-600 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-800">{r.title || r.academicYear || r.id}</span>
                  <span className="block text-[11px] text-slate-400">{r.status || ''} {r.academicYear ? `• ${r.academicYear}` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Audit Activity</h3>
            <Link to="/management/audit" className="text-xs font-bold text-indigo-600 hover:underline">View all →</Link>
          </div>
          {audit.length === 0 ? <EmptyState title="No audit records" description="No recent audit activity." /> : (
            <ul className="space-y-2">
              {audit.map((l, i) => (
                <li key={l.id || i} className="text-xs text-slate-600 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-800">{l.actorName || '—'}</span> — {l.action || ''}
                  <span className="block text-[11px] text-slate-400">{l.timestamp || ''}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};
