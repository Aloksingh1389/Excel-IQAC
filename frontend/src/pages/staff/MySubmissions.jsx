import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStaff } from '../../hooks/useStaff';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ArrowLeft, Plus, Eye, Edit3, RotateCcw } from 'lucide-react';

const STATUS_COLORS = {
  DRAFT: 'bg-amber-50 text-amber-800 border-amber-200',
  SUBMITTED: 'bg-blue-50 text-blue-800 border-blue-200',
  UNDER_REVIEW: 'bg-violet-50 text-violet-800 border-violet-200',
  RETURNED: 'bg-rose-50 text-rose-800 border-rose-300',
  RESUBMITTED: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  APPROVED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  VERIFIED: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  REJECTED: 'bg-red-50 text-red-800 border-red-200',
};

export const MySubmissions = () => {
  const { user } = useAuth();
  const { submissions, loading } = useStaff();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');

  if (loading) return <Loader message="Loading My Submission Records..." />;

  const filtered = submissions.filter((s) => {
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchSearch = !searchQuery || s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.type?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link to="/staff" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Submissions</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">All personal IQAC quality data submissions — publications, FDPs, research, achievements</p>
          </div>
        </div>
        <Link to="/staff/submissions/create"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>New Submission</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search submissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-medium"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-bold"
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="RETURNED">Returned</option>
          <option value="RESUBMITTED">Resubmitted</option>
          <option value="APPROVED">Approved</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center text-slate-400 text-xs font-semibold">
          <p>No submissions found. Create your first submission!</p>
          <Link to="/staff/submissions/create" className="mt-3 inline-flex items-center gap-1 text-indigo-600 font-bold hover:underline">
            <Plus className="w-3.5 h-3.5" /> New Submission
          </Link>
        </Card>
      ) : (
        <Card className="overflow-x-auto custom-scroll rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b font-bold uppercase tracking-wider">
                <th className="p-3">Submission Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Submitted</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3">Reviewer</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{s.title || 'Untitled Submission'}</td>
                  <td className="p-3 text-slate-600">{s.type || 'General'}</td>
                  <td className="p-3 text-slate-500">{s.submittedAt || s.createdAt || '—'}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${STATUS_COLORS[s.status] || 'bg-slate-100 text-slate-700'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{s.reviewerName || '—'}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    {s.status === 'RETURNED' ? (
                      <Link to={`/staff/submissions/${s.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 transition text-[10px]">
                        <RotateCcw className="w-3 h-3" /> Correct
                      </Link>
                    ) : (
                      <Link to={`/staff/submissions/${s.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition text-[10px]">
                        <Eye className="w-3 h-3" /> View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};
