import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvidence } from '../../hooks/useEvidence';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { EvidenceStatusBadge } from '../../components/iqac/EvidenceStatusBadge';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { EvidenceReviewModal } from '../../components/iqac/EvidenceReviewModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Clock, ShieldCheck, AlertTriangle, RotateCcw, XCircle, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EvidenceReviewCenter = () => {
  const { user } = useAuth();
  const toast = useToast();
  const {
    pendingReviews,
    reviewStats,
    loading,
    verifyEvidence,
    returnEvidence,
    rejectEvidence,
  } = useEvidence();

  const [selectedEv, setSelectedEv] = useState(null);
  const [actionType, setActionType] = useState('VERIFY');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading || !reviewStats) {
    return <Loader message="Loading Evidence Verification Review Center..." />;
  }

  const handleOpenAction = (ev, act) => {
    setSelectedEv(ev);
    setActionType(act);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async ({ evidenceId, action, comment }) => {
    try {
      let res;
      if (action === 'VERIFY') {
        res = await verifyEvidence(evidenceId, comment);
      } else if (action === 'RETURN') {
        res = await returnEvidence(evidenceId, comment);
      } else if (action === 'REJECT') {
        res = await rejectEvidence(evidenceId, comment);
      }
      toast.success(res.message || 'Evidence verification action completed.');
    } catch (err) {
      toast.error(err.message || 'Action failed.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Evidence Verification Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Operational review center for verifying, returning, or rejecting supporting evidence documents
          </p>
        </div>
      </div>

      {/* Top Review Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <IQACStatCard
          title="Pending Evidence Verification"
          value={reviewStats.pending}
          subtitle="Documents Waiting Review"
          icon={Clock}
          color="indigo"
        />
        <IQACStatCard
          title="High Priority Proofs"
          value={reviewStats.highPriority}
          subtitle="Publications & Grants"
          icon={AlertTriangle}
          color="rose"
        />
        <IQACStatCard
          title="Recently Returned"
          value={reviewStats.returned}
          subtitle="Under Uploader Revision"
          icon={RotateCcw}
          color="amber"
        />
      </div>

      {/* Evidence Verification Queue Table */}
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Verification Queue ({pendingReviews.length} Documents)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Submitted document proofs within your department scope requiring verification action
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 custom-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                <th className="p-3">Evidence ID</th>
                <th className="p-3">Document Title & File</th>
                <th className="p-3">Type</th>
                <th className="p-3">Uploaded By</th>
                <th className="p-3 text-center">Dept</th>
                <th className="p-3 text-center">Version</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {pendingReviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                    No evidence documents currently waiting for your verification. All clear!
                  </td>
                </tr>
              ) : (
                pendingReviews.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-indigo-900 whitespace-nowrap">
                      {ev.evidenceId}
                    </td>

                    <td className="p-3">
                      <div className="space-y-0.5 max-w-xs">
                        <p className="font-bold text-slate-900 leading-tight truncate">
                          {ev.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-normal truncate">
                          {ev.fileName} ({ev.fileSize})
                        </p>
                      </div>
                    </td>

                    <td className="p-3 text-slate-700 font-semibold text-[11px]">
                      {ev.typeLabel || ev.evidenceType}
                    </td>

                    <td className="p-3">
                      <p className="font-semibold text-slate-800 leading-tight">{ev.uploadedBy}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{ev.uploadedByRole.replace(/_/g, ' ')}</p>
                    </td>

                    <td className="p-3 text-center font-bold text-slate-800">
                      {ev.departmentCode}
                    </td>

                    <td className="p-3 text-center font-bold text-slate-700">
                      v{ev.version || 1}
                    </td>

                    <td className="p-3 text-center">
                      <EvidenceStatusBadge status={ev.status} />
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/iqac/evidence/${ev.id}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                        >
                          View
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenAction(ev, 'VERIFY')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Verify
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenAction(ev, 'RETURN')}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Return
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenAction(ev, 'REJECT')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review Modal */}
      <EvidenceReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        actionType={actionType}
        evidence={selectedEv}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};
