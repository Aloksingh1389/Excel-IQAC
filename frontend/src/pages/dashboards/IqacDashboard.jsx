import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  ClipboardList, 
  FileCheck2, 
  PieChart, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle, 
  Calendar, 
  Download,
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PageContainer, PageHeader, SectionCard, Card } from '../../components/layout/PageContainer';
import { StatCard } from '../../components/dashboard/StatCard';
import { BarChartWidget, PieChartWidget } from '../../components/charts/BarChartWidget';
import { Button } from '../../components/common/Button';
import { qualityService, auditService, accreditationService } from '../../services/qualityService';

export const IqacDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [criteria, setCriteria] = useState([]);
  const [initiatives, setInitiatives] = useState([]);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIqac = async () => {
      try {
        const [critRes, initRes, audRes] = await Promise.all([
          accreditationService.getCriteria(),
          qualityService.getQualityInitiatives(),
          auditService.getAudits(),
        ]);
        setCriteria(critRes.data);
        setInitiatives(initRes.data);
        setAudits(audRes.data);
      } finally {
        setLoading(false);
      }
    };
    loadIqac();
  }, []);

  const criteriaList = criteria.length > 0 ? criteria : [
    { id: 'crit_1', code: 'Criterion I', name: 'Curricular Aspects', currentScore: 3.75, maxScore: 4.0, completionPercentage: 92 },
    { id: 'crit_2', code: 'Criterion II', name: 'Teaching-Learning & Evaluation', currentScore: 3.82, maxScore: 4.0, completionPercentage: 96 },
    { id: 'crit_3', code: 'Criterion III', name: 'Research, Innovations & Extension', currentScore: 3.48, maxScore: 4.0, completionPercentage: 86 },
    { id: 'crit_4', code: 'Criterion IV', name: 'Infrastructure & Learning Resources', currentScore: 3.90, maxScore: 4.0, completionPercentage: 98 },
    { id: 'crit_5', code: 'Criterion V', name: 'Student Support & Progression', currentScore: 3.65, maxScore: 4.0, completionPercentage: 90 },
    { id: 'crit_6', code: 'Criterion VI', name: 'Governance, Leadership & Management', currentScore: 3.55, maxScore: 4.0, completionPercentage: 88 },
    { id: 'crit_7', code: 'Criterion VII', name: 'Institutional Values & Best Practices', currentScore: 3.88, maxScore: 4.0, completionPercentage: 95 },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={`IQAC Central Quality Control &bull; NAAC / NBA Cell`}
        subtitle={`Annual Quality Assurance Report (AQAR) & Continuous Institutional Enhancement`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Calendar}
              onClick={() => navigate('/iqac/audits')}
            >
              Schedule Audit
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
              onClick={() => navigate('/iqac/initiatives')}
            >
              New Quality Initiative
            </Button>
          </div>
        }
      />

      {/* Institutional Quality Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="NAAC Cumulative CGPA"
          value="3.64 / 4.00"
          subtitle="Forecast: Grade A++ (Cycle 3)"
          icon={Award}
          iconBg="bg-blue-50 text-blue-600"
          trend={{ value: '+0.18', isPositive: true, label: 'vs Cycle 2' }}
        />
        <StatCard
          title="AQAR Submission Readiness"
          value="92.4%"
          subtitle="Annual Cycle 2026-27"
          icon={FileCheck2}
          iconBg="bg-emerald-50 text-emerald-600"
          trend={{ value: 'Deadline', isPositive: true, label: 'Dec 31, 2026' }}
        />
        <StatCard
          title="Quality Initiatives"
          value={initiatives.length || '8'}
          subtitle="6 Active &bull; 2 Completed"
          icon={Sparkles}
          iconBg="bg-purple-50 text-purple-600"
          onClick={() => navigate('/iqac/initiatives')}
        />
        <StatCard
          title="Internal Quality Audits"
          value={audits.length || '4'}
          subtitle="2 Scheduled this month"
          icon={ClipboardList}
          iconBg="bg-amber-50 text-amber-600"
          onClick={() => navigate('/iqac/audits')}
        />
      </div>

      {/* 7 NAAC Criteria Progress Grid */}
      <SectionCard
        title="NAAC 7 Criteria Assessment & Readiness Grid"
        subtitle="Real-time verification progress against NAAC RAF benchmarks"
        actions={
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate('/iqac/accreditation')}
          >
            Criterion Drilldown <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {criteriaList.map((crit) => (
            <Card
              key={crit.id}
              hover
              onClick={() => navigate('/iqac/accreditation')}
              className="p-4 flex flex-col justify-between border-slate-200"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                  <span className="text-blue-600">{crit.code}</span>
                  <span className="text-slate-800 font-extrabold">{crit.completionPercentage}%</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-2">
                  {crit.name}
                </h4>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${
                      crit.completionPercentage >= 90
                        ? 'bg-emerald-500'
                        : crit.completionPercentage >= 75
                        ? 'bg-blue-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${crit.completionPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
                <span>Weighted CGPA</span>
                <span className="font-bold text-slate-800">{crit.currentScore} / {crit.maxScore}</span>
              </div>
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Two Column Layout: Audits Table & Quality Initiatives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Internal Academic & Administrative Audits (AAA)"
          subtitle="Audit schedule & observation tracker"
          actions={
            <Button
              variant="ghost"
              size="xs"
              onClick={() => navigate('/iqac/audits')}
            >
              View Audits <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          }
        >
          <div className="space-y-3">
            {audits.slice(0, 3).map((audit) => (
              <div
                key={audit.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {audit.auditType}
                    </span>
                    <span className="text-xs text-slate-500">{audit.targetDepartment}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">{audit.title}</h5>
                  <p className="text-[11px] text-slate-500">Lead Auditor: {audit.leadAuditor}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-700 block">{audit.scheduledDate}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">{audit.status}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Key Quality Initiatives (AY 2026-27)"
          subtitle="Strategic institutional enhancement programs"
          actions={
            <Button
              variant="ghost"
              size="xs"
              onClick={() => navigate('/iqac/initiatives')}
            >
              View Initiatives <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          }
        >
          <div className="space-y-3">
            {initiatives.slice(0, 3).map((init) => (
              <div
                key={init.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <h5 className="font-bold text-slate-900">{init.title}</h5>
                  <span className="text-xs font-extrabold text-blue-600">{init.currentProgress}%</span>
                </div>
                <p className="text-[11px] text-slate-500">{init.description}</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${init.currentProgress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
};
