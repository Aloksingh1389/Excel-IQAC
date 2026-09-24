import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
const STAGES = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'IQAC VERIFICATION'];

export const DepartmentSubmissionReview = () => {
  const { submissionId } = useParams();
  const { user } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [action, setAction] = useState('APPROVE');
  const [reason, setReason] = useState('');
  const [correction, setCorrection] = useState('');
  const [acting, setActing] = useState(false);
  const [message, setMessage] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await departmentPortalService.getDepartmentSubmissionById(submissionId, user);
      setSubmission(res.data);
      setEvidence(Array.isArray(res.evidence) ? res.evidence : []);
    } catch (err) {
      setError(err?.message || 'Failed to load submission.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !submissionId) return;
    load();
  }, [submissionId, user?.id, user?.role, user?.departmentCode]);

  const handleAction = async (e) => {
    e.preventDefault();
    setActing(true);
    setMessage(null);
    try {
      const payload = action === 'RETURN'
        ? { reason, correction }
        : (action === 'REJECT' ? { reason } : { comment: reason });
      const res = await departmentPortalService.reviewSubmission(submissionId, action, payload, user);
      setMessage({ type: 'success', text: res.message || 'Action completed.' });
      setReason('');
      setCorrection('');
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Action failed.' });
    } finally {
      setActing(false);
    }
  };

  if (loading) return <Loader message="Loading submission review..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;
  if (!submission) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">Submission not found in your department.</div>;

  const history = Array.isArray(submission.history) ? submission.history : [];
  const dataEntries = submission.data && typeof submission.data === 'object' ? Object.entries(submission.data) : [];
  const actions = ['APPROVE', 'RETURN', 'REJECT', 'COMMENT', 'REQUEST_EVIDENCE'];
  const allowed = (a) => {
    try { return departmentPortalService.canReviewAction(submission, a, user); }
    catch { return false; }
  };
  const visibleActions = actions.filter((a) => {
    if (['APPROVE', 'RETURN', 'REJECT'].includes(a)) return allowed(a);
    return allowed(a);
  });
  const needsReason = ['RETURN', 'REJECT'].includes(action);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{submission.title || 'Submission Review'}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{`${submission.submissionId || submission.id} · ${submission.status || ''}`}</p>
      </div>
      <Link to="/department/review" className="text-xs font-bold text-indigo-700 hover:underline">← Back to Review Center</Link>
      {message && (
        <div className={`p-3 rounded-xl border text-xs font-semibold ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`} role="alert">{message.text}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 sm:p-6 space-y-2">
            <h3 className="text-base font-bold text-slate-900">Submission</h3>
            <div className="text-xs space-y-1.5">
              <p><span className="font-semibold text-slate-500">Type: </span><span className="font-bold text-slate-900">{submission.type || submission.typeLabel || '—'}</span></p>
              <p><span className="font-semibold text-slate-500">Submitted By: </span><span className="font-bold text-slate-900">{submission.submittedBy || '—'}</span></p>
              <p><span className="font-semibold text-slate-500">Status: </span><span className="font-bold text-slate-900">{submission.status || '—'}</span></p>
              <p><span className="font-semibold text-slate-500">Priority: </span><span className="font-bold text-slate-900">{submission.priority || '—'}</span></p>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 space-y-2">
            <h3 className="text-base font-bold text-slate-900">Data Fields</h3>
            {dataEntries.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">No data fields available.</p>
            ) : (
              <dl className="text-xs space-y-1.5">
                {dataEntries.map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0">
                    <dt className="font-semibold text-slate-500 shrink-0">{k}</dt>
                    <dd className="font-bold text-slate-900 text-right break-words">{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Card>

          <Card className="p-4 sm:p-6 space-y-2">
            <h3 className="text-base font-bold text-slate-900">Evidence ({evidence.length})</h3>
            {evidence.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">No linked evidence.</p>
            ) : (
              <ul className="space-y-1.5 text-xs">
                {evidence.map((e) => (
                  <li key={e.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800">{e.title || e.evidenceId || e.id}</span>
                    <span className="font-bold text-slate-600">{e.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-4 sm:p-6 space-y-2">
            <h3 className="text-base font-bold text-slate-900">Workflow Timeline</h3>
            <ol className="flex flex-wrap gap-1.5 text-[10px] font-black uppercase tracking-wider">
              {STAGES.map((s) => {
                const active = (submission.status || '').toUpperCase() === s || (s === 'APPROVED' && ['APPROVED', 'RETURNED', 'REJECTED'].includes((submission.status || '').toUpperCase()));
                return <li key={s} className={`px-2 py-1 rounded-md border ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{s}</li>;
              })}
            </ol>
            <h4 className="text-xs font-bold text-slate-700 pt-2">History ({history.length})</h4>
            {history.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">No history recorded.</p>
            ) : (
              <ul className="space-y-1.5 text-xs">
                {history.map((h, i) => (
                  <li key={h.id || i} className="p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                    <p className="font-semibold text-slate-800">{h.action || h.status || 'Update'}</p>
                    <p className="text-[10px] text-slate-400">{h.timestamp || h.createdAt || ''}{h.actorName ? ` · ${h.actorName}` : ''}</p>
                    {(h.reason || h.comment) && <p className="text-slate-600">{h.reason || h.comment}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card className="p-4 sm:p-6 space-y-3 h-fit">
          <h3 className="text-base font-bold text-slate-900">Review Actions</h3>
          {visibleActions.length === 0 ? (
            <p className="text-xs text-slate-500 font-medium">No review actions available for this submission.</p>
          ) : (
            <form onSubmit={handleAction} className="space-y-3">
              <select value={action} onChange={(e) => setAction(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold">
                {visibleActions.map((a) => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
              </select>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} required={needsReason} placeholder={needsReason ? 'Reason (required)...' : 'Comment...'} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium" />
              {action === 'RETURN' && (
                <input value={correction} onChange={(e) => setCorrection(e.target.value)} required placeholder="Required correction (required)..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium" />
              )}
              <button type="submit" disabled={acting} className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer">
                {acting ? 'Submitting...' : `Submit ${action.replace(/_/g, ' ')}`}
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
