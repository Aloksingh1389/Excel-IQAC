import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

export const ManagementInsight = ({ insights = [], title = 'Management Decision Insights' }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">Automated institutional intelligence and strategic executive summaries</p>
          </div>
        </div>

        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
          Executive Synthesis
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins) => {
          const isAttention = ins.impact === 'ATTENTION';
          return (
            <div
              key={ins.id}
              className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-2.5 ${
                isAttention
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {ins.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        {ins.category}
                      </span>
                    )}
                    {ins.scope && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        &bull; {ins.scope}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isAttention
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isAttention ? 'Action Required' : 'Positive Momentum'}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {ins.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {ins.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
