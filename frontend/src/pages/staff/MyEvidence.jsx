import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStaff } from '../../hooks/useStaff';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, Upload, Eye } from 'lucide-react';

const EV_STATUS_COLORS = {
  UPLOADED: 'bg-blue-50 text-blue-800',
  UNDER_REVIEW: 'bg-violet-50 text-violet-800',
  RETURNED: 'bg-rose-50 text-rose-800',
  VERIFIED: 'bg-emerald-100 text-emerald-900',
  REJECTED: 'bg-red-50 text-red-800',
};

export const MyEvidence = () => {
  const { user } = useAuth();
  const { evidenceList, loading } = useStaff();

  if (loading) return <Loader message="Loading My Evidence Repository..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link to="/staff" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Evidence Repository</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Uploaded supporting documents — certificates, DOI proofs, sanction letters</p>
          </div>
        </div>
        <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          Demo Mode: File Upload Simulated
        </div>
      </div>

      {evidenceList.length === 0 ? (
        <Card className="p-10 text-center text-slate-400 text-xs font-semibold">
          <Upload className="w-10 h-10 mx-auto mb-3 text-slate-200" />
          <p>No evidence uploaded yet.</p>
          <p className="mt-1">Evidence is linked to your submissions automatically.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto custom-scroll rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b font-bold uppercase tracking-wider">
                <th className="p-3">Evidence ID</th>
                <th className="p-3">Title / File</th>
                <th className="p-3">Type</th>
                <th className="p-3">Linked Submission</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {evidenceList.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-bold text-indigo-900">{ev.evidenceId || ev.id}</td>
                  <td className="p-3 font-bold text-slate-900">{ev.title || ev.fileName || 'Untitled'}</td>
                  <td className="p-3 text-slate-600">{ev.type || 'Document'}</td>
                  <td className="p-3 text-slate-600">{ev.linkedSubmissionTitle || '—'}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${EV_STATUS_COLORS[ev.status] || 'bg-slate-100 text-slate-700'}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{ev.uploadedAt || ev.createdAt || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};
