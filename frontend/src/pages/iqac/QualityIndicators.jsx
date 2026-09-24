import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQualityMonitoring } from '../../hooks/useQualityMonitoring';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { QualityStatusBadge } from '../../components/quality/QualityStatusBadge';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Search, Filter, Award, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QualityIndicators = () => {
  const { user } = useAuth();
  const { indicators, loading } = useQualityMonitoring();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  if (loading) {
    return <Loader message="Loading Institutional Quality Indicators Directory..." />;
  }

  const filtered = indicators.filter((ind) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      ind.code.toLowerCase().includes(q) ||
      ind.name.toLowerCase().includes(q) ||
      ind.description.toLowerCase().includes(q);
    const matchesCat = categoryFilter === 'ALL' || ind.category === categoryFilter;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/quality-monitoring"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Institutional Quality Indicators Master Catalog
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Configuration-driven benchmarks, target thresholds & status parameters across academic categories
            </p>
          </div>
        </div>
      </div>

      <Card className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative shrink-0 w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code, indicator name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Categories</option>
              <option value="FACULTY">Faculty Excellence</option>
              <option value="PUBLICATION">Publications</option>
              <option value="EVIDENCE">Evidence Verification</option>
              <option value="IQAC_OPERATION">IQAC Operations</option>
              <option value="FEEDBACK">Feedback Collection</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((ind) => (
            <div
              key={ind.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 hover:border-indigo-200 transition shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-indigo-900 text-xs">{ind.code}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-700">
                      {ind.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{ind.name}</h3>
                </div>
                <QualityStatusBadge score={ind.currentValue} rating={ind.status} />
              </div>

              <p className="text-xs text-slate-500 font-medium leading-relaxed">{ind.description}</p>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-center">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Current Value</p>
                  <p className="font-black text-indigo-950">{ind.currentValue} {ind.unit === 'PERCENTAGE' ? '%' : ''}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Target Benchmark</p>
                  <p className="font-bold text-emerald-700">{ind.target} {ind.unit === 'PERCENTAGE' ? '%' : ''}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Warning Limit</p>
                  <p className="font-bold text-amber-700">{ind.warningThreshold} {ind.unit === 'PERCENTAGE' ? '%' : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
