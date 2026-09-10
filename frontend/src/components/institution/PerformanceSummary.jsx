import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { TrendingUp, TrendingDown, Activity, CheckCircle2 } from 'lucide-react';

export const PerformanceSummary = ({ performance = [] }) => {
  if (!performance || performance.length === 0) return null;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Institution Performance Summary</h3>
            <p className="text-xs text-slate-500">Year-over-year institutional benchmarking across key performance indicators</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4 rounded-l-lg">Metric Indicator</th>
              <th className="py-3 px-4">Current Value</th>
              <th className="py-3 px-4">Previous Year</th>
              <th className="py-3 px-4">Change</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Assessment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {performance.map((item, idx) => {
              const isPositive = item.isPositive !== false;
              return (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.metric}</div>
                    {item.category && (
                      <div className="text-[10px] text-slate-400 font-semibold">{item.category}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">{item.current}</td>
                  <td className="py-3 px-4 text-slate-500">{item.previous}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      {item.change}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Excellent'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'Improving'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
