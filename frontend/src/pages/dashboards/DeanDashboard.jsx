import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  FlaskConical, 
  Award, 
  Briefcase, 
  TrendingUp, 
  BarChart3, 
  FileCheck2, 
  Users, 
  Sparkles,
  Building2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEAN_TYPES } from '../../config/roles';
import { PageContainer, PageHeader, SectionCard, Card } from '../../components/layout/PageContainer';
import { StatCard } from '../../components/dashboard/StatCard';
import { BarChartWidget, AreaChartWidget, LineChartWidget } from '../../components/charts/BarChartWidget';
import { Button } from '../../components/common/Button';

export const DeanDashboard = () => {
  const { user, subType } = useAuth();
  const navigate = useNavigate();

  const isAcademic = subType === DEAN_TYPES.ACADEMIC || !subType;
  const isResearch = subType === DEAN_TYPES.RESEARCH;
  const isPlacement = subType === DEAN_TYPES.PLACEMENT;

  // Department comparative data
  const deptPerformanceData = [
    { department: 'Computer Science', passRate: 98.4, papers: 46, grants: 142, placements: 94.2 },
    { department: 'Electronics & Comm.', passRate: 95.8, papers: 38, grants: 110, placements: 91.0 },
    { department: 'Mechanical Engg.', passRate: 91.2, papers: 24, grants: 85, placements: 82.5 },
    { department: 'Electrical & Electronics', passRate: 93.6, papers: 29, grants: 92, placements: 86.8 },
    { department: 'Civil Engineering', passRate: 89.5, papers: 16, grants: 48, placements: 78.4 },
    { department: 'Information Tech.', passRate: 97.2, papers: 34, grants: 98, placements: 92.6 },
  ];

  // Academic Dean Charts
  const academicTrend = [
    { name: 'Sem 1', avgCgpa: 8.1, passPct: 92 },
    { name: 'Sem 2', avgCgpa: 8.3, passPct: 94 },
    { name: 'Sem 3', avgCgpa: 8.2, passPct: 93 },
    { name: 'Sem 4', avgCgpa: 8.6, passPct: 96 },
    { name: 'Sem 5', avgCgpa: 8.7, passPct: 97 },
    { name: 'Sem 6', avgCgpa: 8.9, passPct: 98 },
  ];

  // Research Dean Charts
  const researchTrend = [
    { name: '2023', sci: 34, scopus: 62, ugc: 28 },
    { name: '2024', sci: 48, scopus: 79, ugc: 32 },
    { name: '2025', sci: 64, scopus: 104, ugc: 40 },
    { name: '2026', sci: 82, scopus: 138, ugc: 45 },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={`Dean's Portal &bull; ${user?.name || 'Dean'}`}
        subtitle={`Portfolio: ${subType || 'Academic Affairs'} &bull; Institutional oversight across all 6 departments`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/reports/generate')}
            >
              Export Dean's Dossier
            </Button>
          </div>
        }
      />

      {/* Role-Specific Metric Cards */}
      {isAcademic && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Student Enrollment"
            value="3,840"
            subtitle="UG: 3,240 | PG: 600"
            icon={GraduationCap}
            iconBg="bg-blue-50 text-blue-600"
            trend={{ value: '+4.5%', isPositive: true, label: 'admissions rate' }}
          />
          <StatCard
            title="Overall Pass Percentage"
            value="95.2%"
            subtitle="Autonomous University Exams"
            icon={Award}
            iconBg="bg-emerald-50 text-emerald-600"
            trend={{ value: '+1.8%', isPositive: true, label: 'vs last year' }}
          />
          <StatCard
            title="Syllabus Completion"
            value="96.8%"
            subtitle="Academic Calendar Target"
            icon={FileCheck2}
            iconBg="bg-purple-50 text-purple-600"
            trend={{ value: 'On Track', isPositive: true, label: 'AY 2026-27' }}
          />
          <StatCard
            title="Student-Faculty Ratio"
            value="14.2 : 1"
            subtitle="AICTE / NBA Compliant"
            icon={Users}
            iconBg="bg-amber-50 text-amber-600"
          />
        </div>
      )}

      {isResearch && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sponsored Grants"
            value="₹7.85 Cr"
            subtitle="18 Active Funded Projects"
            icon={FlaskConical}
            iconBg="bg-indigo-50 text-indigo-600"
            trend={{ value: '+₹1.6 Cr', isPositive: true, label: 'sanctioned this AY' }}
          />
          <StatCard
            title="Total Publications"
            value="187"
            subtitle="82 SCI + 105 Scopus"
            icon={BookOpen}
            iconBg="bg-blue-50 text-blue-600"
            trend={{ value: '+28%', isPositive: true, label: 'high-impact papers' }}
          />
          <StatCard
            title="Patents Filed / Granted"
            value="24 / 9"
            subtitle="Institutional IPR Cell"
            icon={Award}
            iconBg="bg-emerald-50 text-emerald-600"
            trend={{ value: '4 Published', isPositive: true, label: 'this quarter' }}
          />
          <StatCard
            title="Institutional H-Index"
            value="48"
            subtitle="Scopus Citation Metric"
            icon={TrendingUp}
            iconBg="bg-purple-50 text-purple-600"
            trend={{ value: '+6', isPositive: true, label: 'last 2 years' }}
          />
        </div>
      )}

      {isPlacement && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Overall Placement Rate"
            value="89.4%"
            subtitle="682 of 760 eligible students"
            icon={Briefcase}
            iconBg="bg-emerald-50 text-emerald-600"
            trend={{ value: '+3.2%', isPositive: true, label: 'vs last batch' }}
          />
          <StatCard
            title="Highest Package"
            value="₹44.0 LPA"
            subtitle="Offered by Microsoft IDC"
            icon={Award}
            iconBg="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Average Package"
            value="₹8.65 LPA"
            subtitle="Median: ₹7.8 LPA"
            icon={TrendingUp}
            iconBg="bg-purple-50 text-purple-600"
            trend={{ value: '+14%', isPositive: true, label: 'YoY growth' }}
          />
          <StatCard
            title="Recruiting Companies"
            value="142"
            subtitle="48 Tier-1 Product Firms"
            icon={Building2}
            iconBg="bg-amber-50 text-amber-600"
          />
        </div>
      )}

      {/* Role-Specific Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isAcademic && (
          <SectionCard
            title="Academic Performance & Pass Percentage Trend"
            subtitle="Semester-wise progression across undergraduate cohorts"
          >
            <AreaChartWidget
              data={academicTrend}
              xAxisKey="name"
              dataKeys={[
                { key: 'passPct', name: 'Pass Rate (%)', color: '#10b981' },
                { key: 'avgCgpa', name: 'Avg CGPA (x10)', color: '#2563eb' },
              ]}
            />
          </SectionCard>
        )}

        {isResearch && (
          <SectionCard
            title="Research Publications Trend by Indexing"
            subtitle="SCI vs Scopus vs UGC-CARE progression"
          >
            <LineChartWidget
              data={researchTrend}
              xAxisKey="name"
              dataKeys={[
                { key: 'sci', name: 'SCI / SCIE Indexed', color: '#2563eb' },
                { key: 'scopus', name: 'Scopus Indexed', color: '#10b981' },
                { key: 'ugc', name: 'UGC-CARE', color: '#f59e0b' },
              ]}
            />
          </SectionCard>
        )}

        {isPlacement && (
          <SectionCard
            title="Department-Wise Placement Statistics"
            subtitle="Percentage of eligible batch placed per engineering department"
          >
            <BarChartWidget
              data={deptPerformanceData}
              xAxisKey="department"
              dataKeys={[{ key: 'placements', name: 'Placement Rate (%)', color: '#10b981' }]}
            />
          </SectionCard>
        )}

        <SectionCard
          title="Department-Wise Grants & Research Output"
          subtitle="Grants mobilized (in Lakhs ₹) by engineering departments"
        >
          <BarChartWidget
            data={deptPerformanceData}
            xAxisKey="department"
            dataKeys={[
              { key: 'grants', name: 'Grants Mobilized (₹ Lakhs)', color: '#8b5cf6' },
              { key: 'papers', name: 'Total Papers', color: '#3b82f6' },
            ]}
          />
        </SectionCard>
      </div>

      {/* Cross-Departmental Performance Matrix */}
      <SectionCard
        title="Cross-Department Performance Matrix"
        subtitle="Institutional benchmarking across all academic departments"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Pass Rate</th>
                <th className="py-3 px-4">Publications</th>
                <th className="py-3 px-4">Research Grants</th>
                <th className="py-3 px-4">Placement Rate</th>
                <th className="py-3 px-4 text-right">IQAC Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {deptPerformanceData.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{d.department}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-emerald-600">{d.passRate}%</span>
                  </td>
                  <td className="py-3 px-4">{d.papers} Papers</td>
                  <td className="py-3 px-4 font-semibold text-purple-700">₹{d.grants} Lakhs</td>
                  <td className="py-3 px-4 font-semibold text-blue-600">{d.placements}%</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      Grade A++
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </PageContainer>
  );
};
