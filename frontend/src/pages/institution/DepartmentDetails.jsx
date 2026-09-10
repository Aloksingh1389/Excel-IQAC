import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { institutionService } from '../../services/institutionService';
import { getDepartmentStatus } from '../../utils/institutionUtils';
import { StatCard } from '../../components/dashboard/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  GraduationCap, 
  Users, 
  Award, 
  Briefcase, 
  BookOpen, 
  Sparkles, 
  FlaskConical, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2,
  Trophy,
  Activity
} from 'lucide-react';

export const DepartmentDetails = () => {
  const { departmentId } = useParams();
  const { academicYear } = useAuth();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDept = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await institutionService.getDepartmentById(academicYear, departmentId);
        if (res.success && res.data) {
          setDepartment(res.data);
        }
      } catch (err) {
        console.error('Error fetching department details:', err);
        setError(err.message || 'Department not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchDept();
  }, [departmentId, academicYear]);

  if (loading) {
    return <Loader message={`Loading details for Department '${departmentId}'...`} />;
  }

  if (error || !department) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12 bg-white rounded-2xl border border-rose-200">
        <Building2 className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Department Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'The requested department could not be located.'}</p>
        <Button variant="primary" size="sm" icon={ArrowLeft} onClick={() => navigate('/director/institution/departments')}>
          Back to Departments
        </Button>
      </div>
    );
  }

  const status = getDepartmentStatus(department.passPercentage);

  return (
    <div className="space-y-6">
      {/* 1. Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/director/institution/departments')}
          >
            Back to Departments
          </Button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-50 text-indigo-700">
                {department.code}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {department.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Department Overview &bull; Established {department.established || 2001} &bull; Academic Year {academicYear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.colorClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${status.dotClass}`} />
            Status: {status.label}
          </span>
        </div>
      </div>

      {/* 2. Key Department Statistics (8 Grid StatCards) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Department Key Metrics (AY {academicYear})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatCard
            title="Total Students"
            value={Number(department.students).toLocaleString()}
            subtitle={`Male: ${department.maleStudents || 0} | Female: ${department.femaleStudents || 0}`}
            icon={GraduationCap}
            color="blue"
          />

          <StatCard
            title="Faculty Strength"
            value={department.faculty}
            subtitle="Full-Time Teaching Staff"
            icon={Users}
            color="emerald"
          />

          <StatCard
            title="Pass Percentage"
            value={`${department.passPercentage}%`}
            subtitle="Semester Exam Outcome"
            icon={Award}
            color="indigo"
          />

          <StatCard
            title="Placement Rate"
            value={`${department.placementPercentage}%`}
            subtitle="Campus Placements Record"
            icon={Briefcase}
            color="amber"
          />

          <StatCard
            title="Publications"
            value={department.publications}
            subtitle="Scopus / SCI Indexed"
            icon={BookOpen}
            color="indigo"
          />

          <StatCard
            title="Patents Filed / Granted"
            value={department.patents || 0}
            subtitle="IPR Innovations"
            icon={Sparkles}
            color="amber"
          />

          <StatCard
            title="Research Grants"
            value={department.researchProjects || 0}
            subtitle="Active Funded Projects"
            icon={FlaskConical}
            color="blue"
          />

          <StatCard
            title="FDP Participation"
            value={department.fdp || 0}
            subtitle="Faculty Training Hours"
            icon={Award}
            color="emerald"
          />
        </div>
      </div>

      {/* 3. Two Column Section: Department Performance & Student Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Breakdown Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Performance Pillar Summary</h4>
              <p className="text-xs text-slate-500">Key institutional benchmark dimensions</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Academic Standing</span>
              <div className="text-xl font-black text-slate-900">{department.passPercentage}%</div>
              <p className="text-[11px] text-slate-500">Overall Course Pass Rate</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Placement Record</span>
              <div className="text-xl font-black text-slate-900">{department.placementPercentage}%</div>
              <p className="text-[11px] text-slate-500">Tier-1 & Core Recruitment</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Research Productivity</span>
              <div className="text-xl font-black text-indigo-600">{department.publications} Papers</div>
              <p className="text-[11px] text-slate-500">Indexed Publications</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Intellectual Property</span>
              <div className="text-xl font-black text-amber-600">{department.patents || 0} Patents</div>
              <p className="text-[11px] text-slate-500">Inventions & Copyrights</p>
            </div>
          </div>
        </Card>

        {/* Student Body & Achievement Profile */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Student Profile & Achievements</h4>
              <p className="text-xs text-slate-500">Enrollment distribution and co-curricular awards</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Total Student Intake</span>
                <span className="text-base font-extrabold text-slate-900">{department.students} Enrolled</span>
              </div>
              <div className="text-right text-slate-600">
                <span>Male: <strong className="text-slate-800">{department.maleStudents || 0}</strong> ({Math.round(((department.maleStudents || 0) / department.students) * 100)}%)</span>
                <span className="block">Female: <strong className="text-slate-800">{department.femaleStudents || 0}</strong> ({Math.round(((department.femaleStudents || 0) / department.students) * 100)}%)</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Student Achievements</span>
                  <span className="text-slate-600 text-[11px]">Hackathons, Competitions & Fellowships</span>
                </div>
              </div>
              <span className="text-base font-black text-amber-800">
                {department.studentAchievements || 45} Wins
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Faculty Summary (Read-Only Table) */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Department Faculty Roster (Read-Only)</h4>
              <p className="text-xs text-slate-500">Key teaching staff, academic qualifications, and research contributions</p>
            </div>
          </div>
          <Badge variant="neutral" size="sm">
            Read-Only Executive View
          </Badge>
        </div>

        {department.facultyList && department.facultyList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-2.5 px-3">Faculty Member</th>
                  <th className="py-2.5 px-3">Designation</th>
                  <th className="py-2.5 px-3">Qualification</th>
                  <th className="py-2.5 px-3 text-center">Publications</th>
                  <th className="py-2.5 px-3 text-center">Research</th>
                  <th className="py-2.5 px-3 text-center">FDP Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {department.facultyList.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{fac.name}</td>
                    <td className="py-2.5 px-3 text-slate-700">{fac.designation}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">
                        {fac.qualification}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-indigo-600">{fac.publications}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-blue-600">{fac.research}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-600">{fac.fdp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
            Detailed faculty roster records are stored in Department HOD module.
          </div>
        )}
      </Card>

      {/* 5. Department Contact Information */}
      <Card className="p-6 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
          Department Contact & Administrative Location
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" /> Head of Department:
            </span>
            <span className="font-bold text-slate-900 text-sm block">{department.hod?.name || 'Dr. In-Charge'}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Institutional Email:
            </span>
            <span className="font-medium text-slate-800 block">{department.hod?.email || `hod.${department.code.toLowerCase()}@excel.edu`}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Intercom / Contact:
            </span>
            <span className="font-medium text-slate-800 block">{department.hod?.phone || '+91 98401 23456'}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Campus Location:
            </span>
            <span className="font-medium text-slate-800 block">{department.hod?.location || department.hod?.office || 'Academic Block'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
