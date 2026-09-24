import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStaff } from '../../hooks/useStaff';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, RotateCcw, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const STATUS_COLORS = {
  DRAFT: 'bg-amber-50 text-amber-800',
  SUBMITTED: 'bg-blue-50 text-blue-800',
  UNDER_REVIEW: 'bg-violet-50 text-violet-800',
  RETURNED: 'bg-rose-50 text-rose-800',
  APPROVED: 'bg-emerald-50 text-emerald-800',
  VERIFIED: 'bg-emerald-100 text-emerald-900',
};

export const StaffSubmissionDetails = () => {
  const { submissionId } = useParams();
  const { submissions, loading } = useStaff();

  if (loading) return <Loader message="Loading Submission Details..." />;

  const submission = submissions.find((s) => s.id === submissionId);

  if (!submission) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs font-semibold">
        <p>Submission not found or you do not have access to this record.</p>
        <Link to="/staff/submissions" className="mt-3 inline-block text-indigo-600 font-bold hover:underline">← Back to My Submissions</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
        <Link to="/staff/submissions" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900">{submission.title || 'Submission Details'}</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${STATUS_COLORS[submission.status] || 'bg-slate-100 text-slate-700'}`}>
              {submission.status}
            </span>
          </p>
        </div>
      </div>

      {submission.status === 'RETURNED' && (
        <Card className="p-5 space-y-3 bg-rose-50/60 border-2 border-rose-200">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-rose-900">Submission Returned for Correction</h3>
          </div>
          <p className="text-xs font-semibold text-rose-800">
            <span className="font-bold">Return Reason:</span> {submission.returnReason || 'Please review the reviewer comments and make corrections.'}
          </p>
          <p className="text-xs text-rose-700"><span className="font-bold">Reviewer:</span> {submission.reviewerName || 'HOD'}</p>
          <div className="flex gap-2 pt-2">
            <Link to="/staff/submissions/create"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition">
              Edit & Resubmit
            </Link>
          </div>
        </Card>
      )}

      <Card className="p-5 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Submission Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-medium text-slate-700">
          <div><span className="font-bold text-slate-900">Type:</span> {submission.type || 'General'}</div>
          <div><span className="font-bold text-slate-900">Academic Year:</span> {submission.academicYear || '2025-26'}</div>
          <div><span className="font-bold text-slate-900">Submitted By:</span> {submission.submittedBy || '—'}</div>
          <div><span className="font-bold text-slate-900">Submitted On:</span> {submission.submittedAt || submission.createdAt || '—'}</div>
          <div><span className="font-bold text-slate-900">Reviewer:</span> {submission.reviewerName || '—'}</div>
          <div><span className="font-bold text-slate-900">Current Status:</span> {submission.status}</div>
        </div>
      </Card>

      {/* Submission Workflow Progress */}
      <Card className="p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-slate-900">Submission Workflow Progress</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'VERIFIED'].map((stage, i) => (
            <React.Fragment key={stage}>
              <div className={`px-3 py-1.5 rounded-full font-bold text-[10px] border ${
                submission.status === stage ? 'bg-indigo-600 text-white border-indigo-600' :
                ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'VERIFIED'].indexOf(submission.status) > i
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                {stage.replace(/_/g, ' ')}
              </div>
              {i < 3 && <span className="text-slate-300">→</span>}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
};
