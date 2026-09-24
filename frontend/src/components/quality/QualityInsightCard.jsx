import React from 'react';
import { Card } from '../common/Card';
import { Lightbulb, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

export const QualityInsightCard = ({ insights = [] }) => {
  return (
    <Card className="p-4 sm:p-5 space-y-3 border-indigo-200 bg-gradient-to-br from-indigo-50/30 via-white to-white">
      <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Institutional Quality Management Insights
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Deterministic rule-based analysis of academic performance, compliance & trends
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="p-3 rounded-xl border border-slate-200 bg-white space-y-1 text-xs shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{ins.title}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">{ins.content}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
