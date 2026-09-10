import React from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ACADEMIC_YEARS } from '../../data/mockAcademicYears';

export const AcademicYearSelector = ({ className = '' }) => {
  const { academicYear, setAcademicYear } = useAuth();

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 transition ${className}`}
    >
      <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline text-slate-400 font-medium select-none">AY:</span>
      <select
        value={academicYear}
        onChange={(e) => setAcademicYear(e.target.value)}
        aria-label="Select Academic Year"
        className="bg-transparent border-0 font-bold text-slate-800 text-xs focus:ring-0 focus:outline-none cursor-pointer pr-1"
      >
        {MOCK_ACADEMIC_YEARS.map((ay) => (
          <option key={ay.id} value={ay.label}>
            {ay.label} {ay.isCurrent ? '(Current)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};
