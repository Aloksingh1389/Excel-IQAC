import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAQARReports } from '../../hooks/useAQARReports';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ArrowLeft, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const CreateAQAR = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { createDraft } = useAQARReports();

  const [step, setStep] = useState(1);
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [executiveSummary, setExecutiveSummary] = useState(
    'Annual Quality Assurance Report (AQAR) compiled automatically from verified Stage 5G accreditation readiness and Stage 5F quality scorecards.'
  );
  const [loading, setLoading] = useState(false);

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createDraft({
        academicYear,
        executiveSummary,
      });
      toast.success(res.message || 'AQAR draft generated successfully.');
      navigate(`/aqar/${res.data.id}/edit`);
    } catch (err) {
      toast.error(err.message || 'Failed to generate AQAR draft.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
        <Link
          to="/aqar"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Auto-Generate NAAC AQAR Report Wizard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Step {step} of 3 &bull; Automatic data aggregation from Criteria 1–7 & Quality Scorecards
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-6 bg-white border-slate-200 shadow-xl">
        {step === 1 && (
          <div className="space-y-5 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">
              Step 1: Report Setup & Target Academic Year
            </h2>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Target Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none"
              >
                <option value="2025-26">2025-26 (Current Academic Year)</option>
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 space-y-1 text-indigo-900">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Automated Data Source Integration
              </p>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                The engine will aggregate NAAC Criteria 1–7 metrics (5G), verified evidence repository files (5D), compliance rates (5F), and meeting action resolutions (5E).
              </p>
            </div>

            <div className="flex justify-end pt-3">
              <Button type="button" variant="primary" size="md" onClick={() => setStep(2)}>
                Next: Data Validation
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">
              Step 2: Source Data Validation Check
            </h2>

            <div className="space-y-2">
              <div className="p-3 rounded-xl border bg-emerald-50/60 border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-emerald-900">Stage 5G NAAC Criteria 1–7 Metrics</span>
                <span className="font-extrabold text-emerald-800">54 / 68 Ready</span>
              </div>
              <div className="p-3 rounded-xl border bg-emerald-50/60 border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-emerald-900">Stage 5D Verified Evidence Repository</span>
                <span className="font-extrabold text-emerald-800">38 Verified Files</span>
              </div>
              <div className="p-3 rounded-xl border bg-emerald-50/60 border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-emerald-900">Stage 5F Compliance Requirements</span>
                <span className="font-extrabold text-emerald-800">88% Verified Rate</span>
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <Button type="button" variant="secondary" size="md" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" variant="primary" size="md" onClick={() => setStep(3)}>
                Next: Executive Narrative
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleGenerateSubmit} className="space-y-5 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">
              Step 3: Executive Summary & Generate Draft
            </h2>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Executive Summary Narrative</label>
              <textarea
                rows={4}
                value={executiveSummary}
                onChange={(e) => setExecutiveSummary(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none font-medium"
                required
              />
            </div>

            <div className="flex justify-between pt-3">
              <Button type="button" variant="secondary" size="md" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="submit" variant="primary" size="md" loading={loading} icon={Sparkles}>
                Compile & Generate AQAR Draft
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
