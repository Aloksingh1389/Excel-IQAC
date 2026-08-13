import React, { useState, useEffect } from 'react';
import { PageContainer, PageHeader, Card, SectionCard } from '../../components/layout/PageContainer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { EvidenceViewerModal } from '../../components/approval/ApprovalActionModal';
import { accreditationService } from '../../services/qualityService';
import { ShieldCheck, FileText, CheckCircle2, ChevronRight, Eye, Sparkles } from 'lucide-react';

export const AccreditationCriteria = () => {
  const [criteria, setCriteria] = useState([]);
  const [selectedCrit, setSelectedCrit] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await accreditationService.getCriteria();
      setCriteria(res.data);
      if (res.data.length > 0) setSelectedCrit(res.data[0]);
    };
    load();
  }, []);

  const metricsMock = [
    {
      code: '3.1.1',
      title: 'Grants received from Government and non-governmental agencies for research projects',
      type: 'Quantitative',
      target: '₹5.00 Cr',
      actual: '₹7.85 Cr',
      score: 3.85,
      evidenceFile: 'Grants_Sanction_Compilation.pdf',
    },
    {
      code: '3.2.1',
      title: 'Institution has created an ecosystem for innovations including Incubation centre',
      type: 'Qualitative',
      target: 'Established Incubator',
      actual: '12 Active Startups',
      score: 3.90,
      evidenceFile: 'Incubation_Centre_Report.pdf',
    },
    {
      code: '3.3.1',
      title: 'Number of research papers published per teacher in the Journals notified on UGC CARE',
      type: 'Quantitative',
      target: '1.5 papers/faculty',
      actual: '1.82 papers/faculty',
      score: 3.75,
      evidenceFile: 'UGC_Scopus_Papers_List.pdf',
    },
    {
      code: '3.4.1',
      title: 'Extension activities carried out in the neighborhood community',
      type: 'Quantitative',
      target: '25 Programs',
      actual: '34 Programs',
      score: 4.00,
      evidenceFile: 'NSS_Extension_Activities.pdf',
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="NAAC / NBA Accreditation Criteria Management"
        subtitle="7 Criteria Institutional Self Study Report (SSR) metric compliance & evidence locker"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: 7 Criteria List */}
        <div className="space-y-2">
          {criteria.map((crit) => (
            <button
              key={crit.id}
              onClick={() => setSelectedCrit(crit)}
              className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                selectedCrit?.id === crit.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="min-w-0 pr-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                  selectedCrit?.id === crit.id ? 'text-blue-100' : 'text-blue-600'
                }`}>
                  {crit.code}
                </span>
                <h4 className="text-xs font-bold truncate mt-0.5">{crit.name}</h4>
                <div className={`text-[11px] mt-1 ${
                  selectedCrit?.id === crit.id ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  Score: <strong className={selectedCrit?.id === crit.id ? 'text-white' : 'text-slate-800'}>{crit.currentScore} / {crit.maxScore}</strong> &bull; {crit.completionPercentage}%
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 ${
                selectedCrit?.id === crit.id ? 'text-white' : 'text-slate-400'
              }`} />
            </button>
          ))}
        </div>

        {/* Right 3 Cols: Metric Detail Locker */}
        <div className="lg:col-span-3 space-y-6">
          {selectedCrit && (
            <SectionCard
              title={`${selectedCrit.code}: ${selectedCrit.name}`}
              subtitle={`Weighted Cumulative Metric CGPA: ${selectedCrit.currentScore} / ${selectedCrit.maxScore}`}
            >
              <div className="space-y-4">
                {metricsMock.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 font-mono">
                          {m.code}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                          {m.type}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-emerald-700">
                          Score: {m.score} / 4.0
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {m.title}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-slate-400 block text-[10px] font-semibold">Institutional Target</span>
                        <span className="font-bold text-slate-700">{m.target}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-slate-400 block text-[10px] font-semibold">Verified Actual</span>
                        <span className="font-bold text-blue-600">{m.actual}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 col-span-2 sm:col-span-1 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold">Evidence</span>
                          <span className="font-medium text-slate-700 truncate max-w-[100px] block">
                            {m.evidenceFile}
                          </span>
                        </div>
                        <button
                          onClick={() => setPreviewDoc(m)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      <EvidenceViewerModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        evidenceName={previewDoc?.evidenceFile}
        title={previewDoc?.title}
        category={`Metric ${previewDoc?.code}`}
      />
    </PageContainer>
  );
};
