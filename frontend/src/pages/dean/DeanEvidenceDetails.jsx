import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS, hasDeanPermission } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

export const DeanEvidenceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [sending, setSending] = useState(false);

  const canComment = hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_EVIDENCE_COMMENT);

  useEffect(() => {
    let cancelled = false;
    if (!user || !id) return undefined;
    setLoading(true);
    setError(null);
    deanPortalService.getDeanEvidenceById(id, user)
      .then((res) => { if (!cancelled) setRecord(res?.data || null); })
      .catch((e) => { if (!cancelled) setError(e?.message || 'Failed to load evidence.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, id]);

  const submit = async () => {
    setMsg(null); setErr(null); setSending(true);
    try {
      const res = await deanPortalService.commentDeanEvidence(id, comment, user);
      setMsg(res?.message || 'Evidence comment recorded.');
      setComment('');
    } catch (e) { setErr(e?.message || 'Failed to post comment.'); }
    finally { setSending(false); }
  };

  if (!hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_EVIDENCE_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view evidence.</div>;
  if (loading) return <Loader message="Loading evidence details..." />;
  if (error) {
    const denied = /outside your assigned scope/i.test(error);
    return (
      <div className="space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{denied ? 'Access denied: this record belongs to a department outside your assigned scope.' : error}</div>
        <Link to="/dean/evidence" className="text-xs font-bold text-indigo-700 underline">Back to Evidence</Link>
      </div>
    );
  }
  if (!record) return <EmptyState title="Not found" description="Evidence record not found." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <Link to="/dean/evidence" className="text-xs font-bold text-indigo-700 underline">← Evidence</Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">{record.title || record.id}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{record.departmentCode} • {record.status}</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-3 text-xs font-medium">
        View-only monitoring: verification and review decisions stay with department and IQAC roles. Deans may add advisory comments only.
      </div>
      <Card className="p-4 sm:p-6 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Evidence Detail</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[['Type', record.type], ['Criterion', record.criterion], ['Uploaded By', record.uploadedBy], ['Uploaded At', record.uploadedAt || record.createdAt], ['File', record.fileName || record.fileUrl], ['Academic Year', record.academicYear]].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-lg p-2.5"><dt className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">{k}</dt><dd className="font-semibold text-slate-800 mt-0.5 break-words">{v || '—'}</dd></div>
          ))}
        </dl>
        {record.description && <p className="text-xs text-slate-600 leading-relaxed">{record.description}</p>}
      </Card>
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Dean Comment</h3>
        {msg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs font-medium">{msg}</div>}
        {err && <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs font-medium">{err}</div>}
        {!canComment ? <p className="text-xs text-slate-500">You do not have permission to comment on evidence.</p> : (
          <div className="space-y-2">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Add an advisory comment..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="button" disabled={sending || !comment.trim()} onClick={submit} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold">Post Comment</button>
          </div>
        )}
      </Card>
    </div>
  );
};
