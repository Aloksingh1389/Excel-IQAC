import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccreditation } from '../../hooks/useAccreditation';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { CriterionCard } from '../../components/accreditation/CriterionCard';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Award, CheckCircle2, ShieldCheck, AlertTriangle, FileText, ArrowRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccreditationDashboard = () => {
  const { user } = useAuth();
  const { summary, criteria, loading } = useAccreditation();

  if (loading || !summary) {
    return <Loader message="Loading NAAC Accreditation Framework & Criteria Readiness..." />;
  }

  const { readiness } = summary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              NAAC Accreditation Criteria 1–7 Framework
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Representative NAAC-aligned accreditation readiness, criteria metrics mapping & evidence verification engine
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Link
            to="/accreditation/gaps"
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Accreditation Gap Center</span>
          </Link>
          <Link
            to="/accreditation/departments"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Department Readiness</span>
          </Link>
        </div>
      </div>

      {/* Top KPI Cards (Section 20 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <IQACStatCard
          title="Overall NAAC Readiness"
          value={`${readiness.overallReadiness}%`}
          subtitle="Framework Score"
          icon={Award}
          color="indigo"
          badgeText="GOOD"
        />
        <IQACStatCard
          title="Criteria Ready"
          value={`${readiness.criteriaReady} / ${readiness.totalCriteria}`}
          subtitle=">= 80% Readiness"
          icon={CheckCircle2}
          color="emerald"
        />
        <IQACStatCard
          title="Metrics Ready"
          value={`${readiness.metricsReady} / ${readiness.totalMetrics}`}
          subtitle="Verified Readiness"
          icon={CheckCircle2}
          color="teal"
        />
        <IQACStatCard
          title="Evidence Completeness"
          value={`${readiness.evidenceCompleteness}%`}
          subtitle="Verified Proofs"
          icon={ShieldCheck}
          color="blue"
        />
        <IQACStatCard
          title="Critical Gaps"
          value={readiness.criticalGaps}
          subtitle="Action Needed"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Criteria 1 to 7 Grid (Section 21 requirement) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            NAAC Criteria 1–7 Performance & Readiness Grid
          </h2>
          <span className="text-xs font-semibold text-slate-500">7 Major Criteria</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {criteria.map((c) => (
            <CriterionCard key={c.id} criterion={c} />
          ))}
        </div>
      </div>
    </div>
  );
};
