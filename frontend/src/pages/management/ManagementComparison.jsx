import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { DepartmentComparisonChart } from '../../components/management';

const Alert = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{message}</div>
);
const cell = (v, suffix = '') => (v === null || v === undefined ? '—' : `${v}${suffix}`);

export const ManagementComparison = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getDepartmentComparison(user)
      .then((res) => { if (!cancelled) setRows(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load comparison.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  if (loading) return <Loader message="Loading department comparison..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_COMPARISON_VIEW)) return <Alert message="You do not have permission to view comparison." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Comparison</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Side-by-side benchmarking across all departments</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Quality / Compliance / Readiness</h3>
        <DepartmentComparisonChart rows={rows} />
      </Card>
      <Card className="p-4 sm:p-6">
        {rows.length === 0 ? <EmptyState title="No comparison data" description="No departments to compare." /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="py-2 px-3 sticky left-0 bg-white">Dept</th>
                <th className="py-2 px-3">Staff</th><th className="py-2 px-3">Students</th>
                <th className="py-2 px-3">Pass %</th><th className="py-2 px-3">Placement %</th>
                <th className="py-2 px-3">Publications</th><th className="py-2 px-3">Funding</th>
                <th className="py-2 px-3">Submission %</th><th className="py-2 px-3">Evidence %</th>
                <th className="py-2 px-3">Quality</th><th className="py-2 px-3">Compliance</th>
                <th className="py-2 px-3">Readiness</th><th className="py-2 px-3">Open Actions</th>
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id || r.code} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/management/departments/${r.id || r.code}`)}>
                    <td className="py-2 px-3 font-bold text-slate-800 sticky left-0 bg-white">{r.code}</td>
                    <td className="py-2 px-3">{cell(r.staff)}</td><td className="py-2 px-3">{cell(r.students)}</td>
                    <td className="py-2 px-3">{cell(r.passPercentage, '%')}</td><td className="py-2 px-3">{cell(r.placementPercentage, '%')}</td>
                    <td className="py-2 px-3">{cell(r.publications)}</td><td className="py-2 px-3">{cell(r.researchFunding)}</td>
                    <td className="py-2 px-3">{cell(r.submissionCompletion, '%')}</td><td className="py-2 px-3">{cell(r.evidenceCompleteness, '%')}</td>
                    <td className="py-2 px-3 font-bold">{cell(r.quality, '%')}</td><td className="py-2 px-3 font-bold">{cell(r.compliance, '%')}</td>
                    <td className="py-2 px-3 font-bold">{cell(r.readiness, '%')}</td><td className="py-2 px-3">{cell(r.openActions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
