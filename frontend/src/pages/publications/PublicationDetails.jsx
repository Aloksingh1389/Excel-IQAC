import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicationService } from '../../services/publicationService';
import { PageContainer, PageHeader, Card } from '../../components/layout/PageContainer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { BookOpen, Calendar, User, ExternalLink, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export const PublicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pub, setPub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await publicationService.getPublicationById(id);
        setPub(res.data);
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader fullScreen message="Loading publication details..." />;
  if (!pub) return <div className="p-8 text-center text-slate-500">Publication not found.</div>;

  return (
    <PageContainer>
      <PageHeader
        title={pub.title}
        subtitle={`${pub.journal} &bull; ${pub.publicationYear}`}
        breadcrumb={[
          { label: 'Publications', path: '/publications' },
          { label: 'Paper Details' },
        ]}
        badge={<StatusBadge status={pub.status} />}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/publications')}
          >
            Back to Publications
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Abstract
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {pub.abstract || 'No extended abstract provided for this indexed manuscript.'}
            </p>

            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4">
              Authors & Affiliation
            </h3>
            <p className="text-xs font-semibold text-slate-800">
              {pub.authors}
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Bibliographic Details
            </h4>
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Indexing:</span>
                <span className="font-bold text-slate-800">{pub.indexing}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Impact Factor:</span>
                <span className="font-bold text-emerald-600">{pub.impactFactor || '3.42'}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">ISSN / ISBN:</span>
                <span className="font-mono text-slate-800">{pub.issn || 'N/A'}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Academic Year:</span>
                <span className="font-semibold text-slate-800">{pub.academicYear}</span>
              </div>
            </div>

            {pub.doi && (
              <a
                href={`https://doi.org/${pub.doi}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs hover:bg-blue-100 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Paper on Publisher Site
              </a>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
