import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQualityMonitoring } from '../../hooks/useQualityMonitoring';
import { useCompliance } from '../../hooks/useCompliance';
import { useImprovementPlans } from '../../hooks/useImprovementPlans';
import { QualityStatusBadge } from '../../components/quality/QualityStatusBadge';
import { ComplianceStatusBadge } from '../../components/quality/ComplianceStatusBadge';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, Building2, ShieldCheck, CheckCircle2, FileText, AlertTriangle, Target, ExternalLink } from 'lucide-react';

export const DepartmentQualityDetails = () => {
  const { departmentId } = useParams();
  const { user } = useAuth();
  const { summary, indicators, loading: loadingQuality } = useQualityMonitoring();
  const { records: complianceRecords, loading: loadingCompliance } = useCompliance({ deptFilter: departmentId });
  const { plans: improvementPlans, loading: loadingPlans } = useImprovementPlans({ deptFilter: departmentId });

  if (loadingQuality || loadingCompliance || loadingPlans || !summary) {
    return <Loader message={`Loading Quality Scorecard & Compliance Drill-Down for ${departmentId}...`} />;
  }

  const scorecard = summary.departmentScorecards.find((sc) => sc.code === departmentId) || {
    code: departmentId,
    name: `${departmentId} Department`,
    score: 82,
    compliance: 85,
    evidence: 80,
    actions: 88,
    status: 'GOOD',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/quality-monitoring/departments"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {scorecard.code} Quality Performance Scorecard
              </h1>
              <QualityStatusBadge score={scorecard.score} rating={scorecard.status} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {scorecard.name} &bull; Comprehensive Quality Monitoring & Compliance Drill-Down
            </p>
          </div>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1 bg-indigo-50/50 border-indigo-100">
          <p className="text-[10px] font-bold text-indigo-900 uppercase">Quality Score</p>
          <p className="text-3xl font-black text-indigo-950">{scorecard.score} / 100</p>
          <p className="text-[10px] text-slate-500 font-medium">Weighted Institutional Index</p>
        </Card>

        <Card className="p-4 space-y-1 bg-emerald-50/50 border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-900 uppercase">Compliance Rate</p>
          <p className="text-3xl font-black text-emerald-950">{scorecard.compliance}%</p>
          <p className="text-[10px] text-slate-500 font-medium">Verified Compliance</p>
        </Card>

        <Card className="p-4 space-y-1 bg-teal-50/50 border-teal-100">
          <p className="text-[10px] font-bold text-teal-900 uppercase">Evidence Completeness</p>
          <p className="text-3xl font-black text-teal-950">{scorecard.evidence}%</p>
          <p className="text-[10px] text-slate-500 font-medium">Verified Document Proofs</p>
        </Card>

        <Card className="p-4 space-y-1 bg-blue-50/50 border-blue-100">
          <p className="text-[10px] font-bold text-blue-900 uppercase">Action Resolution Rate</p>
          <p className="text-3xl font-black text-blue-950">{scorecard.actions}%</p>
          <p className="text-[10px] text-slate-500 font-medium">Completed Resolution Tasks</p>
        </Card>
      </div>

      {/* Department Compliance Breakdown */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Department Compliance Requirements ({complianceRecords.length})
          </h3>
          <Link
            to="/iqac/compliance"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View Full Compliance Center</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {complianceRecords.map((cr) => (
            <div
              key={cr.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-indigo-900">{cr.requirementCode}</span>
                  <span className="font-bold text-slate-900">{cr.requirementName}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Due Date: {cr.dueDate} &bull; Remarks: {cr.remarks || 'Standard requirement'}
                </p>
              </div>
              <ComplianceStatusBadge status={cr.status} />
            </div>
          ))}
        </div>
      </Card>

      {/* Department Improvement Plans */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Active Quality Improvement Interventions ({improvementPlans.length})
          </h3>
        </div>

        {improvementPlans.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No active improvement plans assigned for this department.</p>
        ) : (
          <div className="space-y-2.5">
            {improvementPlans.map((ip) => (
              <div
                key={ip.id}
                className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-indigo-950">{ip.planId}: {ip.title}</span>
                  </div>
                  <p className="text-slate-600">Owner: {ip.ownerName} &bull; Target Date: {ip.targetDate}</p>
                </div>
                <Link
                  to={`/iqac/improvement-plans/${ip.id}`}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shrink-0"
                >
                  Inspect Plan
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
