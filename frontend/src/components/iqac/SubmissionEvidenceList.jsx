import React from 'react';
import { Card } from '../common/Card';
import { EvidenceStatusBadge } from './EvidenceStatusBadge';
import { FileText, Download, Plus, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SubmissionEvidenceList = ({
  evidenceList = [],
  submissionId,
  onOpenUpload,
}) => {
  return (
    <Card className="p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Attached Supporting Evidence Documents ({evidenceList.length})
          </h3>
        </div>

        {onOpenUpload && (
          <button
            type="button"
            onClick={onOpenUpload}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Attach Evidence</span>
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {evidenceList.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-3">
            No verified or supporting evidence attached to this submission.
          </p>
        ) : (
          evidenceList.map((file) => (
            <div
              key={file.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 transition flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 truncate">{file.title || file.fileName}</p>
                    <EvidenceStatusBadge status={file.status} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {file.fileName} &bull; {file.fileSize || '1.5 MB'} &bull; Uploaded by {file.uploadedBy}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/iqac/evidence/${file.id}`}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 font-bold text-[11px] text-slate-700 transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3 text-indigo-600" />
                  <span>Inspect</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
