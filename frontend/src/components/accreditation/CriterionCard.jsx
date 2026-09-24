import React from 'react';
import { Card } from '../common/Card';
import { QualityStatusBadge } from '../quality/QualityStatusBadge';
import { Award, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CriterionCard = ({ criterion }) => {
  const readiness = criterion.readiness || {
    readinessScore: 80,
    completionPercentage: 82,
    evidenceCompleteness: 78,
    status: 'GOOD',
    metricsCount: 10,
    readyMetricsCount: 8,
    gapsCount: 2,
  };

  return (
    <Card className="p-5 space-y-4 hover:border-indigo-300 transition-all duration-200 shadow-2xs group bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-black text-indigo-900 text-sm">{criterion.code}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-900">
              Weightage: {criterion.weightage || 100} Pts
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition leading-snug">
            {criterion.name}
          </h3>
        </div>

        <QualityStatusBadge score={readiness.readinessScore} rating={readiness.status} />
      </div>

      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
        {criterion.description}
      </p>

      {/* Progress metrics */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
          <span>Readiness Completion</span>
          <span className="text-indigo-950 font-black">{readiness.readinessScore}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${readiness.readinessScore}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-center">
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase">Ready Metrics</p>
          <p className="font-black text-emerald-800">{readiness.readyMetricsCount} / {readiness.metricsCount || 10}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase">Evidence %</p>
          <p className="font-bold text-teal-800">{readiness.evidenceCompleteness}%</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase">Open Gaps</p>
          <p className="font-bold text-rose-700">{readiness.gapsCount}</p>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-end">
        <Link
          to={`/accreditation/criteria/${criterion.id}`}
          className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition"
        >
          <span>Inspect Criterion & Metrics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};
