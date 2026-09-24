import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { QualityTrendChart } from '../../components/management';

const Alert = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{message}</div>
);

const Section = ({ title, children }) => (
  <Card className="p-4 sm:p-6 space-y-3">
    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
    {children}
  </Card>
);

const MiniTable = ({ columns, rows, emptyTitle }) => {
  const list = Array.isArray(rows) ? rows : [];
  if (list.length === 0) return <EmptyState title={emptyTitle || 'No records'} description="Nothing to display in this section." />;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs">
        <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
          {columns.map((c) => <th key={c.key} className="py-2 pr-3">{c.label}</th>)}
        </tr></thead>
        <tbody>
          {list.slice(0, 20).map((r, i) => (
            <tr key={r.id || i} className="border-b border-slate-100">
              {columns.map((c) => <td key={c.key} className="py-2 pr-3 text-slate-600">{c.render ? c.render(r) : (r[c.key] ?? '—')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ManagementDepartmentDetails = () => {
  const { id } = useParams();
  const { user, academicYear } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user || !id) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getDepartmentDetails(id, user)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load department details.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, user?.id, user?.role]);

  if (loading) return <Loader message="Loading department details..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_DEPARTMENT_DETAILS_VIEW)) return <Alert message="You do not have permission to view department details." />;
  if (!data) return <EmptyState title="Department not found" description="No details available for this department." />;

  const dept = data.department || {};
  const academic = data.academic || {};
  const research = data.research || {};
  const quality = data.quality || {};
  const compliance = data.compliance || {};
  const accreditation = data.accreditation || {};
  const ops = data.operations || {};
  const trendData = (academicYear ? null : null, Array.isArray(quality.trend) ? quality.trend.map((s, i) => ({ year: `T${i + 1}`, score: s })) : []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <Link to="/management/departments" className="text-xs font-bold text-indigo-600 hover:underline">← All departments</Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">{dept.code} — {dept.name}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">HOD: {dept.hodName || '—'} • Coordinator: {dept.coordinatorName || '—'} • Dean: {dept.deanName || '—'}</p>
      </div>

      <Section title="Profile">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[['Staff', dept.staffCount], ['Students', dept.studentCount ?? academic.studentCount], ['Quality', dept.qualityScore != null ? `${dept.qualityScore}%` : '—'], ['Compliance', dept.complianceRate != null ? `${dept.complianceRate}%` : '—'], ['Readiness', dept.accreditationReadiness != null ? `${dept.accreditationReadiness}%` : '—'], ['Status', dept.status || '—']].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"><p className="text-[11px] font-semibold text-slate-500">{k}</p><p className="font-black text-slate-900">{v ?? '—'}</p></div>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Academic">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[['Pass %', academic.passPercentage], ['Placement %', academic.placementPercentage], ['Faculty', academic.facultyCount], ['Students', academic.studentCount]].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"><p className="text-[11px] font-semibold text-slate-500">{k}</p><p className="font-black text-slate-900">{v ?? '—'}</p></div>
            ))}
          </div>
        </Section>
        <Section title="Research">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[['Publications', research.publications], ['Funding', research.funding]].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"><p className="text-[11px] font-semibold text-slate-500">{k}</p><p className="font-black text-slate-900">{v ?? '—'}</p></div>
            ))}
          </div>
        </Section>
      </div>

      <Section title={`Quality — score ${quality.score ?? '—'}${quality.score != null ? '%' : ''}`}>
        {quality.categories && typeof quality.categories === 'object' ? (
          <div className="space-y-2">
            {Object.entries(quality.categories).map(([k, v]) => (
              <div key={k} className="space-y-1">
                <div className="flex justify-between text-xs"><span className="font-semibold text-slate-600">{k}</span><span className="font-bold">{v ?? '—'}{v != null ? '%' : ''}</span></div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${Math.max(0, Math.min(100, Number(v) || 0))}%` }} /></div>
              </div>
            ))}
          </div>
        ) : <EmptyState title="No quality categories" description="Category breakdown unavailable." />}
        {trendData.length > 0 && <QualityTrendChart data={trendData} />}
      </Section>

      <Section title={`Compliance — rate ${compliance.rate ?? '—'}${compliance.rate != null ? '%' : ''}`}>
        <MiniTable emptyTitle="No compliance records" columns={[{ key: 'title', label: 'Record' }, { key: 'status', label: 'Status' }, { key: 'dueDate', label: 'Due' }]} rows={compliance.records} />
      </Section>

      <Section title={`Accreditation — readiness ${accreditation.readiness ?? '—'}${accreditation.readiness != null ? '%' : ''}`}>
        {accreditation.criteria && typeof accreditation.criteria === 'object' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {Object.entries(accreditation.criteria).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"><p className="text-[11px] font-semibold text-slate-500">Criterion {k}</p><p className="font-black">{v ?? '—'}{v != null ? '%' : ''}</p></div>
            ))}
          </div>
        ) : <EmptyState title="No criteria data" description="Accreditation criteria unavailable." />}
        <MiniTable emptyTitle="No gaps recorded" columns={[{ key: 'title', label: 'Gap' }, { key: 'status', label: 'Status' }, { key: 'criterion', label: 'Criterion' }]} rows={accreditation.gaps} />
      </Section>

      <Section title={`Operations — ${ops.pendingCount ?? 0} pending submissions • ${ops.evidencePending ?? 0} evidence pending`}>
        <h4 className="text-xs font-bold text-slate-700">Submissions</h4>
        <MiniTable emptyTitle="No submissions" columns={[{ key: 'title', label: 'Title' }, { key: 'status', label: 'Status' }, { key: 'academicYear', label: 'Year' }]} rows={ops.submissions} />
        <h4 className="text-xs font-bold text-slate-700 pt-2">Action Items</h4>
        <MiniTable emptyTitle="No action items" columns={[{ key: 'title', label: 'Item' }, { key: 'status', label: 'Status' }]} rows={ops.actionItems} />
        <h4 className="text-xs font-bold text-slate-700 pt-2">Activities</h4>
        <MiniTable emptyTitle="No activities" columns={[{ key: 'title', label: 'Activity' }, { key: 'status', label: 'Status' }]} rows={ops.activities} />
        <h4 className="text-xs font-bold text-slate-700 pt-2">Meetings</h4>
        <MiniTable emptyTitle="No meetings" columns={[{ key: 'title', label: 'Meeting' }, { key: 'date', label: 'Date' }]} rows={ops.meetings} />
      </Section>
    </div>
  );
};
