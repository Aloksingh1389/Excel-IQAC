import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { DEPARTMENT_PERMISSIONS, hasDepartmentPermission } from '../../config/departmentPortalConfig';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { DepartmentFilterBar, DepartmentActionTable } from '../../components/department';

export const DepartmentActionItems = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [progress, setProgress] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const status = searchParams.get('status') || '';
  const canUpdate = hasDepartmentPermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_ACTION_UPDATE);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await departmentPortalService.getDepartmentActionItems({ status: status || undefined }, user);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load action items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user?.id, user?.role, user?.departmentCode, status]);

  const openEdit = (item) => {
    setEditing(item);
    setProgress(item.progress ?? 0);
    setComment('');
    setMessage(null);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await departmentPortalService.updateDepartmentActionItem(editing.id, Number(progress), comment, user);
      setMessage({ type: 'success', text: res.message || 'Progress updated.' });
      setEditing(null);
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading action items..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  const displayed = query.trim()
    ? items.filter((a) => `${a.title || ''} ${a.assignedTo || a.assignee || ''}`.toLowerCase().includes(query.toLowerCase().trim()))
    : items;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Action Items</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Action items assigned in your department</p>
      </div>
      {message && (
        <div className={`p-3 rounded-xl border text-xs font-semibold ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`} role="alert">{message.text}</div>
      )}
      <Card className="p-4 sm:p-6 space-y-4">
        <DepartmentFilterBar
          search={query}
          onSearchChange={setQuery}
          searchPlaceholder="Filter action items..."
          filters={[{ key: 'status', label: 'Status', value: status, options: ['OPEN', 'IN_PROGRESS', 'OVERDUE', 'COMPLETED'] }]}
          onFilterChange={(_key, value) => {
            const next = new URLSearchParams(searchParams);
            if (!value) next.delete('status');
            else next.set('status', value);
            setSearchParams(next);
          }}
        />
        {displayed.length === 0 ? (
          <EmptyState title="No action items found" description="No action items match the current filter." />
        ) : (
          <DepartmentActionTable
            items={displayed}
            onSelect={canUpdate ? (id) => {
              const found = items.find((a) => String(a.id) === String(id));
              if (found) openEdit(found);
            } : undefined}
          />
        )}
        {editing && canUpdate && (
          <form onSubmit={save} className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Update: {editing.title || editing.id}</h4>
            <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Progress (%)
              <input type="number" min={0} max={100} value={progress} onChange={(e) => setProgress(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold" />
            </label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Progress comment..." rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium" />
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer">{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer">Cancel</button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
