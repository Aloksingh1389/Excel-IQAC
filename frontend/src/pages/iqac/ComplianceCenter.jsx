import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCompliance } from '../../hooks/useCompliance';
import { useIQAC } from '../../hooks/useIQAC';
import { ComplianceStatusBadge } from '../../components/quality/ComplianceStatusBadge';
import { ComplianceHeatmap } from '../../components/quality/ComplianceHeatmap';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Search, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComplianceCenter = () => {
  const { user } = useAuth();
  const { departments } = useIQAC();
  const { records, statistics, heatmap, loading } = useCompliance();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  if (loading || !statistics) {
    return <Loader message="Loading Institutional Compliance Center & Heatmap..." />;
  }

  const filteredRecords = records.filter((cr) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      cr.requirementCode.toLowerCase().includes(q) ||
      cr.requirementName.toLowerCase().includes(q) ||
      cr.departmentCode.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || cr.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || cr.category === categoryFilter;

    return matchesQuery && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Institutional Compliance Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
              {statistics.complianceRate}% Verified Compliance
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor department documentation compliance, evidence verification benchmarks & accreditation deadlines
          </p>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <IQACStatCard
          title="Total Requirements"
          value={statistics.total}
          subtitle="Compliance Scope"
          icon={CheckCircle2}
          color="indigo"
        />
        <IQACStatCard
          title="Compliant Items"
          value={statistics.compliant}
          subtitle="Verified & Met"
          icon={CheckCircle2}
          color="emerald"
        />
        <IQACStatCard
          title="Partially Compliant"
          value={statistics.partial}
          subtitle="Evidence Pending"
          icon={AlertTriangle}
          color="amber"
        />
        <IQACStatCard
          title="Non-Compliant"
          value={statistics.nonCompliant}
          subtitle="Unmet Standards"
          icon={XCircle}
          color="rose"
        />
        <IQACStatCard
          title="Overdue Requirements"
          value={statistics.overdue}
          subtitle="Past Target Deadline"
          icon={Clock}
          color="rose"
        />
      </div>

      {/* Compliance Heatmap Component (Section 26 requirement) */}
      <ComplianceHeatmap heatmapData={heatmap} />

      {/* Compliance Requirements Directory */}
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Compliance Requirements Master Directory
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Detailed tracking of required documents, verification statuses, deadlines & remarks
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative shrink-0 w-full sm:w-52">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search requirement, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
              />
            </div>

            <div className="relative shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLIANT">Compliant</option>
                <option value="PARTIALLY_COMPLIANT">Partially Compliant</option>
                <option value="NON_COMPLIANT">Non Compliant</option>
                <option value="OVERDUE">Overdue</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scroll text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b font-bold uppercase tracking-wider">
                <th className="p-3">Requirement Code</th>
                <th className="p-3">Requirement Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Dept</th>
                <th className="p-3 text-center">Due Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                    No compliance records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((cr) => (
                  <tr key={cr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-extrabold text-indigo-900">{cr.requirementCode}</td>
                    <td className="p-3 font-bold text-slate-900">{cr.requirementName}</td>
                    <td className="p-3 text-slate-600">{cr.category}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{cr.departmentCode}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{cr.dueDate}</td>
                    <td className="p-3 text-center">
                      <ComplianceStatusBadge status={cr.status} />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/iqac/compliance/${cr.id}`}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
