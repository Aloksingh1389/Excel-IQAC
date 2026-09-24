import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAccreditationMetrics } from '../../hooks/useAccreditationMetrics';
import { MetricReadinessBadge } from '../../components/accreditation/MetricReadinessBadge';
import { SubmissionEvidenceList } from '../../components/iqac/SubmissionEvidenceList';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, CheckCircle2, ShieldCheck, User, Building2, Calendar, ExternalLink } from 'lucide-react';

export const MetricDetails = () => {
  const { metricId } = useParams();
  const { user } = useAuth();
  const { getMetricDetails } = useAccreditationMetrics();

  const [metric, setMetric] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await getMetricDetails(metricId);
        if (res.success) setMetric(res.data);
      } catch (err) {
        console.error('Error fetching metric details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [metricId]);

  if (loading || !metric) {
    return <Loader message="Loading NAAC Metric Readiness & Evidence Traceability..." />;
  }

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
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {metric.code}: {metric.name}
              </h1>
              <MetricReadinessBadge status={metric.readinessStatus} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Type: {metric.type} &bull; Applicable Scope: {metric.applicableScope}
            </p>
          </div>
        </div>
      </div>

      {/* Main Metric Overview Card */}
      <Card className="p-5 sm:p-6 space-y-4 text-xs">
        <h2 className="text-base font-bold text-slate-900 leading-snug">
          Metric Specification & Benchmark Targets
        </h2>

        <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border">
          {metric.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border">
            <User className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned Owner</p>
              <p className="font-bold text-slate-900 truncate">{metric.assignedOwner}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Department</p>
              <p className="font-bold text-slate-900">{metric.assignedDepartment}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Completion Score</p>
              <p className="font-bold text-slate-900">{metric.completionPercentage}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Evidence Completeness</p>
              <p className="font-bold text-teal-900">{metric.evidenceCompleteness}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Mapped Stage 5C Submissions & Stage 5E Action Items */}
      <Card className="p-5 space-y-3 text-xs">
        <h3 className="font-bold text-slate-900 pb-2 border-b">
          Mapped Submissions & Action Items Traceability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
            <p className="font-bold text-indigo-900">Mapped Submissions ({metric.mappedSubmissionIds?.length || 0})</p>
            {metric.mappedSubmissionIds && metric.mappedSubmissionIds.length > 0 ? (
              metric.mappedSubmissionIds.map((sId) => (
                <Link key={sId} to={`/iqac/submissions/${sId}`} className="font-bold text-indigo-600 hover:text-indigo-800 text-xs block">
                  {sId} &rarr; Inspect Submission
                </Link>
              ))
            ) : (
              <p className="text-slate-400">No mapped submissions.</p>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
            <p className="font-bold text-indigo-900">Mapped Action Items ({metric.mappedActionItemIds?.length || 0})</p>
            {metric.mappedActionItemIds && metric.mappedActionItemIds.length > 0 ? (
              metric.mappedActionItemIds.map((aId) => (
                <Link key={aId} to={`/iqac/action-items/${aId}`} className="font-bold text-indigo-600 hover:text-indigo-800 text-xs block">
                  {aId} &rarr; Inspect Action Item
                </Link>
              ))
            ) : (
              <p className="text-slate-400">No mapped action items.</p>
            )}
          </div>
        </div>
      </Card>

      {/* Linked Stage 5D Evidence Repository Documents */}
      <SubmissionEvidenceList evidenceList={[]} submissionId={metric.code} />
    </div>
  );
};
