import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStaff } from '../../hooks/useStaff';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { ArrowLeft, BookOpen, FlaskConical, GraduationCap, CheckCircle2, FileText, CheckSquare } from 'lucide-react';

export const MyQualityContribution = () => {
  const { user } = useAuth();
  const { qualityContribution, loading } = useStaff();

  if (loading || !qualityContribution) return <Loader message="Loading Personal Quality Contribution..." />;

  const { verifiedPublicationsCount, fundedResearchProjectsCount, fdpCompletionsCount, verifiedEvidenceFilesCount, completedQualityTasksCount } = qualityContribution;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
        <Link to="/staff" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Quality Contribution</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Personal contribution to institutional quality metrics — verified records only
          </p>
        </div>
      </div>

      {/* Important privacy notice */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
        This view shows only <strong>your own verified contributions</strong>. Institutional and department-level quality scores are accessible only by IQAC/management roles.
      </div>

      {/* Contribution KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <IQACStatCard title="Verified Publications" value={verifiedPublicationsCount} subtitle="Scopus / SCI / UGC CARE" icon={BookOpen} color="indigo" />
        <IQACStatCard title="Funded Research Projects" value={fundedResearchProjectsCount} subtitle="DST / AICTE / SERB" icon={FlaskConical} color="violet" />
        <IQACStatCard title="FDP Completions" value={fdpCompletionsCount} subtitle="ATAL / NPTEL / Industry" icon={GraduationCap} color="teal" />
        <IQACStatCard title="Verified Evidence Files" value={verifiedEvidenceFilesCount} subtitle="IQAC Verified" icon={CheckCircle2} color="emerald" />
        <IQACStatCard title="Completed Quality Tasks" value={completedQualityTasksCount} subtitle="IQAC Action Items" icon={CheckSquare} color="amber" />
      </div>

      {/* Year-wise summary */}
      <Card className="p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Year-Wise Contribution Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 font-bold uppercase text-[10px] border-b">
                <th className="p-2">Academic Year</th>
                <th className="p-2 text-center">Publications</th>
                <th className="p-2 text-center">Research</th>
                <th className="p-2 text-center">FDPs</th>
                <th className="p-2 text-center">Evidence Files</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr><td className="p-2 font-bold">2025-26</td><td className="p-2 text-center">3</td><td className="p-2 text-center">1</td><td className="p-2 text-center">2</td><td className="p-2 text-center">7</td></tr>
              <tr><td className="p-2 font-bold">2024-25</td><td className="p-2 text-center">2</td><td className="p-2 text-center">1</td><td className="p-2 text-center">2</td><td className="p-2 text-center">5</td></tr>
              <tr><td className="p-2 font-bold">2023-24</td><td className="p-2 text-center">1</td><td className="p-2 text-center">0</td><td className="p-2 text-center">1</td><td className="p-2 text-center">2</td></tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
