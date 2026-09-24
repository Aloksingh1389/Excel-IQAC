import React from 'react';
import { Link } from 'react-router-dom';
import { OctagonAlert, TriangleAlert, Info, Building2, ArrowRight } from 'lucide-react';
import { Card, Badge } from '../common/Card';

const SEVERITY = {
  critical: { icon: OctagonAlert, label: 'Critical', badge: 'danger', iconTone: 'text-rose-600' },
  high: { icon: TriangleAlert, label: 'High', badge: 'warning', iconTone: 'text-amber-600' },
  medium: { icon: Info, label: 'Medium', badge: 'info', iconTone: 'text-blue-600' },
};

export const ManagementAttentionList = ({ items }) => {
  const list = Array.isArray(items) ? items : [];

  if (list.length === 0) {
    return (
      <Card className="p-6 text-center" aria-label="Attention items">
        <p className="text-sm font-medium text-slate-600">No attention items. Institution is on track.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2.5" role="list" aria-label="Items needing attention">
      {list.map((item, i) => {
        const sev = SEVERITY[item?.severity] || SEVERITY.medium;
        const Icon = sev.icon;
        const depts = Array.isArray(item?.departments) ? item.departments : [];
        const body = (
          <>
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${sev.iconTone}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {sev.label}
                  </span>
                  {item?.area && (
                    <Badge variant={sev.badge} size="xs">
                      {item.area}
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{item?.text || 'Attention required.'}</p>
                {depts.length > 0 && (
                  <p className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Building2 className="w-3 h-3" aria-hidden="true" />
                    {depts.join(', ')}
                  </p>
                )}
              </div>
              {item?.link && (
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" aria-hidden="true" />
              )}
            </div>
          </>
        );
        const key = item?.id ?? `${item?.area}-${i}`;
        if (item?.link) {
          return (
            <Card key={String(key)} hover className="p-3.5 sm:p-4">
              <Link to={item.link} aria-label={`${sev.label}: ${item.text || item.area || ''}`} className="block">
                {body}
              </Link>
            </Card>
          );
        }
        return (
          <Card key={String(key)} className="p-3.5 sm:p-4" role="listitem">
            {body}
          </Card>
        );
      })}
    </div>
  );
};
