import React from 'react';
import { Card } from '../common/Card';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

export const AQARValidationSummary = ({ validation = {}, onFinalize, userRole }) => {
  const { status, blockers = [], warnings = [] } = validation;

  const isBlocked = status === 'BLOCKED';

  return (
    <Card className={`p-4 space-y-3 border-2 ${isBlocked ? 'border-rose-300 bg-rose-50/40' : 'border-emerald-200 bg-emerald-50/40'}`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          {isBlocked ? (
            <XCircle className="w-5 h-5 text-rose-600" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              AQAR Report Finalization Readiness
            </h3>
            <p className="text-[11px] font-medium text-slate-600">
              {isBlocked ? 'Critical blockers must be resolved before finalization' : 'All mandatory sections & criteria validated'}
            </p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${
          isBlocked ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
        }`}>
          {status}
        </span>
      </div>

      {blockers.length > 0 && (
        <div className="space-y-1 text-xs text-rose-800 font-semibold">
          <p className="font-bold uppercase text-[10px] text-rose-700">Critical Blockers ({blockers.length})</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            {blockers.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="space-y-1 text-xs text-amber-900 font-semibold">
          <p className="font-bold uppercase text-[10px] text-amber-800">Section Warnings ({warnings.length})</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {onFinalize && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={isBlocked}
            onClick={onFinalize}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
              isBlocked
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Finalize & Lock AQAR Report</span>
          </button>
        </div>
      )}
    </Card>
  );
};
