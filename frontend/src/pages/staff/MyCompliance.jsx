import React from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const MyCompliance = () => {
  // Simulated personal compliance items scoped to this staff member
  const complianceItems = [
    { id: 'comp_001', title: 'Annual Faculty Profile Completion', deadline: '2026-09-30', status: 'IN_PROGRESS', progress: 85, description: 'Complete all sections of faculty profile including research IDs.' },
    { id: 'comp_002', title: 'Annual Data Submission (Publications & Research)', deadline: '2026-09-30', status: 'PENDING', progress: 40, description: 'Submit all publications, FDPs, and research projects for AY 2025-26.' },
    { id: 'comp_003', title: 'NAAC Evidence Upload Requirement', deadline: '2026-10-15', status: 'COMPLETED', progress: 100, description: 'Upload verified evidence files for NAAC Criterion 3 metrics.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
        <Link to="/staff" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Compliance Tasks</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Personal compliance requirements — profile completion, annual data submissions, evidence requirements</p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
        Only compliance tasks directly assigned or relevant to you are shown here. Institutional compliance configuration is managed by IQAC.
      </div>

      <div className="space-y-4">
        {complianceItems.map((item) => (
          <Card key={item.id} className={`p-5 space-y-3 border-2 ${
            item.status === 'COMPLETED' ? 'border-emerald-200 bg-emerald-50/30' :
            item.status === 'IN_PROGRESS' ? 'border-amber-200' : 'border-slate-200'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 font-medium">{item.description}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                item.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                item.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
              }`}>{item.status}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-600">
                <span>Progress: {item.progress}%</span>
                <span>Deadline: {item.deadline}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${
                  item.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-indigo-500'
                }`} style={{ width: `${item.progress}%` }} />
              </div>
            </div>

            {item.status !== 'COMPLETED' && (
              <div className="flex gap-2 pt-1">
                <Link to={item.id.includes('comp_001') ? '/staff/profile' : '/staff/submissions/create'}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition">
                  {item.status === 'PENDING' ? 'Start Now' : 'Continue'}
                </Link>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
