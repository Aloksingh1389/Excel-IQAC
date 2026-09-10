import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ChevronRight, 
  ShieldAlert 
} from 'lucide-react';

const SEVERITY_CONFIG = {
  CRITICAL: {
    bg: 'bg-rose-50/80 border-rose-200 text-rose-900',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: AlertOctagon,
    iconColor: 'text-rose-600',
    label: 'Critical Alert',
  },
  WARNING: {
    bg: 'bg-amber-50/80 border-amber-200 text-amber-900',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    label: 'Warning Attention',
  },
  INFO: {
    bg: 'bg-blue-50/80 border-blue-200 text-blue-900',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    label: 'Institutional Notice',
  },
  SUCCESS: {
    bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600',
    label: 'Benchmark Achieved',
  },
};

export const ManagementAttention = ({ alerts = [], title = 'Management Attention System' }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">Automated multi-factor institutional risk detection</p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {alerts.length} Active System Alerts
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {alerts.map((alert) => {
          const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.WARNING;
          const IconComponent = cfg.icon;
          const targetUrl = alert.departmentId
            ? `/director/institution/departments/${alert.departmentId}`
            : '/director/analytics';

          return (
            <Link
              key={alert.id}
              to={targetUrl}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-2 hover:shadow-xs group ${cfg.bg}`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  {alert.departmentId && (
                    <span className="text-[10px] font-mono font-bold text-slate-600">
                      Dept: {alert.departmentId}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.iconColor}`} />
                  <h4 className="text-xs sm:text-sm font-bold leading-snug">{alert.title}</h4>
                </div>

                <p className="text-xs opacity-85 leading-relaxed pl-6">
                  {alert.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end text-xs font-bold gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>{alert.actionLabel || 'View Analysis'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};
