import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { DEPARTMENT_PERMISSIONS, hasDepartmentPermission } from '../../config/departmentPortalConfig';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
export const DepartmentEvidenceDetails = () => {
  const { evidenceId } = useParams();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reason, setReason] = useState('');
  const [acting, setActing] = useState(false);
  const [message, setMessage] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await departmentPortalService.getDepartmentEvidenceById(evidenceId, user);
      setRecord(res.data);
    } catch (err) {
      setError(err?.message || 'Failed to load evidence record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !evidenceId) return;
    load();
  }, [evidenceId, user?.id, user?.role, user?.departmentCode]);

  const run = async (actionType, payload) => {
    setActing(true);
    setMessage(null);
    try {
      const res = await departmentPortalService.reviewEvidence(evidenceId, actionType, payload, user);
      setMessage({ type: 'success', text: res.message || 'Action completed.' });
      setReason('');
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Action failed.' });
    } finally {
      setActing(false);
    }
  };

  if (loading) return <Loader message="Loading evidence details..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;
  if (!record) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">Evidence record not found in your department.</div>;

  const canReturn = hasDepartmentPermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_EVIDENCE_RETURN);
  const canComment = hasDepartmentPermission(user, DEPARTMENT_PERMISSIONS.DEPARTMENT_EVIDENCE_COMMENT);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{record.title || 'Evidence Details'}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{`${record.evidenceId || record.id} · ${record.status || ''}`}</p>
      </div>
      <Link to="/department/evidence" className="text-xs font-bold text-indigo-700 hover:underline">← Back to Evidence</Link>
      {message && (
        <div className={`p-3 rounded-xl border text-xs font-semibold ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`} role="alert">{message.text}</div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 sm:p-6 space-y-2 lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900">Record</h3>
          <div className="text-xs space-y-1.5">
            <p><span className="font-semibold text-slate-500">Type: </span><span className="font-bold text-slate-900">{record.type || record.evidenceType || '—'}</span></p>
            <p><span className="font-semibold text-slate-500">Uploaded By: </span><span className="font-bold text-slate-900">{record.uploadedBy || '—'}</span></p>
            <p><span className="font-semibold text-slate-500">Status: </span><span className="font-bold text-slate-900">{record.status || '—'}</span></p>
            <p><span className="font-semibold text-slate-500">Submission: </span><span className="font-bold text-slate-900">{record.submissionId || '—'}</span></p>
            {record.description && <p className="text-slate-600">{record.description}</p>}
            {record.fileUrl && <a href={record.fileUrl} target="_blank" rel="noreferrer" className="font-bold text-indigo-700 hover:underline">Open file</a>}
          </div>
        </Card>
        <Card className="p-4 sm:p-6 space-y-3 h-fit">
          <h3 className="text-base font-bold text-slate-900">Department Review</h3>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason / comment..." rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium" />
          <div className="flex flex-wrap gap-2">
            {canReturn && (
              <button type="button" disabled={acting || !reason.trim()} onClick={() => run('RETURN', { reason })} className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer">Return</button>
            )}
            {canComment && (
              <>
                <button type="button" disabled={acting || !reason.trim()} onClick={() => run('RECOMMEND', { comment: reason })} className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer">Recommend Verification</button>
                <button type="button" disabled={acting || !reason.trim()} onClick={() => run('COMMENT', { comment: reason })} className="px-3 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer">Comment</button>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Institution-level verification stays with IQAC. Department action records a recommendation for IQAC review.</p>
        </Card>
      </div>
    </div>
  );
};
