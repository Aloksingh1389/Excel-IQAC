import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ChevronRight, 
  Info, 
  Sparkles,
  BookOpen,
  Briefcase,
  Users,
  GraduationCap,
  FlaskConical
} from 'lucide-react';

export const DepartmentScorecard = ({ scorecards = [], onSelectDept = null }) => {
  const [selectedDeptId, setSelectedDeptId] = useState(scorecards[0]?.id || 'CSE');

  const selectedScorecard =
    scorecards.find((s) => s.id === selectedDeptId) || scorecards[0];

  if (!scorecards || scorecards.length === 0) return null;

  const pillars = [
    { label: 'Academic Standing', key: 'academic', icon: GraduationCap, color: 'bg-emerald-500' },
    { label: 'Research Output', key: 'research', icon: BookOpen, color: 'bg-indigo-500' },
    { label: 'Placement Performance', key: 'placement', icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Faculty Development', key: 'faculty', icon: Users, color: 'bg-amber-500' },
    { label: 'Student Development', key: 'studentDev', icon: Award, color: 'bg-purple-500' },
    { label: 'IPR & Innovation', key: 'innovation', icon: Sparkles, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-4">
      {/* Demo Calculation Disclaimer Alert */}
      <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-start gap-2.5 text-xs text-indigo-900">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Institutional Performance Score &bull; Demo / Mock Calculation</span>
          <span className="text-indigo-700/90 text-[11px]">
            Weighted multidimensional assessment model based on 6 quality indicators. Configurable for institutional decision support.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Department Ranking Table */}
        <Card className="p-5 lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Department Rankings</h3>
            <span className="text-[11px] text-slate-400 font-semibold">12 Departments</span>
          </div>

          <div className="max-h-[460px] overflow-y-auto space-y-1.5 custom-scroll pr-1">
            {scorecards.map((dept, index) => {
              const isSelected = selectedDeptId === dept.id;
              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isSelected ? 'bg-indigo-500 text-white' : index < 3 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {dept.rank || index + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate leading-tight">{dept.name}</h4>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {dept.code}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-sm font-black">{dept.overallScore}</span>
                    <span className="text-[10px] opacity-75">/100</span>
                    {dept.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                    {dept.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                    {dept.trend === 'same' && <Minus className="w-3.5 h-3.5 opacity-60" />}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right 2 Columns: Detailed Scorecard of Selected Department */}
        {selectedScorecard && (
          <Card className="p-6 lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-100 text-indigo-800">
                    Rank #{selectedScorecard.rank || 1} &bull; {selectedScorecard.code}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedScorecard.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multidimensional Quality Index Breakdown
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-700 block">Overall Score</span>
                  <span className="text-2xl font-black text-indigo-900">{selectedScorecard.overallScore}</span>
                  <span className="text-[10px] text-slate-500"> / 100</span>
                </div>

                <Link to={`/director/institution/departments/${selectedScorecard.id}`}>
                  <Button variant="outline" size="xs">
                    View Dept
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* 6 Quality Pillars Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((p) => {
                const score = selectedScorecard[p.key] || 80;
                const IconComponent = p.icon;
                return (
                  <div key={p.key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <IconComponent className="w-3.5 h-3.5 text-indigo-600" />
                        {p.label}
                      </span>
                      <span className="font-extrabold text-slate-900">{score} / 100</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${p.color}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
