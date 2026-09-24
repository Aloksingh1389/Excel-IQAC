import React from 'react';
import { Card } from '../common/Card';
import { AlertTriangle, ArrowRight, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StaffAttentionCard = ({ attentionItems = [] }) => {
  if (!attentionItems || attentionItems.length === 0) return null;

  return (
    <Card className="p-4 sm:p-5 space-y-3 bg-rose-50/60 border-2 border-rose-200">
      <div className="flex items-center gap-2 pb-2 border-b border-rose-200/80">
        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-rose-950 leading-tight">
            Attention Required ({attentionItems.length} Action Items)
          </h3>
          <p className="text-[11px] font-semibold text-rose-700">
            Urgent items requiring your response, resubmission or profile update
          </p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {attentionItems.map((item) => (
          <div key={item.id} className="p-3 rounded-xl bg-white border border-rose-200 flex items-center justify-between gap-3">
            <span className="font-bold text-slate-900">{item.title}</span>
            <Link
              to={item.route}
              className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-900 font-bold text-xs bg-rose-100 px-3 py-1 rounded-lg transition shrink-0"
            >
              <span>Resolve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
};
