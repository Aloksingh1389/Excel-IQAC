import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import {
  MANAGEMENT_PERMISSIONS, MANAGEMENT_PORTAL_CONFIG, hasManagementPermission,
} from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const Alert = ({ message, tone = 'error' }) => (
  <div className={`${tone === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'} border rounded-xl p-4 text-sm font-medium`}>{message}</div>
);

export const ManagementSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [deans, setDeans] = useState([]);
  const [deptCodes, setDeptCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [selectedDean, setSelectedDean] = useState('');
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const [sRes, deanRes, deptRes] = await Promise.all([
          managementPortalService.getManagementSettings(user),
          managementPortalService.getDeanRoster(user),
          managementPortalService.getDepartmentOverview(user),
        ]);
        if (!cancelled) {
          setSettings(sRes.data);
          const list = Array.isArray(deanRes.data) ? deanRes.data : [];
          setDeans(list);
          setDeptCodes((Array.isArray(deptRes.data) ? deptRes.data : []).map((d) => d.code).filter(Boolean));
          if (list.length > 0) {
            setSelectedDean(list[0].email);
            setSelectedCodes(list[0].assignedDepartmentCodes || []);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load settings.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  if (loading) return <Loader message="Loading management settings..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_SETTINGS_VIEW)) return <Alert message="You do not have permission to view settings. Settings are available to the Technical Director." />;

  const canManageDeans = hasManagementPermission(user, MANAGEMENT_PERMISSIONS.DEAN_ASSIGNMENT_MANAGE);
  const thresholds = settings?.thresholds || {};
  const roleEntries = Object.entries(MANAGEMENT_PORTAL_CONFIG || {});

  const toggleCode = (code) => setSelectedCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));

  const handleSave = async () => {
    setSaving(true);
    setNotice(null);
    setError(null);
    try {
      const res = await managementPortalService.updateDeanAssignment({ deanEmail: selectedDean, departmentCodes: selectedCodes }, user);
      setNotice(res.message || 'Dean assignment updated.');
      const refreshed = await managementPortalService.getDeanRoster(user);
      setDeans(Array.isArray(refreshed.data) ? refreshed.data : []);
    } catch (err) {
      setError(err?.message || 'Failed to update dean assignment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Management Settings</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Read-only configuration snapshot. Changes require authorized technical workflows.</p>
      </div>
      {error && <Alert message={error} />}
      {notice && <Alert tone="ok" message={notice} />}

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Quality Thresholds</h3>
        {Object.keys(thresholds).length === 0 ? <EmptyState title="No thresholds" description="Threshold configuration unavailable." /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(thresholds).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="text-[11px] font-semibold text-slate-500 break-words">{k}</p>
                <p className="font-black text-slate-900">{String(v)}</p>
              </div>
            ))}
          </div>
        )}
        {settings?.note && <p className="text-[11px] text-slate-500 italic">{settings.note}</p>}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Role Permission Matrix</h3>
        {roleEntries.length === 0 ? <EmptyState title="No role data" description="Role matrix unavailable." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Role</th><th className="py-2 pr-3">Label</th><th className="py-2 pr-3">Permissions</th>
            </tr></thead>
            <tbody>{roleEntries.map(([role, cfg]) => (
              <tr key={role} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-bold">{role}</td>
                <td className="py-2 pr-3">{cfg?.label || '—'}</td>
                <td className="py-2 pr-3 text-slate-500">{(cfg?.permissions || []).length} granted</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Dean Assignment Editor</h3>
        {!canManageDeans && <Alert message="Dean assignment management is restricted to the Technical Director. You have view-only access." />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <select value={selectedDean} onChange={(e) => {
            setSelectedDean(e.target.value);
            const d = deans.find((x) => x.email === e.target.value);
            setSelectedCodes(d?.assignedDepartmentCodes || []);
          }} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
            {deans.map((d) => <option key={d.email} value={d.email}>{d.name} ({d.email})</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-600">Assigned departments (multi-select):</p>
          <div className="flex flex-wrap gap-2">
            {deptCodes.map((code) => (
              <label key={code} className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer ${selectedCodes.includes(code) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                <input type="checkbox" className="hidden" checked={selectedCodes.includes(code)} disabled={!canManageDeans} onChange={() => toggleCode(code)} />
                {code}
              </label>
            ))}
          </div>
        </div>
        {canManageDeans ? (
          <button onClick={handleSave} disabled={saving || !selectedDean} className="text-xs font-bold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save dean assignment'}
          </button>
        ) : (
          <p className="text-[11px] text-slate-500">Saving is disabled — dean assignment management requires Technical Director permission.</p>
        )}
      </Card>
    </div>
  );
};
