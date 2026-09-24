import React from 'react';
import { Building2, Activity } from 'lucide-react';
import { Card, Badge } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

const MiniBar = ({ label, value, suffix = '%' }) => {
  const pct = typeof value === 'number' ? Math.max(0, Math.min(100, value)) : null;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-600 truncate">{label}</span>
        <span className="text-xs font-bold text-slate-800 shrink-0">
          {value === undefined || value === null ? '—' : `${value}${suffix}`}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full bg-slate-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct ?? 0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${pct ?? 0}%` }}
        />
      </div>
    </div>
  );
};

const Tile = ({ label, value, suffix = '' }) => (
  <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 text-center">
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="text-base font-extrabold text-slate-900">
      {value === undefined || value === null ? '—' : `${value}${suffix}`}
    </p>
  </div>
);

export const DeanDepartmentSummary = ({ detail }) => {
  const d = detail && typeof detail === 'object' ? detail : {};
  const dept = d.department && typeof d.department === 'object' ? d.department : {};
  const perf = d.performance && typeof d.performance === 'object' ? d.performance : {};
  const ops = d.operational && typeof d.operational === 'object' ? d.operational : {};
  const quality = d.quality && typeof d.quality === 'object' ? d.quality : {};
  const compliance = d.compliance && typeof d.compliance === 'object' ? d.compliance : {};
  const accred = d.accreditation && typeof d.accreditation === 'object' ? d.accreditation : {};
  const qualityCats = Array.isArray(quality.categories) ? quality.categories : [];
  const criteria = Array.isArray(compliance.criteria ?? accred.criteria) ? (compliance.criteria ?? accred.criteria) : [];
  const activity = Array.isArray(d.recentActivity) ? d.recentActivity : [];
  const summaryText = typeof d.summary === 'string' ? d.summary : d.summary?.text ?? null;

  if (!detail) {
    return (
      <EmptyState
        icon={Building2}
        title="No department detail"
        description="Select a department to view its detailed summary."
      />
    );
  }

  return (
    <div className="space-y-4" aria-label="Department detail summary">
      {summaryText && (
        <Card className="p-4 bg-indigo-50/50 border-indigo-100">
          <p className="text-sm text-slate-700 leading-relaxed">{summaryText}</p>
        </Card>
      )}

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-indigo-600" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-800">Department Information</h3>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          {[
            ['Name', dept.name ?? '—'],
            ['Code', dept.code ?? '—'],
            ['HOD', dept.hodName ?? dept.hod ?? '—'],
            ['Coordinator', dept.coordinatorName ?? dept.coordinator ?? '—'],
            ['Email', dept.email ?? '—'],
            ['Established', dept.established ?? dept.establishedYear ?? '—'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</dt>
              <dd className="text-sm font-semibold text-slate-800 truncate" title={String(v)}>{String(v)}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Performance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <Tile label="Staff" value={perf.staff ?? ops.staff ?? dept.staffCount} />
          <Tile label="Students" value={perf.students ?? ops.students} />
          <Tile label="Pass %" value={perf.passPercentage} suffix={typeof perf.passPercentage === 'number' ? '%' : ''} />
          <Tile label="Placement %" value={perf.placementPercentage} suffix={typeof perf.placementPercentage === 'number' ? '%' : ''} />
          <Tile label="Publications" value={perf.publications} />
          <Tile label="Quality" value={quality.score ?? quality.qualityScore ?? perf.quality} />
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Operational</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <Tile label="Pending reviews" value={ops.pendingReviews} />
          <Tile label="Evidence missing" value={ops.evidenceMissing ?? ops.evidencePending} />
          <Tile label="Submission %" value={ops.submissionCompletion} suffix={typeof ops.submissionCompletion === 'number' ? '%' : ''} />
          <Tile label="Open actions" value={ops.openActions} />
          <Tile label="Overdue" value={ops.overdueActions} />
          <Tile label="Meetings" value={Array.isArray(d.meetings) ? d.meetings.length : ops.meetings} />
        </div>
      </Card>

      {qualityCats.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Quality Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {qualityCats.map((c, i) => (
              <MiniBar
                key={c?.name ?? c?.category ?? i}
                label={c?.name ?? c?.category ?? `Category ${i + 1}`}
                value={c?.score ?? c?.value ?? c?.percentage}
                suffix={typeof (c?.score ?? c?.value ?? c?.percentage) === 'number' ? '' : ''}
              />
            ))}
          </div>
        </Card>
      )}

      {criteria.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Criteria</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {criteria.map((c, i) => (
              <MiniBar
                key={c?.name ?? c?.criterion ?? c?.code ?? i}
                label={c?.name ?? c?.criterion ?? c?.code ?? `Criterion ${i + 1}`}
                value={c?.score ?? c?.value ?? c?.percentage ?? c?.readiness}
              />
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-indigo-600" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
          {activity.length > 0 && <Badge variant="neutral" size="xs">{activity.length}</Badge>}
        </div>
        {activity.length === 0 ? (
          <p className="text-xs text-slate-500">No recent activity recorded.</p>
        ) : (
          <ul className="space-y-2">
            {activity.slice(0, 8).map((a, i) => (
              <li
                key={a?.id ?? i}
                className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                    {a?.title ?? a?.action ?? a?.description ?? a?.text ?? 'Activity'}
                  </p>
                  {(a?.date ?? a?.timestamp ?? a?.createdAt) && (
                    <p className="text-[11px] text-slate-400 font-medium">
                      {String(a.date ?? a.timestamp ?? a.createdAt)}
                    </p>
                  )}
                </div>
                {(a?.status || a?.type) && (
                  <Badge variant="neutral" size="xs">{String(a.status ?? a.type)}</Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
