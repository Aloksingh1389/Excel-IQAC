import React from 'react';
import { Card } from '../common/Card';
import { COMPLIANCE_STATUS } from '../../config/complianceConfig';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

export const ComplianceHeatmap = ({ heatmapData = [] }) => {
  const categories = ['DOCUMENTATION', 'FACULTY', 'RESEARCH', 'TRAINING', 'OPERATIONS'];

  const renderCell = (status) => {
    switch (status) {
      case COMPLIANCE_STATUS.COMPLIANT:
        return (
          <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Compliant</span>
          </span>
        );
      case COMPLIANCE_STATUS.PARTIALLY_COMPLIANT:
      case COMPLIANCE_STATUS.IN_PROGRESS:
        return (
          <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Warning</span>
          </span>
        );
      case COMPLIANCE_STATUS.NON_COMPLIANT:
      case COMPLIANCE_STATUS.OVERDUE:
        return (
          <span className="inline-flex items-center gap-1 font-black text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Non-Compliant</span>
          </span>
        );
      default:
        return <span className="text-slate-400 font-medium">N/A</span>;
    }
  };

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Institutional Department Compliance Matrix (Heatmap)
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Cross-departmental view of accreditation, documentation & evidence requirements
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-700 border-b font-bold uppercase tracking-wider">
              <th className="p-3">Department</th>
              {categories.map((cat) => (
                <th key={cat} className="p-3 text-center">
                  {cat}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {heatmapData.map((row) => (
              <tr key={row.departmentCode} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-extrabold text-slate-900">
                  {row.departmentCode}
                </td>
                {categories.map((cat) => (
                  <td key={cat} className="p-3 text-center">
                    {renderCell(row.categories[cat])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
