import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const Alert = ({ message, tone = 'error' }) => (
  <div className={`${tone === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'} border rounded-xl p-4 text-sm font-medium`}>{message}</div>
);

export const ManagementNotifications = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [form, setForm] = useState({ title: '', message: '', priority: 'MEDIUM', recipientScope: 'ALL_DEPARTMENTS' });
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await managementPortalService.getManagementNotifications(user);
      const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      setItems(list);
    } catch (err) {
      setError(err?.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role]);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setNotice(null);
    setError(null);
    try {
      const res = await managementPortalService.sendManagementNotification(form, user);
      setNotice(res.message || 'Notification broadcasted.');
      setForm({ title: '', message: '', priority: 'MEDIUM', recipientScope: 'ALL_DEPARTMENTS' });
      fetchData();
    } catch (err) {
      setError(err?.message || 'Failed to send notification.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader message="Loading notifications..." />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_NOTIFICATION_VIEW)) return <Alert message="You do not have permission to view notifications." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Management Notifications</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Institution-wide broadcasts</p>
      </div>
      {error && <Alert message={error} />}
      {notice && <Alert tone="ok" message={notice} />}

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Broadcast ({items.length})</h3>
        {items.length === 0 ? <EmptyState title="No notifications" description="No notifications sent yet." /> : (
          <ul className="space-y-2 max-h-80 overflow-y-auto">{items.slice(0, 30).map((n, i) => (
            <li key={n.id || i} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{n.title || '(no title)'}</span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">{n.priority || ''}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{n.message || ''}</p>
              <p className="text-[11px] text-slate-400">{n.senderName || ''} • {n.createdAt || ''} • {n.recipientScope || n.status || ''}</p>
            </li>
          ))}</ul>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Send Notification</h3>
        <form onSubmit={handleSend} className="space-y-2">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" rows={3} required
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
              <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option>
            </select>
            <select value={form.recipientScope} onChange={(e) => setForm({ ...form, recipientScope: e.target.value })} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
              <option value="ALL_DEPARTMENTS">All departments</option><option value="DEANS">Deans</option><option value="HODS">HODs</option><option value="COORDINATORS">Coordinators</option>
            </select>
          </div>
          <button type="submit" disabled={sending} className="text-xs font-bold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
            {sending ? 'Sending...' : 'Broadcast notification'}
          </button>
        </form>
      </Card>
    </div>
  );
};
