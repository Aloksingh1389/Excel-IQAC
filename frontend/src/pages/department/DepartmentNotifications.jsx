import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { DepartmentNotificationComposer } from '../../components/department';

export const DepartmentNotifications = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await departmentPortalService.getDepartmentNotifications(user);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user?.id, user?.role, user?.departmentCode]);

  const handleSend = async (form) => {
    setSending(true);
    setConfirm(null);
    try {
      const res = await departmentPortalService.sendDepartmentNotification({ ...form, recipientScope: form.recipientScope || 'OWN_DEPARTMENT' }, user);
      setConfirm({ type: 'success', text: res.message || `Notification "${form.title}" sent to department staff.` });
      await load();
    } catch (err) {
      setConfirm({ type: 'error', text: err?.message || 'Failed to send notification.' });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader message="Loading notifications..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Notifications</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Notify your department staff (own department only)</p>
      </div>
      {confirm && (
        <div className={`p-3 rounded-xl border text-xs font-semibold ${confirm.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`} role="alert">{confirm.text}</div>
      )}
      <DepartmentNotificationComposer onSend={handleSend} sending={sending} />
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-base font-bold text-slate-900">Sent History ({items.length})</h3>
        {items.length === 0 ? (
          <EmptyState title="No notifications sent" description="Notifications you send to department staff will appear here." />
        ) : (
          <ul className="space-y-2">
            {items.map((n, i) => (
              <li key={n.id || i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs">
                <p className="font-bold text-slate-900">{n.title || n.subject || `Notification ${i + 1}`}</p>
                <p className="text-slate-600">{n.message || n.body || ''}</p>
                <p className="text-[10px] text-slate-400 pt-0.5">{n.sentAt || n.createdAt || n.timestamp || ''}{n.priority ? ` · ${n.priority}` : ''}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
