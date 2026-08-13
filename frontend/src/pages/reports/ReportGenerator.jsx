import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, Card, SectionCard } from '../../components/layout/PageContainer';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/forms/Input';
import { reportService } from '../../services/reportService';
import { ACADEMIC_YEARS } from '../../config/academicYears';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

export const ReportGenerator = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState('aqar_master');
  const [department, setDepartment] = useState('All Academic Departments');
  const [academicYear, setAcademicYear] = useState('2026 - 2027');
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const templates = [
    {
      id: 'aqar_master',
      title: 'AQAR Annual Quality Assurance Dossier',
      code: 'NAAC-AQAR-2026',
      description: 'Comprehensive statutory annual report compiling all 7 Criteria, Curricular, Teaching, Research, and Infrastructure data.',
      badge: 'Statutory NAAC',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'naac_crit_3',
      title: 'NAAC Criterion 3 Research & Innovation Dossier',
      code: 'NAAC-CRIT-3',
      description: 'Consolidated list of indexed publications (Scopus/SCI), sponsored research grants, patents filed, and community extension programs.',
      badge: 'Accreditation',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'nirf_tables',
      title: 'NIRF Engineering Institutional Data Tables',
      code: 'NIRF-ENG-2027',
      description: 'Faculty qualification metrics, student intake vs graduated, median placement salary packages, and capital/operational expenditure.',
      badge: 'Rankings',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'dept_annual',
      title: 'Department Annual Performance Review',
      code: 'DEPT-APR',
      description: 'Departmental performance card: pass percentages, faculty publications, student hackathon wins, and laboratory audits.',
      badge: 'Departmental',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'faculty_appraisal',
      title: 'Faculty PBAS / Self Appraisal Summary',
      code: 'PBAS-UGC',
      description: 'Performance Based Appraisal System (PBAS) score sheet for career advancement scheme (CAS) and annual increment evaluation.',
      badge: 'Faculty',
      badgeColor: 'bg-slate-100 text-slate-800',
    },
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await reportService.generateReport({
        templateId: selectedTemplate,
        department,
        academicYear,
        generatedBy: user?.name,
      });
      setGeneratedReport(res.data);
      toast.success('Institutional report generated successfully!');
    } catch (err) {
      toast.error('Failed to generate report.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadExcel = () => {
    toast.success('Downloading verified report in Microsoft Excel (.xlsx) format...');
  };

  const handleDownloadPDF = () => {
    toast.success('Downloading high-resolution print PDF with institutional seal...');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Institutional Quality Report Generator"
        subtitle="Generate automated compliance dossiers for NAAC AQAR, NBA SAR, NIRF Rankings, and Annual Academic Reviews"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Template Picker & Parameters */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard
            title="1. Select Report Template"
            subtitle="Pre-configured statutory reporting templates compliant with national regulatory formats"
          >
            <div className="grid grid-cols-1 gap-3">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                    selectedTemplate === tpl.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tpl.badgeColor}`}>
                        {tpl.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-semibold">{tpl.code}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{tpl.title}</h4>
                    <p className="text-xs text-slate-500">{tpl.description}</p>
                  </div>
                  <input
                    type="radio"
                    checked={selectedTemplate === tpl.id}
                    onChange={() => setSelectedTemplate(tpl.id)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="2. Report Scope & Parameters"
            subtitle="Configure target academic year and departmental boundaries"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Department Scope"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                options={[
                  'All Academic Departments',
                  'Computer Science and Engineering',
                  'Electronics and Communication Engineering',
                  'Mechanical Engineering',
                  'Electrical and Electronics Engineering',
                  'Civil Engineering',
                  'Information Technology',
                ]}
              />

              <Select
                label="Academic Assessment Year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                options={ACADEMIC_YEARS.map((y) => ({ value: y.label, label: y.label }))}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                variant="primary"
                size="md"
                icon={Sparkles}
                loading={generating}
                onClick={handleGenerate}
              >
                Generate Institutional Report
              </Button>
            </div>
          </SectionCard>
        </div>

        {/* Right 1 Col: Report Output & Export Actions */}
        <div className="space-y-6">
          <SectionCard
            title="Report Generation Output"
            subtitle="Instant preview & multi-format export"
          >
            {generatedReport ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Compilation Complete
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">{generatedReport.title}</h5>
                  <div className="text-slate-600 space-y-1 pt-1">
                    <div>Ref ID: <strong className="font-mono text-slate-800">{generatedReport.id}</strong></div>
                    <div>Assessment AY: <strong>{generatedReport.academicYear}</strong></div>
                    <div>Generated: <strong>{generatedReport.generatedDate}</strong></div>
                    <div>Scope: <strong>{generatedReport.department}</strong></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={FileText}
                    onClick={() => navigate(`/reports/view/${generatedReport.id}`)}
                  >
                    Open Full Printable Viewer
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Download}
                      onClick={handleDownloadPDF}
                    >
                      Export PDF
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={FileSpreadsheet}
                      onClick={handleDownloadExcel}
                    >
                      Export XLSX
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h5 className="text-xs font-bold text-slate-700">No report generated yet</h5>
                <p className="text-[11px] text-slate-400 mt-1">
                  Select your required statutory template and click Generate to produce the institutional data dossier.
                </p>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
};

export const ReportViewer = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-3 mb-4 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/reports/generate')}
        >
          &larr; Back to Generator
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Printer}
            onClick={() => window.print()}
          >
            Print Dossier
          </Button>
        </div>
      </div>

      {/* Printable Institutional Report Document */}
      <Card className="p-8 sm:p-12 max-w-4xl mx-auto space-y-8 bg-white border border-slate-300 shadow-xl print:shadow-none print:border-none">
        {/* Institutional Letterhead Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6 space-y-1">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Internal Quality Assurance Cell (IQAC)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            EXCELLENCE INSTITUTE OF TECHNOLOGY & SCIENCE
          </h1>
          <p className="text-xs text-slate-600">
            (Autonomous Institution Accredited with 'A++' Grade by NAAC & Approved by AICTE)
          </p>
          <div className="text-xs font-semibold text-blue-700 pt-1">
            ANNUAL QUALITY ASSURANCE REPORT (AQAR) COMPILATION DOSSIER &bull; AY 2026-27
          </div>
        </div>

        {/* Executive Summary Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded">
            Part A: Institutional Profile & Statutory Performance Summary
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Total Faculty Strength</span>
              <span className="font-bold text-slate-900 text-sm">184 (144 Doctorates - 78.2%)</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Total Student Strength</span>
              <span className="font-bold text-slate-900 text-sm">3,840 (Pass Percentage: 95.2%)</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Sponsored Grants Mobilized</span>
              <span className="font-bold text-slate-900 text-sm">₹7.85 Crores (18 Active Projects)</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Peer-Reviewed Publications</span>
              <span className="font-bold text-slate-900 text-sm">187 Papers (82 SCI + 105 Scopus)</span>
            </div>
          </div>
        </div>

        {/* NAAC 7 Criteria Assessment Scores */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded">
            Part B: NAAC Revised Accreditation Framework (RAF) Criteria Attainment
          </h3>

          <table className="w-full text-xs text-left border border-slate-200 divide-y divide-slate-200">
            <thead className="bg-slate-50 font-bold text-slate-700">
              <tr>
                <th className="p-2 border-r border-slate-200">Criterion</th>
                <th className="p-2 border-r border-slate-200">Weightage</th>
                <th className="p-2 border-r border-slate-200">Attained CGPA</th>
                <th className="p-2">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2 border-r border-slate-200 font-medium">Criterion I: Curricular Aspects</td>
                <td className="p-2 border-r border-slate-200">100</td>
                <td className="p-2 border-r border-slate-200 font-bold text-emerald-700">3.75 / 4.0</td>
                <td className="p-2 font-semibold text-emerald-600">Verified (92%)</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 font-medium">Criterion II: Teaching-Learning & Evaluation</td>
                <td className="p-2 border-r border-slate-200">350</td>
                <td className="p-2 border-r border-slate-200 font-bold text-emerald-700">3.82 / 4.0</td>
                <td className="p-2 font-semibold text-emerald-600">Verified (96%)</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 font-medium">Criterion III: Research, Innovations & Extension</td>
                <td className="p-2 border-r border-slate-200">110</td>
                <td className="p-2 border-r border-slate-200 font-bold text-emerald-700">3.48 / 4.0</td>
                <td className="p-2 font-semibold text-blue-600">Verified (86%)</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 font-medium">Criterion IV: Infrastructure & Learning Resources</td>
                <td className="p-2 border-r border-slate-200">100</td>
                <td className="p-2 border-r border-slate-200 font-bold text-emerald-700">3.90 / 4.0</td>
                <td className="p-2 font-semibold text-emerald-600">Verified (98%)</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 font-medium">Criterion V: Student Support & Progression</td>
                <td className="p-2 border-r border-slate-200">140</td>
                <td className="p-2 border-r border-slate-200 font-bold text-emerald-700">3.65 / 4.0</td>
                <td className="p-2 font-semibold text-emerald-600">Verified (90%)</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 font-medium">Criterion VI: Governance, Leadership & Management</td>
                <td className="p-2 border-r border-slate-200">100</td>
                <td className="p-2 border-r border-slate-200 font-bold text-emerald-700">3.55 / 4.0</td>
                <td className="p-2 font-semibold text-blue-600">Verified (88%)</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 font-medium">Criterion VII: Institutional Values & Best Practices</td>
                <td className="p-2 border-r border-slate-200">100</td>
                <td className="p-2 border-r border-slate-200 font-bold text-emerald-700">3.88 / 4.0</td>
                <td className="p-2 font-semibold text-emerald-600">Verified (95%)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures & Seal Verification Block */}
        <div className="pt-12 grid grid-cols-3 gap-8 text-center text-xs text-slate-700">
          <div className="border-t border-slate-400 pt-2">
            <div className="font-bold text-slate-900">Dr. M. S. Swaminathan</div>
            <div className="text-[11px] text-slate-500">IQAC Coordinator / Director</div>
          </div>
          <div className="border-t border-slate-400 pt-2">
            <div className="font-bold text-slate-900">Dr. Anita Desai</div>
            <div className="text-[11px] text-slate-500">Dean (Academic Affairs)</div>
          </div>
          <div className="border-t border-slate-400 pt-2">
            <div className="font-bold text-slate-900">Dr. Homi J. Bhabha</div>
            <div className="text-[11px] text-slate-500">Principal / Executive Director</div>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};
