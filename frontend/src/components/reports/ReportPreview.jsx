import React from 'react';
import { ReportHeader } from './ReportHeader';
import { ReportFooter } from './ReportFooter';
import { Card } from '../common/Card';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  TrendingUp 
} from 'lucide-react';

export const ReportPreview = ({ report }) => {
  if (!report) return null;

  const data = report.analyticsData || {};
  const overviewKPIs = data.overviewKPIs || {};
  const academic = data.academicAnalytics || {};
  const placement = data.placementAnalytics || {};
  const research = data.researchAnalytics || {};
  const faculty = data.facultyAnalytics || {};

  return (
    <div className="bg-white text-slate-900 shadow-lg rounded-2xl border border-slate-300 p-6 sm:p-10 max-w-5xl mx-auto space-y-8 font-sans print:shadow-none print:border-none print:p-0 print:m-0">
      {/* 1. Official Header */}
      <ReportHeader
        title={report.title}
        academicYear={report.academicYear}
        reportId={report.id}
        scope={report.scope}
        department={report.department}
        generatedDate={report.generatedDate}
        generatedBy={report.generatedBy}
        category={report.category}
      />

      {/* 2. Executive Summary Strip (6 Key Metrics) */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" />
          1. Executive Summary & Key Indicators
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 print:bg-white print:border-slate-300">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Students</span>
            <span className="text-lg font-black text-slate-900">
              {Number(report.summaryMetrics?.students || 3520).toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block">+5.4% YoY</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 print:bg-white print:border-slate-300">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Teaching Faculty</span>
            <span className="text-lg font-black text-slate-900">
              {report.summaryMetrics?.faculty || 420}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold block">1:8.3 Ratio</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 print:bg-white print:border-slate-300">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Pass Percentage</span>
            <span className="text-lg font-black text-emerald-700">
              {report.summaryMetrics?.passPercentage || '91.2%'}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block">+2.2% vs prev</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 print:bg-white print:border-slate-300">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Campus Placements</span>
            <span className="text-lg font-black text-blue-700">
              {report.summaryMetrics?.placementRate || '87.1%'}
            </span>
            <span className="text-[10px] text-blue-600 font-bold block">714 Placed</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 print:bg-white print:border-slate-300">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Research Grants</span>
            <span className="text-lg font-black text-indigo-700">
              {report.summaryMetrics?.researchFunding || '₹7.85 Cr'}
            </span>
            <span className="text-[10px] text-indigo-600 font-bold block">42 Projects</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 print:bg-white print:border-slate-300">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Publications / IPR</span>
            <span className="text-lg font-black text-purple-700">
              {report.summaryMetrics?.publications || 430} / {report.summaryMetrics?.patents || 72}
            </span>
            <span className="text-[10px] text-purple-600 font-bold block">Scopus & Patents</span>
          </div>
        </div>
      </div>

      {/* 3. Department Performance Benchmark Matrix Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" />
          2. Department-Wise Performance Benchmarking Matrix
        </h3>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-black uppercase text-[10px] tracking-wider print:bg-slate-200">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Academic Department</th>
                <th className="py-2.5 px-3 text-center">Pass %</th>
                <th className="py-2.5 px-3 text-center">Placement %</th>
                <th className="py-2.5 px-3 text-center">Publications</th>
                <th className="py-2.5 px-3 text-center">FDP Compliance</th>
                <th className="py-2.5 px-3 text-right">NAAC Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {[
                { name: 'Computer Science and Engineering', code: 'CSE', pass: '94.0%', place: '92.0%', pub: 68, fdp: '91%', status: 'Exemplary' },
                { name: 'Artificial Intelligence & Data Science', code: 'AI&DS', pass: '96.0%', place: '94.0%', pub: 49, fdp: '89%', status: 'Exemplary' },
                { name: 'Computer Science (AI & ML)', code: 'CSE-AIML', pass: '95.0%', place: '93.0%', pub: 41, fdp: '88%', status: 'Exemplary' },
                { name: 'Information Technology', code: 'IT', pass: '91.0%', place: '84.0%', pub: 27, fdp: '82%', status: 'Compliant' },
                { name: 'Electronics and Communication Engg', code: 'ECE', pass: '87.0%', place: '82.0%', pub: 44, fdp: '79%', status: 'Compliant' },
                { name: 'Electrical & Electronics Engineering', code: 'EEE', pass: '86.0%', place: '83.0%', pub: 36, fdp: '85%', status: 'Compliant' },
                { name: 'Mechanical Engineering', code: 'MECH', pass: '79.0%', place: '76.0%', pub: 31, fdp: '76%', status: 'Action Required' },
                { name: 'Civil Engineering', code: 'CIVIL', pass: '82.0%', place: '74.0%', pub: 22, fdp: '70%', status: 'Compliant' },
              ].map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition print:hover:bg-transparent">
                  <td className="py-2 px-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-2 px-3">
                    <span className="font-bold text-slate-900">{dept.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-1.5">({dept.code})</span>
                  </td>
                  <td className="py-2 px-3 text-center font-extrabold text-emerald-700">{dept.pass}</td>
                  <td className="py-2 px-3 text-center font-extrabold text-blue-700">{dept.place}</td>
                  <td className="py-2 px-3 text-center font-semibold text-slate-800">{dept.pub}</td>
                  <td className="py-2 px-3 text-center font-semibold text-indigo-700">{dept.fdp}</td>
                  <td className="py-2 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dept.status === 'Exemplary'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : dept.status === 'Compliant'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {dept.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Research Funding & Extramural Grants */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" />
          3. Extramural Research Funding & IPR Portfolio
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 print:bg-white print:border-slate-300">
            <h4 className="font-bold text-slate-900 uppercase text-[11px]">Sponsoring Agencies Allocation</h4>
            <ul className="space-y-1 text-slate-700">
              <li className="flex justify-between border-b border-slate-200 pb-1">
                <span>DST / SERB (Govt of India):</span>
                <strong className="font-mono text-indigo-900">₹3.40 Cr (43.3%)</strong>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-1">
                <span>Industry Sponsored CSR / R&D:</span>
                <strong className="font-mono text-indigo-900">₹2.10 Cr (26.8%)</strong>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-1">
                <span>AICTE / UGC / CSIR:</span>
                <strong className="font-mono text-indigo-900">₹1.80 Cr (22.9%)</strong>
              </li>
              <li className="flex justify-between">
                <span>Internal Seed Research Grants:</span>
                <strong className="font-mono text-indigo-900">₹0.55 Cr (7.0%)</strong>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 print:bg-white print:border-slate-300">
            <h4 className="font-bold text-slate-900 uppercase text-[11px]">Intellectual Property (IPR) Breakdown</h4>
            <ul className="space-y-1 text-slate-700">
              <li className="flex justify-between border-b border-slate-200 pb-1">
                <span>Government Patents Granted:</span>
                <strong className="font-mono text-emerald-700">16 Granted</strong>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-1">
                <span>Patents Published (FER Cleared):</span>
                <strong className="font-mono text-blue-700">22 Published</strong>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-1">
                <span>New Patent Applications Filed:</span>
                <strong className="font-mono text-indigo-700">28 Filed</strong>
              </li>
              <li className="flex justify-between">
                <span>Incubated Startup Ventures:</span>
                <strong className="font-mono text-purple-700">14 Active</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Key Findings & IQAC Strategic Recommendations */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" />
          4. Key Observations & Management Action Directives
        </h3>

        <div className="space-y-2 text-xs">
          {(report.keyFindings || []).map((finding, idx) => (
            <div
              key={idx}
              className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-start gap-2 text-slate-800 print:bg-white print:border-slate-300"
            >
              <CheckCircle2 className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{finding}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Official Footer */}
      <ReportFooter
        reportId={report.id}
        generatedDate={report.generatedDate}
        generatedBy={report.generatedBy}
      />
    </div>
  );
};
