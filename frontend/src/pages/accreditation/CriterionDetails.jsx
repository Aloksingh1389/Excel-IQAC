import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAccreditation } from '../../hooks/useAccreditation';
import { MetricTable } from '../../components/accreditation/MetricTable';
import { QualityStatusBadge } from '../../components/quality/QualityStatusBadge';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, Award, ShieldCheck, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

export const CriterionDetails = () => {
  const { criterionId } = useParams();
  const { user } = useAuth();
  const { getCriterionDetails } = useAccreditation();

  const [criterion, setCriterion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await getCriterionDetails(criterionId);
        if (res.success) setCriterion(res.data);
      } catch (err) {
        console.error('Error fetching criterion details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [criterionId]);

  if (loading || !criterion) {
    return <Loader message="Loading NAAC Criterion Readiness & Metrics Catalog..." />;
  }

  const { readiness } = criterion;

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
                {criterion.code}: {criterion.name}
              </h1>
              <QualityStatusBadge score={readiness.readinessScore} rating={readiness.status} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Weightage: {criterion.weightage} Pts &bull; Responsible Authority: {criterion.ownerRole.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Criterion Overview Card */}
      <Card className="p-5 sm:p-6 space-y-4 text-xs">
        <h2 className="text-base font-bold text-slate-900 leading-snug">
          Criterion Readiness & Metrics Overview
        </h2>

        <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border">
          {criterion.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border">
            <Award className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Readiness Score</p>
              <p className="font-bold text-slate-900">{readiness.readinessScore}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Ready Metrics</p>
              <p className="font-bold text-emerald-900">{readiness.readyMetricsCount} / {readiness.metricsCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Evidence Completeness</p>
              <p className="font-bold text-teal-900">{readiness.evidenceCompleteness}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Unresolved Gaps</p>
              <p className="font-bold text-rose-700">{readiness.gapsCount}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Metrics Table */}
      <MetricTable metrics={criterion.metrics} />
    </div>
  );
};
