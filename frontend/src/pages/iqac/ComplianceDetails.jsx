import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCompliance } from '../../hooks/useCompliance';
import { ComplianceStatusBadge } from '../../components/quality/ComplianceStatusBadge';
import { SubmissionEvidenceList } from '../../components/iqac/SubmissionEvidenceList';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, CheckCircle2, Calendar, Building2, User, ExternalLink, History, ShieldCheck } from 'lucide-react';

export const ComplianceDetails = () => {
  const { complianceId } = useParams();
  const { user } = useAuth();
  const { getComplianceDetails } = useCompliance();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        const res = await getComplianceDetails(complianceId);
        if (res.success) setRecord(res.data);
      } catch (err) {
        console.error('Error fetching compliance details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [complianceId]);

  if (loading || !record) {
    return <Loader message="Loading Compliance Requirement & Evidence Traceability..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/compliance"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {record.requirementCode}: {record.requirementName}
              </h1>
              <ComplianceStatusBadge status={record.status} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Department: {record.departmentCode} &bull; Category: {record.category} &bull; Academic Year: {record.academicYear}
            </p>
          </div>
        </div>
      </div>

      {/* Main Info Card */}
      <Card className="p-5 sm:p-6 space-y-4 text-xs">
        <h2 className="text-base font-bold text-slate-900 leading-snug">
          Compliance Overview & Requirements
        </h2>

        {record.remarks && (
          <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border">
            Remarks: {record.remarks}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Target Due Date</p>
              <p className="font-bold text-slate-900">{record.dueDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Verification Status</p>
              <p className="font-bold text-emerald-900">{record.verifiedBy || 'Pending Official Verification'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Completion Progress</p>
              <p className="font-bold text-slate-900">{record.progress}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Linked Stage 5C Submissions and Stage 5E Action Items */}
      <Card className="p-5 space-y-3 text-xs">
        <h3 className="font-bold text-slate-900 pb-2 border-b">
          Linked Submissions & Action Items Traceability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
            <p className="font-bold text-indigo-900">Linked Submissions ({record.submissionIds?.length || 0})</p>
            {record.submissionIds && record.submissionIds.length > 0 ? (
              record.submissionIds.map((sId) => (
                <Link
                  key={sId}
                  to={`/iqac/submissions/${sId}`}
                  className="font-bold text-indigo-600 hover:text-indigo-800 text-xs block"
                >
                  {sId} &rarr; Inspect Submission
                </Link>
              ))
            ) : (
              <p className="text-slate-400">No linked submissions.</p>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
            <p className="font-bold text-indigo-900">Linked Action Items ({record.relatedActionItemIds?.length || 0})</p>
            {record.relatedActionItemIds && record.relatedActionItemIds.length > 0 ? (
              record.relatedActionItemIds.map((aId) => (
                <Link
                  key={aId}
                  to={`/iqac/action-items/${aId}`}
                  className="font-bold text-indigo-600 hover:text-indigo-800 text-xs block"
                >
                  {aId} &rarr; Inspect Action Item
                </Link>
              ))
            ) : (
              <p className="text-slate-400">No linked action items.</p>
            )}
          </div>
        </div>
      </Card>

      {/* Linked Stage 5D Evidence Documents */}
      <SubmissionEvidenceList evidenceList={[]} submissionId={record.requirementCode} />

      {/* History Log */}
      <Card className="p-5 space-y-3 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900">Compliance Audit Log</h3>
        </div>
        <div className="space-y-2">
          {(record.history || []).map((h) => (
            <div key={h.id} className="p-2.5 rounded-xl bg-slate-50 border flex justify-between">
              <span className="font-bold text-slate-900">{h.action} &bull; {h.actorName}</span>
              <span className="text-[10px] text-slate-400">{h.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
