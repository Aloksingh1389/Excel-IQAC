import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useReports } from '../../hooks/useReports';
import { useAuth } from '../../context/AuthContext';
import { REPORT_CONFIGS, REPORT_CATEGORIES } from '../../config/reportConfig';
import { MOCK_ANALYTICS_DATA } from '../../data/mockAnalytics';
import { MOCK_COLLEGE_LETTERHEAD } from '../../data/mockReports';
import { ReportStepper } from '../../components/reports/ReportStepper';
import { ReportPreview } from '../../components/reports/ReportPreview';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Building2, 
  Calendar, 
  FileText, 
  Sliders, 
  Eye, 
  Check 
} from 'lucide-react';

export const GenerateReport = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedType = searchParams.get('reportType');

  const { user, academicYear: globalYear } = useAuth();
  const { generateReport } = useReports();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedConfigId, setSelectedConfigId] = useState(
    preselectedType || 'annual-institutional-report'
  );
  const [scope, setScope] = useState('INSTITUTION');
  const [academicYear, setAcademicYear] = useState(globalYear || '2026-27');
  const [department, setDepartment] = useState('ALL');
  const [semester, setSemester] = useState('ALL');
  const [program, setProgram] = useState('ALL');
  const [fundingAgency, setFundingAgency] = useState('ALL');
  const [fdpType, setFdpType] = useState('ALL');
  const [format, setFormat] = useState('PDF');

  // Simulated Generation Progress Modal
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);

  const selectedConfig =
    REPORT_CONFIGS.find((r) => r.id === selectedConfigId) || REPORT_CONFIGS[0];

  const STEPS = [
    { id: 1, title: 'Report Type', subtitle: 'Select template' },
    { id: 2, title: 'Scope', subtitle: 'Institution / Branch' },
    { id: 3, title: 'Filters', subtitle: 'Parameters' },
    { id: 4, title: 'Preview', subtitle: 'Review dossier' },
    { id: 5, title: 'Generate', subtitle: 'Compile & Export' },
  ];

  // Dynamic preview mock report object
  const previewReport = {
    id: 'RPT-PREVIEW-DRAFT',
    reportConfigId: selectedConfig.id,
    title: selectedConfig.name,
    category: selectedConfig.category,
    academicYear,
    scope,
    department,
    generatedBy: user?.name || 'Dr. Vikram Seth',
    generatedDate: 'Draft Preview',
    format,
    letterhead: MOCK_COLLEGE_LETTERHEAD,
    summaryMetrics: {
      students: 3520,
      faculty: 420,
      passPercentage: '91.2%',
      placementRate: '87.1%',
      researchFunding: '₹7.85 Cr',
      publications: 430,
      patents: 72,
    },
    keyFindings: [
      'Comprehensive preview mode: Data validated across autonomous examination and R&D registries.',
      'Institutional pass percentage benchmarking at 91.2% with 87.1% campus placement rate.',
    ],
    analyticsData: MOCK_ANALYTICS_DATA[academicYear] || MOCK_ANALYTICS_DATA['2026-27'],
  };

  const handleFinalGenerate = async () => {
    setIsGenerating(true);
    setGenProgress(1);

    setTimeout(() => setGenProgress(2), 500);
    setTimeout(() => setGenProgress(3), 1000);
    setTimeout(() => setGenProgress(4), 1500);

    setTimeout(async () => {
      try {
        const res = await generateReport({
          reportConfigId: selectedConfig.id,
          academicYear,
          scope,
          department,
          semester,
          program,
          fundingAgency,
          fdpType,
          format,
        });

        if (res.success) {
          navigate(`/director/reports/${res.report.id}`);
        }
      } catch (err) {
        console.error('Report generation error:', err);
        setIsGenerating(false);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <Link to="/director/reports">
            <Button variant="ghost" size="xs" icon={ArrowLeft}>
              Report Center
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Institutional Report Generator
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Multi-step wizard to compile verified statutory and institutional performance dossiers.
            </p>
          </div>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <ReportStepper currentStep={currentStep} steps={STEPS} />

      {/* STEP 1: Select Report Type */}
      {currentStep === 1 && (
        <Card className="p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Step 1: Select Report Template</h3>
            <p className="text-xs text-slate-500">
              Choose from institutional, academic, research, placement, faculty, or IQAC report formats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REPORT_CONFIGS.map((config) => {
              const isSelected = selectedConfigId === config.id;
              return (
                <div
                  key={config.id}
                  onClick={() => setSelectedConfigId(config.id)}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-indigo-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {config.category}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-2 leading-snug">{config.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{config.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button variant="primary" size="sm" icon={ArrowRight} onClick={() => setCurrentStep(2)}>
              Continue to Scope
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Select Report Scope */}
      {currentStep === 2 && (
        <Card className="p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Step 2: Select Institutional Scope</h3>
            <p className="text-xs text-slate-500">
              Define whether the dossier should encompass the entire institution or focus on a specific branch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => {
                setScope('INSTITUTION');
                setDepartment('ALL');
              }}
              className={`p-5 rounded-xl border-2 transition cursor-pointer space-y-2 ${
                scope === 'INSTITUTION'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Building2 className="w-5 h-5" />
                </div>
                {scope === 'INSTITUTION' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <h4 className="text-sm font-bold text-slate-900">Institution-Wide Scope</h4>
              <p className="text-xs text-slate-500">
                Consolidates metrics, comparisons, and achievements across all 12 academic departments.
              </p>
            </div>

            <div
              onClick={() => {
                setScope('DEPARTMENT');
                if (department === 'ALL') setDepartment('CSE');
              }}
              className={`p-5 rounded-xl border-2 transition cursor-pointer space-y-2 ${
                scope === 'DEPARTMENT'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Layers className="w-5 h-5" />
                </div>
                {scope === 'DEPARTMENT' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <h4 className="text-sm font-bold text-slate-900">Single Department Scope</h4>
              <p className="text-xs text-slate-500">
                Drills down specifically into the chosen branch or academic department.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button variant="primary" size="sm" icon={ArrowRight} onClick={() => setCurrentStep(3)}>
              Continue to Filters
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Configure Parameters & Filters */}
      {currentStep === 3 && (
        <Card className="p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Step 3: Configure Report Parameters</h3>
            <p className="text-xs text-slate-500">
              Customize academic cycles, target cohorts, and output dossier format.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Academic Year */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Academic Year Cycle</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="2026-27">2026-27 (Current Active Cycle)</option>
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
              </select>
            </div>

            {/* Department (if applicable) */}
            {scope === 'DEPARTMENT' && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Target Academic Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                >
                  <option value="CSE">Computer Science and Engineering (CSE)</option>
                  <option value="AIDS">Artificial Intelligence & Data Science (AI&DS)</option>
                  <option value="AIML">CSE - Artificial Intelligence & ML (AIML)</option>
                  <option value="CSBS">CS & Business Systems (CSBS)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="ECE">Electronics and Communication Engg (ECE)</option>
                  <option value="EEE">Electrical and Electronics Engg (EEE)</option>
                  <option value="MECH">Mechanical Engineering (MECH)</option>
                  <option value="CIVIL">Civil Engineering (CIVIL)</option>
                  <option value="BT">Biotechnology (BT)</option>
                  <option value="BME">Biomedical Engineering (BME)</option>
                  <option value="CHEM">Chemical Engineering (CHEM)</option>
                </select>
              </div>
            )}

            {/* Output Format */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Primary Dossier Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="PDF">PDF Dossier (Print-Ready Letterhead Layout)</option>
                <option value="EXCEL">Spreadsheet Workbook (Excel / CSV Tables)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
              Back
            </Button>
            <Button variant="primary" size="sm" icon={ArrowRight} onClick={() => setCurrentStep(4)}>
              Preview Dossier
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Live Report Preview */}
      {currentStep === 4 && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs">
            <div>
              <span className="font-bold text-indigo-900 block">Dossier Preview Mode</span>
              <p className="text-indigo-700">Review the simulated output before formal generation and recording.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)}>
                Edit Parameters
              </Button>
              <Button variant="primary" size="sm" icon={Sparkles} onClick={handleFinalGenerate}>
                Generate & Save Report
              </Button>
            </div>
          </div>

          <ReportPreview report={previewReport} />
        </div>
      )}

      {/* STEP 5: Simulated Multi-Step Generation Progress Modal */}
      {isGenerating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30 animate-pulse">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Compiling Institutional Dossier</h3>
              <p className="text-xs text-slate-500">Synthesizing multi-department data registries</p>
            </div>

            <div className="space-y-3 text-left text-xs">
              <div className={`flex items-center gap-2.5 ${genProgress >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                {genProgress >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
                <span>1. Collecting institutional records and datasets</span>
              </div>
              <div className={`flex items-center gap-2.5 ${genProgress >= 2 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                {genProgress >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
                <span>2. Computing quality benchmarks and aggregates</span>
              </div>
              <div className={`flex items-center gap-2.5 ${genProgress >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                {genProgress >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
                <span>3. Rendering executive tables and diagrams</span>
              </div>
              <div className={`flex items-center gap-2.5 ${genProgress >= 4 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                {genProgress >= 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
                <span>4. Generating formal IQAC verification seal</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
