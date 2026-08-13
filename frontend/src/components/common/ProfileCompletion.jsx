import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfileCompletion = ({
  percentage = 85,
  completedItems = [
    'Personal Information',
    'Educational Qualifications',
    'Experience Details',
  ],
  missingItems = [
    'Research Profile & Grants',
    'Identity Documents',
  ],
  showLink = true,
  className = '',
}) => {
  const getProgressColor = (pct) => {
    if (pct >= 90) return 'bg-emerald-500';
    if (pct >= 70) return 'bg-blue-600';
    if (pct >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Profile Completion</h4>
          <p className="text-xs text-slate-500">Required for institutional accreditation dossiers</p>
        </div>
        <span className="text-lg font-bold text-slate-900">{percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
        <div className="space-y-1.5">
          <span className="font-semibold text-slate-700 block">Completed</span>
          {completedItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <span className="font-semibold text-slate-700 block">Pending</span>
          {missingItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-slate-500">
              <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {showLink && (
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          Complete Profile Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
};
