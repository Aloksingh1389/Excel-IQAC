import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStaff } from '../../hooks/useStaff';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const MyActivities = () => {
  const { user } = useAuth();
  const { loading } = useStaff();

  if (loading) return <Loader message="Loading My IQAC Activities..." />;

  // Simulated personal activities for this staff member
  const activities = [
    { id: 'act_001', title: 'IQAC Department Quality Audit Drive', category: 'Quality Activity', date: '2026-09-05', status: 'COMPLETED', role: 'Participant' },
    { id: 'act_002', title: 'ATAL FDP on AI/ML for Academic Excellence', category: 'FDP', date: '2026-08-20', status: 'COMPLETED', role: 'Participant' },
    { id: 'act_003', title: 'Research Funding Proposal Submission Drive', category: 'Research', date: '2026-09-15', status: 'IN_PROGRESS', role: 'Coordinator' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
        <Link to="/staff" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My IQAC Activities</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Activities where I am a participant, organizer, or assigned contributor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((act) => (
          <Card key={act.id} className="p-4 space-y-3 bg-white border-slate-200 hover:border-indigo-300 transition">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-xs leading-snug">{act.title}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 ${
                act.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>{act.status}</span>
            </div>
            <div className="text-[10px] text-slate-500 space-y-0.5 font-medium">
              <p><span className="font-bold">Category:</span> {act.category}</p>
              <p><span className="font-bold">Date:</span> {act.date}</p>
              <p><span className="font-bold">My Role:</span> {act.role}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
