import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReports } from '../../hooks/useReports';
import { useAuth } from '../../context/AuthContext';
import { REPORT_CONFIGS } from '../../config/reportConfig';
import { ReportCard } from '../../components/reports/ReportCard';
import { QuickReportCard } from '../../components/reports/QuickReportCard';
import { ReportFilterBar } from '../../components/reports/ReportFilterBar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { 
  FileText, 
  Sparkles, 
  Clock, 
  History, 
  Plus, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export const ReportCenter = () => {
  const { user, academicYear } = useAuth();
  const {
    categories,
    reportTypes,
    history,
    favorites,
    loading,
    error,
    toggleFavorite,
  } = useReports();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState(academicYear || '2026-27');

  if (loading) {
    return <Loader message="Loading Institutional Report Center & Catalogs..." />;
  }

  const isTechnicalDirector = user?.designation === 'TECHNICAL_DIRECTOR';

  // Filter reports by search & category
  const filteredReports = reportTypes.filter((rpt) => {
    const matchesCat = selectedCategory === 'ALL' || rpt.category === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      rpt.name.toLowerCase().includes(q) ||
      rpt.description.toLowerCase().includes(q) ||
      rpt.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const popularReports = reportTypes.filter((r) => r.isPopular).slice(0, 4);
  const favoriteReports = reportTypes.filter((r) => favorites.includes(r.id));
  const recentReports = (history || []).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* 1. Header with Executive Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-indigo-100 text-indigo-900">
              {isTechnicalDirector ? 'Institutional Dossier Center' : 'Executive Report Center'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Report Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Generate, view, and manage institutional statutory dossiers, performance audits, and accreditation records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/director/reports/history">
            <Button variant="outline" size="sm" icon={History}>
              Report History ({history.length})
            </Button>
          </Link>
          <Link to="/director/reports/generate">
            <Button variant="primary" size="sm" icon={Plus}>
              Generate Report
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Quick Generate Shortcuts Strip (Popular Reports) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Quick Report Generation Shortcuts
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Standard Statutory Dossiers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {popularReports.map((rpt) => (
            <QuickReportCard key={rpt.id} report={rpt} />
          ))}
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <ReportFilterBar
        search={search}
        onSearchChange={setSearch}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
        academicYear={selectedYear}
        onAcademicYearChange={setSelectedYear}
        onClear={() => {
          setSearch('');
          setSelectedCategory('ALL');
        }}
        categories={categories}
        showDepartment={false}
      />

      {/* 4. Favorite Reports (if any) */}
      {favoriteReports.length > 0 && selectedCategory === 'ALL' && !search && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            My Pinned Favorite Reports ({favoriteReports.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteReports.map((rpt) => (
              <ReportCard
                key={`fav-${rpt.id}`}
                report={rpt}
                isFavorite
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Complete Reports Catalog Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Report Catalog ({filteredReports.length} Available Templates)
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            Category: <strong>{selectedCategory}</strong>
          </span>
        </div>

        {filteredReports.length === 0 ? (
          <Card className="p-8 text-center space-y-2">
            <p className="text-xs font-bold text-slate-600">No report templates match your search filter.</p>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                setSearch('');
                setSelectedCategory('ALL');
              }}
            >
              Clear Search Filter
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((rpt) => (
              <ReportCard
                key={rpt.id}
                report={rpt}
                isFavorite={favorites.includes(rpt.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* 6. Recently Generated Reports Strip */}
      {recentReports.length > 0 && (
        <Card className="p-5 space-y-3 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recently Generated Dossiers
              </h3>
            </div>
            <Link
              to="/director/reports/history"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentReports.map((rpt) => (
              <Link
                key={rpt.id}
                to={`/director/reports/${rpt.id}`}
                className="p-3 bg-slate-50 hover:bg-indigo-50/60 rounded-xl border border-slate-200 hover:border-indigo-200 transition space-y-1 block group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-indigo-700">{rpt.id}</span>
                  <span className="text-[10px] font-semibold text-slate-400">{rpt.generatedDate}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 truncate">
                  {rpt.title}
                </h4>
                <div className="text-[10px] text-slate-500 truncate">
                  Generated by {rpt.generatedBy}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
