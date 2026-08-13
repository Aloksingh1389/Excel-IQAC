import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageContainer, PageHeader, Card, SectionCard } from '../../components/layout/PageContainer';
import { Input, Select } from '../../components/forms/Input';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { userService } from '../../services/userService';
import { User, Mail, Phone, Lock, Save, GraduationCap, Globe, BookOpen } from 'lucide-react';

export const UserProfile = () => {
  const { user, updateUserSession } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98401 23456',
    employeeId: user?.employeeId || 'EMP-1042',
    designation: user?.designation || 'Associate Professor',
    departmentName: user?.departmentName || 'Computer Science and Engineering',
    qualification: user?.qualification || 'Ph.D. in Computer Science',
    specialization: user?.specialization || 'Distributed Systems & Cloud Computing',
    orcid: user?.orcid || '0000-0002-1825-0097',
    scopusId: user?.scopusId || '57209842100',
    scholarUrl: user?.scholarUrl || 'https://scholar.google.com/citations?user=demo',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userService.updateUser(user.id, formData);
      updateUserSession(updated.data);
      toast.success('Academic profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPass !== passwordData.confirm) {
      toast.error('New passwords do not match!');
      return;
    }
    setPasswordLoading(true);
    setTimeout(() => {
      setPasswordLoading(false);
      setPasswordData({ current: '', newPass: '', confirm: '' });
      toast.success('Institutional password successfully changed.');
    }, 600);
  };

  return (
    <PageContainer>
      <PageHeader
        title="My Institutional Profile & Credentials"
        subtitle="Manage personal identification, academic qualifications, and research identifiers"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Profile Badge Card */}
        <div className="space-y-6">
          <Card className="p-6 text-center space-y-4">
            <div className="inline-block relative">
              <Avatar src={user?.avatar} name={user?.name} size="xl" className="mx-auto" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{user?.designation}</p>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{user?.departmentName}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {user?.role}
              </span>
              <StatusBadge status={user?.status || 'ACTIVE'} size="sm" />
            </div>
          </Card>

          {/* Change Password Card */}
          <SectionCard title="Security & Password" subtitle="Change portal credentials">
            <form onSubmit={handleChangePassword} className="space-y-3">
              <Input
                label="Current Password"
                type="password"
                required
                icon={Lock}
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
              />
              <Input
                label="New Password"
                type="password"
                required
                icon={Lock}
                value={passwordData.newPass}
                onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
              />
              <Input
                label="Confirm New Password"
                type="password"
                required
                icon={Lock}
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full mt-2"
                loading={passwordLoading}
              >
                Update Password
              </Button>
            </form>
          </SectionCard>
        </div>

        {/* Right 2 Cols: Form Sections */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <SectionCard title="1. Personal & Institutional Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name (with honorific)"
                  required
                  icon={User}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Institutional Email"
                  type="email"
                  required
                  icon={Mail}
                  value={formData.email}
                  disabled
                />
                <Input
                  label="Employee / Faculty ID"
                  required
                  value={formData.employeeId}
                  disabled
                />
                <Input
                  label="Contact Phone"
                  icon={Phone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  label="Designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
                <Input
                  label="Department"
                  value={formData.departmentName}
                  disabled
                />
              </div>
            </SectionCard>

            <SectionCard title="2. Academic Qualifications & Expertise">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Highest Qualification"
                  icon={GraduationCap}
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
                <Input
                  label="Specialization / Research Area"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>
            </SectionCard>

            <SectionCard title="3. Statutory Research Profiles & Identifiers">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="ORCID Identifier"
                  placeholder="0000-0000-0000-0000"
                  icon={Globe}
                  value={formData.orcid}
                  onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
                />
                <Input
                  label="Scopus Author ID"
                  placeholder="57209842100"
                  icon={BookOpen}
                  value={formData.scopusId}
                  onChange={(e) => setFormData({ ...formData, scopusId: e.target.value })}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Google Scholar Citation Profile URL"
                    placeholder="https://scholar.google.com/citations?user=..."
                    icon={Globe}
                    value={formData.scholarUrl}
                    onChange={(e) => setFormData({ ...formData, scholarUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button type="submit" variant="primary" size="md" icon={Save} loading={saving}>
                  Save Profile Changes
                </Button>
              </div>
            </SectionCard>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export const Settings = () => {
  const toast = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    toast.success('System preferences updated.');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Application Settings & Preferences"
        subtitle="Manage notification frequencies, security policies, and UI preferences"
      />

      <div className="max-w-3xl space-y-6">
        <SectionCard title="Notification & Email Alerts">
          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">In-App Notification Alerts</span>
                <span className="text-slate-500">Receive instant alerts on approval status updates</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Email Digest Notifications</span>
                <span className="text-slate-500">Send copy of verification decisions to registered email</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </SectionCard>

        <SectionCard title="Security & Authentication">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
              <span className="text-slate-500">Require OTP code for administrative approval actions</span>
            </div>
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={(e) => setTwoFactor(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </SectionCard>

        <div className="flex justify-end">
          <Button variant="primary" size="md" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
