import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccreditation } from '../../hooks/useAccreditation';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, Building2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DepartmentAccreditationScorecards = () => {
  const { user } = useAuth();
  const { summary, loading } = useAccreditation();

  if (loading || !summary) {
    return <Loader message="Loading Department Accreditation Readiness Matrix..." />;
  }

  const depts = [
    { code: 'CSE', name: 'Computer Science & Engineering', readiness: 88, metrics: 91, evidence: 87, compliance: 94, gaps: 4 },
    { code: 'ECE', name: 'Electronics & Communication', readiness: 79, metrics: 81, evidence: 76, compliance: 85, gaps: 9 },
    { code: 'EEE', name: 'Electrical & Electronics', readiness: 84, metrics: 86, evidence: 82, compliance: 88, gaps: 6 },
    { code: 'MECH', name: 'Mechanical Engineering', readiness: 62, metrics: 65, evidence: 58, compliance: 67, gaps: 18 },
    { code: 'CIVIL', name: 'Civil Engineering', readiness: 60, metrics: 62, evidence: 54, compliance: 62, gaps: 21 },
    { code: 'IT', name: 'Information Technology', readiness: 86, metrics: 88, evidence: 85, compliance: 90, gaps: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/accreditation"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Department NAAC Accreditation Readiness Matrix
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Readiness score, metrics completion %, verified evidence & gap counts per department
            </p>
          </div>
        </div>
      </div>

      <Card className="p-4 sm:p-6 space-y-4">
        <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scroll text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b font-bold uppercase tracking-wider">
                <th className="p-3">Department Code & Name</th>
                <th className="p-3 text-center">Readiness %</th>
                <th className="p-3 text-center">Metrics %</th>
                <th className="p-3 text-center">Evidence %</th>
                <th className="p-3 text-center">Compliance %</th>
                <th className="p-3 text-center">Open Gaps</th>
                <th className="p-3 text-right">Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {depts.map((d) => (
                <tr key={d.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <p className="font-extrabold text-slate-900">{d.code}</p>
                    <p className="text-[10px] text-slate-400">{d.name}</p>
                  </td>
                  <td className="p-3 text-center font-black text-indigo-950 text-sm">{d.readiness}%</td>
                  <td className="p-3 text-center font-bold text-slate-800">{d.metrics}%</td>
                  <td className="p-3 text-center font-bold text-teal-800">{d.evidence}%</td>
                  <td className="p-3 text-center font-bold text-emerald-800">{d.compliance}%</td>
                  <td className="p-3 text-center font-black text-rose-700">{d.gaps}</td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/iqac/quality-monitoring/departments/${d.code}`}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
