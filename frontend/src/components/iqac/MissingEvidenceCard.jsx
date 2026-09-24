import React from 'react';
import { Card } from '../common/Card';
import { AlertCircle, FilePlus, ChevronRight } from 'lucide-react';

export const MissingEvidenceCard = ({ missingList = [], onOpenUpload }) => {
  return (
    <Card className="p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Missing Supporting Evidence Requirements ({missingList.length})
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Records requiring proof document upload for NAAC & IQAC compliance
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800">
          Action Required
        </span>
      </div>

      <div className="space-y-2.5">
        {missingList.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-3">
            All records in your department scope have required evidence attached!
          </p>
        ) : (
          missingList.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.recordTitle}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-200 text-amber-900">
                    {item.departmentCode}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Required: <strong>{item.requiredTypeLabel}</strong> &bull; Submitter: {item.submittedBy}
                </p>
              </div>

              {onOpenUpload && (
                <button
                  type="button"
                  onClick={() => onOpenUpload(item)}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shrink-0"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Upload Proof</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
