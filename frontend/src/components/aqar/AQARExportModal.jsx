import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { X, Printer, FileText, Download } from 'lucide-react';
import { exportService } from '../../services/exportService';

export const AQARExportModal = ({ isOpen = false, onClose, report }) => {
  const [format, setFormat] = useState('PRINT');
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includeValidation, setIncludeValidation] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !report) return null;

  const handleExport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      exportService.exportReport(report, format, { includeEvidence, includeValidation });
      onClose();
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <Card className="w-full max-w-md p-6 space-y-5 bg-white shadow-2xl border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Export / Print AQAR Report
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {report.reportId} &bull; Academic Year: {report.academicYear}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleExport} className="space-y-4 text-xs">
          <div className="space-y-2">
            <label className="block font-bold text-slate-700">Export Format</label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('PRINT')}
                className={`p-3 rounded-xl border font-bold text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                  format === 'PRINT' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-200 text-slate-700'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>Browser Print</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('PDF')}
                className={`p-3 rounded-xl border font-bold text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                  format === 'PDF' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-200 text-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>PDF Export</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('WORD')}
                className={`p-3 rounded-xl border font-bold text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                  format === 'WORD' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-200 text-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Word (.docx)</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 font-semibold text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEvidence}
                onChange={(e) => setIncludeEvidence(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Include Evidence Traceability Appendix</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeValidation}
                onChange={(e) => setIncludeValidation(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Include Report Validation Metadata</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading} icon={Download}>
              {format === 'PRINT' ? 'Print Report' : 'Export File'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
