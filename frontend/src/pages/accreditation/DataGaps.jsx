import React from 'react';
import { useAccreditationGaps } from '../../hooks/useAccreditationGaps';
import { AccreditationGapTable } from '../../components/accreditation/AccreditationGapTable';
import { Loader } from '../../components/common/Loader';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DataGaps = () => {
  const { gaps, loading } = useAccreditationGaps();

  if (loading) {
    return <Loader message="Loading NAAC Data Gap Analysis..." />;
  }

  const dataGaps = gaps.filter((g) => g.type === 'DATA_GAP');

  return (
    <div className="space-y-6">
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
              NAAC Criteria Data Gap Analysis
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Metrics with missing source data inputs, incomplete records or pending staff resubmissions
            </p>
          </div>
        </div>
      </div>

      <AccreditationGapTable gaps={dataGaps} />
    </div>
  );
};
