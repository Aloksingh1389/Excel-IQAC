import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  Users, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  FileText, 
  ArrowRight,
  Eye
} from 'lucide-react';

const ICON_MAP = {
  Building2,
  GraduationCap,
  BookOpen,
  Briefcase,
  Users,
  Award,
  ShieldCheck,
  Sparkles,
  FileText,
};

export const ReportCard = ({
  report,
  isFavorite = false,
  onToggleFavorite = () => {},
  onQuickGenerate = () => {},
}) => {
  const IconComponent = ICON_MAP[report.icon] || FileText;

  const CATEGORY_COLORS = {
    INSTITUTIONAL: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    ACADEMIC: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    RESEARCH: 'bg-purple-50 text-purple-700 border-purple-200',
    PLACEMENT: 'bg-blue-50 text-blue-700 border-blue-200',
    FACULTY: 'bg-amber-50 text-amber-800 border-amber-200',
    STUDENT: 'bg-pink-50 text-pink-700 border-pink-200',
    IQAC: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const badgeStyle = CATEGORY_COLORS[report.category] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <Card className="p-5 flex flex-col justify-between space-y-4 border-slate-200/90 hover:border-indigo-200 transition-all hover:shadow-xs group">
      <div className="space-y-3">
        {/* Top bar with category & favorite star */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeStyle}`}>
            {report.category}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(report.id);
            }}
            title={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
            className="text-slate-300 hover:text-amber-500 transition-colors p-1"
          >
            <Star
              className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
            />
          </button>
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-indigo-600 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
            <IconComponent className="w-5 h-5" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
              {report.name}
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {report.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer with formats & Generate button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Formats:</span>
          {report.availableFormats.map((fmt) => (
            <span
              key={fmt}
              className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
            >
              {fmt}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <Link to={`/director/reports/generate?reportType=${report.id}`}>
            <Button variant="primary" size="xs" icon={ArrowRight}>
              Generate
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
