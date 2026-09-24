import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStaff } from '../../hooks/useStaff';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Save, User, BookOpen, Briefcase, FlaskConical, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const SECTIONS = [
  { id: 'personal', label: 'Personal Information', icon: User },
  { id: 'academic', label: 'Academic Qualifications', icon: BookOpen },
  { id: 'experience', label: 'Professional Experience', icon: Briefcase },
  { id: 'research', label: 'Research Profiles', icon: FlaskConical },
  { id: 'contact', label: 'Contact Information', icon: Phone },
];

export const StaffProfile = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { profile, loading, updateProfile } = useStaff();

  const [activeSection, setActiveSection] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  if (loading || !profile) {
    return <Loader message="Loading Faculty Staff Profile Editor..." />;
  }

  const currentData = { ...profile, ...formData };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully.');
      setFormData({});
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link to="/staff" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Faculty & Staff Profile</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Profile Completion: <span className="font-black text-emerald-700">{profile.completionPercentage}%</span>
            </p>
          </div>
        </div>
        <Button variant="primary" size="md" onClick={handleSave} loading={saving} icon={Save}>
          Save Changes
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div
          className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${profile.completionPercentage}%` }}
        />
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Nav */}
        <Card className="p-3 space-y-1 bg-slate-50 border-slate-200 h-fit">
          <p className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">Profile Sections</p>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeSection === sec.id ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </Card>

        {/* Section Content */}
        <Card className="lg:col-span-3 p-5 sm:p-6 space-y-4 bg-white border-slate-200">
          {activeSection === 'personal' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-sm font-bold text-slate-900 border-b pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Full Name</label>
                  <input name="name" value={currentData.name || ''} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Designation</label>
                  <input name="designation" value={currentData.designation || ''} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Department</label>
                  <input name="departmentCode" value={currentData.departmentCode || ''} readOnly
                    className="w-full px-3 py-2 border rounded-xl bg-slate-100 font-medium text-slate-400 cursor-not-allowed" />
                  <p className="text-[10px] text-slate-400">Contact admin to change department</p>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Date of Joining</label>
                  <input type="date" name="dateOfJoining" value={currentData.dateOfJoining || ''} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'academic' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-sm font-bold text-slate-900 border-b pb-2">Academic Qualifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Highest Qualification</label>
                  <input name="qualification" value={currentData.qualification || ''} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Specialization</label>
                  <input name="specialization" value={currentData.specialization || ''} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">University / Institution</label>
                  <input name="university" value={currentData.university || ''} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-sm font-bold text-slate-900 border-b pb-2">Professional Experience</h2>
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Total Experience (Years)</label>
                <input type="number" name="experienceYears" value={currentData.experienceYears || ''} onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none max-w-xs" />
              </div>
            </div>
          )}

          {activeSection === 'research' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-sm font-bold text-slate-900 border-b pb-2">Research Profile IDs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">ORCID iD</label>
                  <input name="orcidId" value={currentData.orcidId || ''} onChange={handleChange} placeholder="0000-0000-0000-0000"
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Scopus Author ID</label>
                  <input name="scopusId" value={currentData.scopusId || ''} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block font-bold text-slate-700">Google Scholar Profile URL</label>
                  <input name="googleScholarUrl" value={currentData.googleScholarUrl || ''} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-sm font-bold text-slate-900 border-b pb-2">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Official Email</label>
                  <input name="email" value={currentData.email || ''} readOnly
                    className="w-full px-3 py-2 border rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed font-medium" />
                  <p className="text-[10px] text-slate-400">Email managed by institution admin</p>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Mobile Number</label>
                  <input name="phone" value={currentData.phone || ''} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50/50 font-medium focus:outline-none" />
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
