import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccreditationGaps } from '../../hooks/useAccreditationGaps';
import { AccreditationGapTable } from '../../components/accreditation/AccreditationGapTable';
import { Loader } from '../../components/common/Loader';
import { ArrowLeft, AlertTriangle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccreditationGaps = () => {
  const { user } = useAuth();
  const { gaps, loading } = useAccreditationGaps();

  const [gapTypeFilter, setGapTypeFilter] = useState('ALL');

  if (loading) {
    return <Loader message="Loading NAAC Accreditation Gap Center..." />;
  }

  const filteredGaps = gaps.filter((g) => gapTypeFilter === 'ALL' || g.type === gapTypeFilter);

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
              NAAC Accreditation Gap Analysis Center
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Consolidated workspace identifying missing evidence, data gaps, compliance flags & unassigned metrics
            </p>
          </div>
        </div>

        <div className="relative shrink-0">
          <select
            value={gapTypeFilter}
            onChange={(e) => setGapTypeFilter(e.target.value)}
            className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="ALL">All Gap Types</option>
            <option value="EVIDENCE_GAP">Evidence Gaps</option>
            <option value="DATA_GAP">Data Gaps</option>
            <option value="COMPLIANCE_GAP">Compliance Gaps</option>
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <AccreditationGapTable gaps={filteredGaps} />
    </div>
  );
};
