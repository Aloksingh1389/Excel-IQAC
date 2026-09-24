import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDeanPortal } from '../../hooks/useDeanPortal';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const inputCls = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

export const DeanNotifications = () => {
  const { user } = useAuth();
  const { assignedDepartments, can } = useDeanPortal(user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [readFilter, setReadFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [form, setForm] = useState({ title: '', message: '', priority: 'MEDIUM', departmentCodes: [], recipientKind: 'HOD', dueDate: '' });
  const [sendMsg, setSendMsg] = useState(null);
  const [sendErr, setSendErr] = useState(null);
  const [sending, setSending] = useState(false);

  const fetchList = async (u) => {
    const res = await deanPortalService.getDeanNotifications(u);
    return res?.data || res?.notifications || [];
  };

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    fetchList(user)
      .then((d) => { if (!cancelled) setItems(d); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load notifications.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const filtered = useMemo(() => (items || []).filter((n) => {
    if (deptFilter !== 'ALL' && (n.departmentCode || n.department) !== deptFilter) return false;
    if (priorityFilter !== 'ALL' && (n.priority || '').toUpperCase() !== priorityFilter) return false;
    if (readFilter !== 'ALL') {
      const read = n.read || n.status === 'READ';
      if (readFilter === 'READ' && !read) return false;
      if (readFilter === 'UNREAD' && read) return false;
    }
    return true;
  }), [items, deptFilter, readFilter, priorityFilter]);

  const toggleDept = (code) => {
    setForm((f) => ({ ...f, departmentCodes: f.departmentCodes.includes(code) ? f.departmentCodes.filter((c) => c !== code) : [...f.departmentCodes, code] }));
  };

  const send = async (e) => {
    e.preventDefault();
    setSendMsg(null); setSendErr(null); setSending(true);
    try {
      const res = await deanPortalService.sendDeanNotification({
        title: form.title,
        message: form.message,
        priority: form.priority,
        departmentCodes: form.departmentCodes,
        recipientKind: form.recipientKind,
        dueDate: form.dueDate || undefined,
      }, user);
      setSendMsg(res?.message || 'Notification sent.');
      setForm({ title: '', message: '', priority: 'MEDIUM', departmentCodes: [], recipientKind: 'HOD', dueDate: '' });
      setItems(await fetchList(user));
    } catch (err) { setSendErr(err?.message || 'Failed to send notification.'); }
    finally { setSending(false); }
  };

  if (!can(DEAN_PERMISSIONS.DEAN_NOTIFICATION_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view notifications.</div>;
  if (loading) return <Loader message="Loading notifications..." />;
  if (error) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Communicate with HODs, coordinators and department staff in your scope</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className={inputCls}>
              <option value="ALL">All depts</option>
              {(assignedDepartments || []).map((d) => <option key={d.code} value={d.code}>{d.code}</option>)}
            </select>
            <select value={readFilter} onChange={(e) => setReadFilter(e.target.value)} className={inputCls}>
              {['ALL', 'READ', 'UNREAD'].map((s) => <option key={s} value={s}>{s === 'ALL' ? 'All' : s}</option>)}
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={inputCls}>
              {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => <option key={s} value={s}>{s === 'ALL' ? 'All priority' : s}</option>)}
            </select>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Notifications ({filtered.length})</h3>
          {filtered.length === 0 ? <EmptyState title="No notifications" description="No notifications match the current filters." /> : (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {filtered.map((n, i) => (
                <li key={n.id || i} className="border border-slate-200 rounded-lg p-3 text-xs">
                  <div className="flex justify-between gap-2"><span className="font-bold text-slate-800">{n.title}</span><span className="font-black text-[10px] uppercase text-slate-500">{n.priority || ''}</span></div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{n.departmentCode || n.department || ''} • {n.createdAt || ''} • {n.status || ''}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Send Notification</h3>
          {sendMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs font-medium">{sendMsg}</div>}
          {sendErr && <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs font-medium">{sendErr}</div>}
          {!can(DEAN_PERMISSIONS.DEAN_NOTIFICATION_SEND) ? <p className="text-xs text-slate-500">You do not have permission to send notifications.</p> : (
            <form onSubmit={send} className="space-y-2">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Title" className={`${inputCls} w-full`} />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={4} placeholder="Message..." className={`${inputCls} w-full`} />
              <div className="grid grid-cols-2 gap-2">
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={inputCls}>
                  {['HIGH', 'MEDIUM', 'LOW'].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={form.recipientKind} onChange={(e) => setForm({ ...form, recipientKind: e.target.value })} className={inputCls}>
                  <option value="HOD">HOD</option>
                  <option value="IQAC_COORDINATOR">IQAC Coordinator</option>
                  <option value="DEPARTMENT_STAFF">Department Staff</option>
                </select>
              </div>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className={`${inputCls} w-full`} />
              <div>
                <p className="text-[11px] font-bold text-slate-600 mb-1.5">Departments (assigned only)</p>
                <div className="flex flex-wrap gap-2">
                  {(assignedDepartments || []).map((d) => (
                    <label key={d.code} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={form.departmentCodes.includes(d.code)} onChange={() => toggleDept(d.code)} className="accent-indigo-600" />
                      {d.code}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={sending || !form.title.trim() || !form.message.trim()} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold">Send</button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
