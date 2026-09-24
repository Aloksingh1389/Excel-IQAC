import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS, hasDeanPermission } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

export const DeanSubmissionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [actionMsg, setActionMsg] = useState(null);
  const [actionErr, setActionErr] = useState(null);
  const [sending, setSending] = useState(false);

  const canComment = hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_SUBMISSION_COMMENT);
  const canApprove = hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_SUBMISSION_APPROVE);
  const canReturn = hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_SUBMISSION_RETURN);
  const canReject = hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_SUBMISSION_REJECT);

  useEffect(() => {
    let cancelled = false;
    if (!user || !id) return undefined;
    setLoading(true);
    setError(null);
    deanPortalService.getDeanSubmissionById(id, user)
      .then((res) => { if (!cancelled) { setRecord(res?.data || null); setEvidence(res?.evidence || []); } })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load submission.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, id]);

  const submitComment = async () => {
    setActionMsg(null); setActionErr(null); setSending(true);
    try {
      const res = await deanPortalService.commentDeanSubmission(id, comment, user);
      setActionMsg(res?.message || 'Comment recorded.');
      setComment('');
    } catch (err) { setActionErr(err?.message || 'Failed to post comment.'); }
    finally { setSending(false); }
  };

  const moderate = async (action) => {
    setActionMsg(null); setActionErr(null);
    try {
      const payload = action === 'APPROVE' ? { comment: comment || 'Approved by Dean.' } : { reason: comment };
      const res = await deanPortalService.moderateDeanSubmission(id, action, payload, user);
      setActionMsg(res?.message || `${action} completed.`);
    } catch (err) { setActionErr(err?.message || `${action} failed.`); }
  };

  if (!hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_SUBMISSION_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view submissions.</div>;
  if (loading) return <Loader message="Loading submission details..." />;
  if (error) {
    const denied = /outside your assigned scope/i.test(error);
    return (
      <div className="space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">
          {denied ? 'Access denied: this record belongs to a department outside your assigned scope.' : error}
        </div>
        <Link to="/dean/review" className="text-xs font-bold text-indigo-700 underline">Back to Review Center</Link>
      </div>
    );
  }
  if (!record) return <EmptyState title="Not found" description="Submission not found." />;

  const history = record.history || record.workflowHistory || record.auditTrail || [];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <Link to="/dean/review" className="text-xs font-bold text-indigo-700 underline">← Review Center</Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">{record.submissionId} — {record.title}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{record.departmentCode} • {record.status} • {record.typeLabel || record.type}</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-3 text-xs font-medium">
        Monitoring role: Deans review cross-department quality. Workflow decisions remain at department/IQAC level unless explicitly permitted.
      </div>

      <Card className="p-4 sm:p-6 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Submission Data</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[['Submitted By', record.submittedBy], ['Role', (record.submittedByRole || '').replace(/_/g, ' ')], ['Submitted At', record.submittedAt || record.createdAt], ['Priority', record.priority], ['Academic Year', record.academicYear]].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-lg p-2.5"><dt className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">{k}</dt><dd className="font-semibold text-slate-800 mt-0.5">{v || '—'}</dd></div>
          ))}
        </dl>
        {record.description && <p className="text-xs text-slate-600 leading-relaxed">{record.description}</p>}
        {record.data && typeof record.data === 'object' && (
          <div className="text-xs space-y-1">{Object.entries(record.data).map(([k, v]) => <p key={k} className="text-slate-700"><span className="font-bold">{k}:</span> {String(v)}</p>)}</div>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Linked Evidence ({(evidence || []).length})</h3>
        {(evidence || []).length === 0 ? <p className="text-xs text-slate-500">No linked evidence.</p> : (
          <ul className="text-xs space-y-1.5">{(evidence || []).map((e) => <li key={e.id} className="flex justify-between border border-slate-200 rounded-lg p-2.5"><span className="font-bold text-slate-800">{e.title || e.id}</span><span className="text-slate-500">{e.status}</span></li>)}</ul>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">History Timeline</h3>
        {history.length === 0 ? <p className="text-xs text-slate-500">No history available.</p> : (
          <ul className="space-y-2">{history.map((h, i) => <li key={h.id || i} className="text-xs text-slate-600 border-l-2 border-indigo-200 pl-3"><span className="font-bold text-slate-800">{h.action || h.status}</span> — {h.comment || h.reason || h.message}<span className="block text-[10px] text-slate-400">{h.timestamp || h.createdAt} • {h.actorName || h.by}</span></li>)}</ul>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Dean Comment</h3>
        {actionMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs font-medium">{actionMsg}</div>}
        {actionErr && <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs font-medium">{actionErr}</div>}
        {!canComment ? <p className="text-xs text-slate-500">You do not have permission to comment on submissions.</p> : (
          <div className="space-y-2">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Add a monitoring comment for the department..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={sending || !comment.trim()} onClick={submitComment} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold">Post Comment</button>
              {canApprove && <button type="button" onClick={() => moderate('APPROVE')} className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">Approve</button>}
              {canReturn && <button type="button" onClick={() => moderate('RETURN')} className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold">Return</button>}
              {canReject && <button type="button" onClick={() => moderate('REJECT')} className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold">Reject</button>}
            </div>
            {!canApprove && !canReturn && !canReject && <p className="text-[11px] text-slate-500">Moderation actions are not enabled for your Dean profile (monitoring role).</p>}
          </div>
        )}
      </Card>
    </div>
  );
};
