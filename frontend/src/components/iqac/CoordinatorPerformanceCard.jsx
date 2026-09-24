import React from 'react';
import { Card } from '../common/Card';
import { Activity, ShieldCheck } from 'lucide-react';

export const CoordinatorPerformanceCard = ({ performance }) => {
  const perf = performance || {
    staffMonitoringPct: 92,
    submissionTrackingPct: 88,
    evidenceCompletionPct: 81,
    notificationResponsePct: 90,
    overallDeptIQACHealthPct: 87,
  };

  const metrics = [
    { label: 'Staff Monitoring', val: perf.staffMonitoringPct, color: 'bg-indigo-600' },
    { label: 'Submission Tracking', val: perf.submissionTrackingPct, color: 'bg-emerald-600' },
    { label: 'Evidence Completion', val: perf.evidenceCompletionPct, color: 'bg-teal-600' },
    { label: 'Notification Response', val: perf.notificationResponsePct, color: 'bg-amber-600' },
    { label: 'Overall Department IQAC Health', val: perf.overallDeptIQACHealthPct, color: 'bg-indigo-700' },
  ];

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Coordinator Performance Indicators
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-100 px-2 py-0.5 rounded">
          Mock Quality Benchmark
        </span>
      </div>

      <div className="space-y-3">
        {metrics.map((m, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{m.label}</span>
              <span className="font-extrabold text-slate-900">{m.val}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${m.color}`}
                style={{ width: `${m.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
