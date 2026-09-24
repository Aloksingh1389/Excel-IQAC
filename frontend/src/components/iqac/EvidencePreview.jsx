import React from 'react';
import { Card } from '../common/Card';
import { FileText, Download, Eye, ExternalLink, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const EvidencePreview = ({ evidence }) => {
  const toast = useToast();

  if (!evidence) return null;

  const handleDownloadDemo = () => {
    toast.info('Demo mode: Document download will be connected to cloud/file storage in the backend version.');
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Document Artifact Preview
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-100 px-2 py-0.5 rounded">
          {evidence.fileType} Document
        </span>
      </div>

      {/* Mock Document Preview Box (Section 16 requirement) */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800 text-white text-center space-y-3 shadow-inner">
        <div className="w-14 h-14 rounded-2xl bg-white/10 text-indigo-300 flex items-center justify-center mx-auto shadow-sm backdrop-blur-xs">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black tracking-tight">{evidence.fileName}</h4>
          <p className="text-[11px] text-slate-300 font-medium">
            {evidence.fileSize} &bull; Version v{evidence.version} &bull; Uploaded {evidence.uploadedAt}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 max-w-sm mx-auto text-left text-xs text-slate-300 space-y-1">
          <p className="text-[10px] font-bold uppercase text-indigo-400">Mock Document Watermark</p>
          <p className="text-[11px] font-mono text-slate-200">
            [INSTITUTIONAL QUALITY PROOF &bull; VERIFIED ARTIFACT ID: {evidence.evidenceId}]
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-2">
          <button
            type="button"
            onClick={handleDownloadDemo}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center italic">
        Frontend Prototype: Real PDF rendering and cloud document streams will be connected via backend object storage.
      </p>
    </Card>
  );
};
