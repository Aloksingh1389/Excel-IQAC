import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { DepartmentQualitySummary } from '../../components/department';

export const DepartmentQuality = () => {
  const { user, academicYear } = useAuth();
  const [quality, setQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    departmentPortalService.getDepartmentQuality(user, academicYear)
      .then((res) => { if (!cancelled) setQuality(res.data); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load quality data.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role, user?.departmentCode, academicYear]);

  if (loading) return <Loader message="Loading department quality..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  const notes = [];
  if (quality?.categories) {
    Object.entries(quality.categories).forEach(([k, v]) => {
      if (typeof v === 'number' && v < 65) notes.push(`${k} needs attention (${v}%)`);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Quality</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Quality indicators for your department</p>
      </div>
      <DepartmentQualitySummary quality={quality} />
      {notes.length > 0 && (
        <Card className="p-4 sm:p-6 space-y-2">
          <h3 className="text-base font-bold text-slate-900">Attention Notes</h3>
          <ul className="space-y-1.5 text-xs">
            {notes.map((n) => (
              <li key={n} className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold">{n}</li>
            ))}
          </ul>
        </Card>
      )}
      <Link to="/iqac/quality-monitoring" className="inline-block text-xs font-bold text-indigo-700 hover:underline">View institutional quality monitoring</Link>
    </div>
  );
};
