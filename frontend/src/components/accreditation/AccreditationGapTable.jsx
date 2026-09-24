import React, { useState } from 'react';
import { Card } from '../common/Card';
import { AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccreditationGapTable = ({ gaps = [] }) => {
  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Accreditation Gaps Directory (Evidence, Data & Compliance Gaps)
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Actionable gap analysis linking unverified evidence, missing data & overdue compliance tasks
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scroll text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b font-bold uppercase tracking-wider">
              <th className="p-3">Gap Code</th>
              <th className="p-3">Criterion / Metric</th>
              <th className="p-3">Gap Issue Title</th>
              <th className="p-3 text-center">Gap Type</th>
              <th className="p-3 text-center">Priority</th>
              <th className="p-3">Assigned Owner</th>
              <th className="p-3 text-center">Due Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {gaps.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                  No accreditation gaps detected.
                </td>
              </tr>
            ) : (
              gaps.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-extrabold text-indigo-900">{g.gapCode}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900">{g.criterionCode} ({g.metricCode})</span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800 max-w-xs truncate">{g.title}</td>
                  <td className="p-3 text-center font-bold text-indigo-900">{g.typeLabel}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-100 text-rose-800">
                      {g.priority}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{g.assignedOwner}</td>
                  <td className="p-3 text-center font-bold text-slate-800">{g.dueDate}</td>
                  <td className="p-3 text-right">
                    <Link
                      to={g.targetRoute || '/iqac/action-items'}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                    >
                      <span>Resolve</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
