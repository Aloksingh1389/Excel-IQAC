import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FlaskConical, 
  Award, 
  Clock, 
  PlusCircle, 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PageContainer, PageHeader, SectionCard, Card } from '../../components/layout/PageContainer';
import { StatCard, QuickActionCard } from '../../components/dashboard/StatCard';
import { ProfileCompletion } from '../../components/common/ProfileCompletion';
import { ActivityTimeline } from '../../components/common/ActivityTimeline';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { publicationService } from '../../services/publicationService';
import { researchService } from '../../services/researchService';
import { fdpService } from '../../services/researchService';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [publications, setPublications] = useState([]);
  const [research, setResearch] = useState([]);
  const [fdps, setFdps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaffData = async () => {
      try {
        const [pubRes, resRes, fdpRes] = await Promise.all([
          publicationService.getPublications({ userId: user?.id }),
          researchService.getResearch({ userId: user?.id }),
          fdpService.getFdps({ userId: user?.id }),
        ]);
        setPublications(pubRes.data);
        setResearch(resRes.data);
        setFdps(fdpRes.data);
      } finally {
        setLoading(false);
      }
    };
    if (user) loadStaffData();
  }, [user]);

  const pendingSubmissions = publications.filter((p) => p.status === 'SUBMITTED' || p.status === 'DRAFT').length;

  const activities = [
    {
      title: 'Publication Submitted',
      description: 'Submitted "Deep Learning for Automated Medical Image Segmentation" to IEEE Transactions.',
      timestamp: '2 hours ago',
      type: 'PUBLICATION',
      badge: 'Under Review',
    },
    {
      title: 'FDP Approved',
      description: 'HOD approved your participation in 5-day AICTE ATAL FDP on Cloud Computing.',
      timestamp: '1 day ago',
      type: 'APPROVAL',
      badge: 'Verified',
    },
    {
      title: 'Research Grant Status Update',
      description: 'DST-SERB CRG grant proposal passed Phase-1 Technical Review.',
      timestamp: '3 days ago',
      type: 'RESEARCH',
      badge: 'Active',
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${user?.name || 'Faculty Member'}`}
        subtitle={`${user?.designation || 'Faculty'} &bull; ${user?.departmentName || 'Department of Computer Science and Engineering'}`}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/publications/add')}
          >
            Add New Publication
          </Button>
        }
      />

      {/* Profile Completion Bar Banner */}
      <ProfileCompletion
        percentage={85}
        completedItems={['Personal Details', 'Education & PhD', 'Teaching Portfolio', 'Publications']}
        missingItems={['Sponsored Research Evidence', 'Patents Granted']}
      />

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Publications"
          value={publications.length}
          subtitle="4 in Scopus / SCI"
          icon={BookOpen}
          iconBg="bg-blue-50 text-blue-600"
          onClick={() => navigate('/publications')}
          trend={{ value: '+2', isPositive: true, label: 'this AY' }}
        />
        <StatCard
          title="Active Research"
          value={research.length}
          subtitle="₹28.5L in Grants"
          icon={FlaskConical}
          iconBg="bg-indigo-50 text-indigo-600"
          onClick={() => navigate('/research')}
          trend={{ value: '1 Grant', isPositive: true, label: 'DST-SERB' }}
        />
        <StatCard
          title="FDPs & Workshops"
          value={fdps.length}
          subtitle="75 Training Hours"
          icon={Award}
          iconBg="bg-emerald-50 text-emerald-600"
          onClick={() => navigate('/fdp')}
        />
        <StatCard
          title="Pending Submissions"
          value={pendingSubmissions}
          subtitle="Awaiting HOD / Dean"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
          onClick={() => navigate('/publications')}
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          title="Submit Publication"
          description="Log journal article, conference paper, or book chapter"
          icon={BookOpen}
          iconBg="bg-blue-100 text-blue-700"
          onClick={() => navigate('/publications/add')}
        />
        <QuickActionCard
          title="Log Research Grant"
          description="Record funded project proposals, seed grants & consultancy"
          icon={FlaskConical}
          iconBg="bg-indigo-100 text-indigo-700"
          onClick={() => navigate('/research')}
        />
        <QuickActionCard
          title="Upload FDP Certificate"
          description="Submit proof for AICTE / NPTEL / Industrial training"
          icon={Award}
          iconBg="bg-emerald-100 text-emerald-700"
          onClick={() => navigate('/fdp')}
        />
      </div>

      {/* Two Column Section: Recent Publications & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Recent Publications */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="My Recent Publications"
            subtitle="Verified academic papers submitted for IQAC NAAC assessment"
            actions={
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/publications')}
              >
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            <div className="space-y-3">
              {publications.slice(0, 3).map((pub) => (
                <div
                  key={pub.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
                        {pub.publicationType}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {pub.journal} ({pub.publicationYear})
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {pub.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Indexing: <strong className="text-slate-700">{pub.indexing}</strong> &bull; Impact Factor: <strong className="text-slate-700">{pub.impactFactor || '3.42'}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={pub.status} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right 1 Col: Recent Submission Activity */}
        <div className="space-y-4">
          <SectionCard
            title="Submission Activity"
            subtitle="Real-time status updates"
          >
            <ActivityTimeline activities={activities} />
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
};
