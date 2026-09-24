import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvidence } from '../../hooks/useEvidence';
import { useIQAC } from '../../hooks/useIQAC';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { EvidenceTable } from '../../components/iqac/EvidenceTable';
import { MissingEvidenceCard } from '../../components/iqac/MissingEvidenceCard';
import { DepartmentEvidenceHealth } from '../../components/iqac/DepartmentEvidenceHealth';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { EvidenceUploadFormModal } from '../../components/iqac/EvidenceUploadFormModal';
import { Loader } from '../../components/common/Loader';
import { FileText, Clock, ShieldCheck, RotateCcw, XCircle, Upload, AlertCircle } from 'lucide-react';

export const EvidenceRepository = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { departments } = useIQAC();
  const {
    evidence,
    statistics,
    missingEvidence,
    loading,
    uploadEvidence,
  } = useEvidence();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMissingItem, setSelectedMissingItem] = useState(null);

  if (loading || !statistics) {
    return <Loader message="Loading Evidence Repository & Verification Artifacts..." />;
  }

  const handleOpenUpload = (missingItem = null) => {
    setSelectedMissingItem(missingItem);
    setIsUploadModalOpen(true);
  };

  const handleUploadSubmit = async (payload) => {
    try {
      const res = await uploadEvidence(payload);
      toast.success(res.message || 'Evidence document uploaded successfully.');
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Institutional Evidence Repository
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Centralized document management, verification status tracking & NAAC Criteria proof repository
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenUpload(null)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Supporting Evidence</span>
        </button>
      </div>

      {/* Top Statistics Cards (Section 10 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        <IQACStatCard
          title="Total Evidence"
          value={statistics.total}
          subtitle="Repository Scope"
          icon={FileText}
          color="indigo"
        />
        <IQACStatCard
          title="Pending Review"
          value={statistics.pending}
          subtitle="Verification Queue"
          icon={Clock}
          color="amber"
        />
        <IQACStatCard
          title="Verified Evidence"
          value={statistics.verified}
          subtitle="Official Quality Proof"
          icon={ShieldCheck}
          color="emerald"
          badgeText={`${statistics.verificationRate}% Verified`}
        />
        <IQACStatCard
          title="Returned"
          value={statistics.returned}
          subtitle="Awaiting Correction"
          icon={RotateCcw}
          color="rose"
        />
        <IQACStatCard
          title="Rejected"
          value={statistics.rejected}
          subtitle="Invalid Proof"
          icon={XCircle}
          color="rose"
        />
        <IQACStatCard
          title="Verification Rate"
          value={`${statistics.verificationRate}%`}
          subtitle="Institutional Benchmark"
          icon={ShieldCheck}
          color="teal"
        />
      </div>

      {/* Missing Evidence Requirement Tracker (Section 40 requirement) */}
      <MissingEvidenceCard
        missingList={missingEvidence}
        onOpenUpload={handleOpenUpload}
      />

      {/* Department Health Overview (Section 33 requirement) */}
      {user?.role !== ROLES.STAFF && (
        <DepartmentEvidenceHealth departments={departments} />
      )}

      {/* Evidence Master Directory Table (Section 11 requirement) */}
      <EvidenceTable
        evidenceList={evidence}
        departments={departments}
      />

      {/* Upload Form Modal */}
      <EvidenceUploadFormModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadSubmit}
        preselectedSubmissionId={selectedMissingItem?.submissionId}
      />
    </div>
  );
};
