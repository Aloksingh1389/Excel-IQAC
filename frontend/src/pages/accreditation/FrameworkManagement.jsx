import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ACCREDITATION_FRAMEWORKS, NAAC_CRITERIA_DEFINITIONS } from '../../config/accreditationFrameworkConfig';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, ShieldCheck, Award, Settings, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FrameworkManagement = () => {
  const { user } = useAuth();
  const framework = ACCREDITATION_FRAMEWORKS.NAAC;

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
              Accreditation Framework & Criteria Settings
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              IQAC Head workspace for framework configuration, versioning, criteria weightage & metric mapping definitions
            </p>
          </div>
        </div>
      </div>

      {/* Main Framework Card */}
      <Card className="p-5 sm:p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{framework.name} ({framework.shortName})</h2>
              <p className="text-slate-500 font-medium">Framework Version: {framework.version} &bull; Status: Active Prototype</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
            ENABLED & ACTIVE
          </span>
        </div>

        <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border">
          {framework.description}
        </p>

        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-slate-900 text-sm">Configured Criteria Definitions (7 Major Criteria)</h3>

          <div className="space-y-2">
            {NAAC_CRITERIA_DEFINITIONS.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl border bg-white flex items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-indigo-900">{c.code}</span>
                    <span className="font-bold text-slate-900">{c.name}</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{c.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-1 rounded text-[10px] font-black uppercase bg-indigo-50 text-indigo-900">
                    {c.weightage} Pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
