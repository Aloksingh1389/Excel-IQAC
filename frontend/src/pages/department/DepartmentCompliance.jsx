import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { DEPARTMENT_PERMISSIONS, hasDepartmentPermission } from '../../config/departmentPortalConfig';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { DepartmentComplianceTable } from '../../components/department';

export const DepartmentCompliance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [progress, setProgress] = useState('');
  const [comment, setComment] = useState('');
  const [selected, setSelected] = useState('');
  const [saving, setSaving] = useState(false);

  const canUpdate = hasDepartmentPermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_COMPLIANCE_UPDATE);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await departmentPortalService.getDepartmentCompliance({}, user);
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load compliance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user?.id, user?.role, user?.departmentCode]);

  const save = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await departmentPortalService.updateDepartmentCompliance(selected, { progress: Number(progress), comment }, user);
      setMessage({ type: 'success', text: res.message || 'Compliance progress recorded.' });
      setSelected('');
      setProgress('');
      setComment('');
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading department compliance..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Compliance</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Compliance records for your department</p>
      </div>
      {message && (
        <div className={`p-3 rounded-xl border text-xs font-semibold ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`} role="alert">{message.text}</div>
      )}
      <Card className="p-4 sm:p-6 space-y-4">
        {records.length === 0 ? (
          <EmptyState title="No compliance records" description="No compliance records found for your department." />
        ) : (
          <DepartmentComplianceTable
            records={records}
            onSelect={canUpdate ? (id) => setSelected(String(id)) : undefined}
          />
        )}
        {canUpdate && records.length > 0 && (
          <form onSubmit={save} className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Record Progress Update</h4>
            <div className="flex flex-wrap gap-2">
              <select value={selected} onChange={(e) => setSelected(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold">
                <option value="">Select record...</option>
                {records.map((r) => <option key={r.id} value={r.id}>{r.title || r.requirement || r.id}</option>)}
              </select>
              <input type="number" min={0} max={100} value={progress} onChange={(e) => setProgress(e.target.value)} placeholder="Progress %" className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold w-32" />
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Update comment..." rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium" />
            <button type="submit" disabled={saving || !selected} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer">{saving ? 'Saving...' : 'Record Update'}</button>
          </form>
        )}
      </Card>
    </div>
  );
};
