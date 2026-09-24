import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAQAR } from '../../hooks/useAQAR';
import { AQAR_TEMPLATE_CONFIG } from '../../config/aqarConfig';
import { aqarReportService } from '../../services/aqarReportService';
import { AQARValidationSummary } from '../../components/aqar/AQARValidationSummary';
import { AQARStatusBadge } from '../../components/aqar/AQARStatusBadge';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Save, Eye, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Sparkles, Building2, BookOpen, GraduationCap, FlaskConical, Building, Users, HeartHandshake, Star, Target } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AQARBuilder = () => {
  const { reportId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { report, validation, loading, updateSection } = useAQAR(reportId);

  const [activeSection, setActiveSection] = useState('cover');
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading || !report) {
    return <Loader message="Loading AQAR Report Builder & Criteria Sections..." />;
  }

  const handleSaveNarratives = async () => {
    setSaving(true);
    try {
      await updateSection({
        executiveSummary: executiveSummary || report.executiveSummary,
      });
      toast.success('AQAR Report draft saved.');
    } catch (err) {
      toast.error('Failed to save AQAR draft.');
    } finally {
      setSaving(false);
    }
  };

  const handleFinalize = async () => {
    try {
      const res = await aqarReportService.finalizeAQARReport(report.id, user);
      toast.success(res.message || 'AQAR Report finalized successfully.');
      navigate(`/aqar/${report.id}/preview`);
    } catch (err) {
      toast.error(err.message || 'Failed to finalize report.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/aqar"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {report.reportId}: {report.title}
              </h1>
              <AQARStatusBadge status={report.status} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Academic Year: {report.academicYear} &bull; Version {report.version}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button type="button" variant="secondary" size="md" onClick={handleSaveNarratives} loading={saving} icon={Save}>
            Save Draft
          </Button>

          <Link
            to={`/aqar/${report.id}/preview`}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Preview AQAR</span>
          </Link>
        </div>
      </div>

      {/* Persistent Validation Summary Component */}
      <AQARValidationSummary validation={validation} onFinalize={handleFinalize} userRole={user?.role} />

      {/* 2-Column Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Section Navigation */}
        <Card className="p-3 space-y-1 bg-slate-50 border-slate-200 h-fit">
          <p className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            AQAR Sections
          </p>

          {AQAR_TEMPLATE_CONFIG.sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <span className="truncate">{sec.title}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase bg-white/20">
                {sec.type}
              </span>
            </button>
          ))}
        </Card>

        {/* Right Section Content Pane */}
        <Card className="lg:col-span-3 p-5 sm:p-6 space-y-5 bg-white border-slate-200">
          {activeSection === 'cover' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">Cover Page & Executive Narrative</h2>
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Executive Summary</label>
                <textarea
                  rows={5}
                  value={executiveSummary || report.executiveSummary}
                  onChange={(e) => setExecutiveSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50/50 font-medium"
                />
              </div>
            </div>
          )}

          {activeSection.startsWith('part_b_') && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">
                Part B: NAAC Criteria Metrics & Evidence Verification
              </h2>
              <p className="text-slate-600 font-medium">
                Metrics and verified evidence repository entries automatically compiled from Stage 5G & 5F.
              </p>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                <span className="font-bold text-indigo-950">Source Data: Verified System Data</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-900">
                  AUTO POPULATED
                </span>
              </div>
            </div>
          )}

          {activeSection === 'validation' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">Validation Summary & Finalization</h2>
              <AQARValidationSummary validation={validation} onFinalize={handleFinalize} userRole={user?.role} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
