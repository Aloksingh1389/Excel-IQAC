import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDesignationDisplay } from '../../config/roles';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Clock,
  IdCard 
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98401 22334',
    employeeId: user?.employeeId || 'DIR-1001',
    dateOfJoining: user?.dateOfJoining || '2018-08-15',
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');

    try {
      await updateUser(formData);
      setSuccessMessage('Profile details updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const designationLabel = getDesignationDisplay(user?.designation, user?.role);

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="pb-2 border-b border-slate-200/80">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Executive Profile
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Manage your institutional identity, contact credentials, and executive records.
        </p>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identity Summary Card & Account Info */}
        <div className="space-y-6">
          <Card className="p-6 text-center space-y-4">
            <div className="inline-block relative">
              <Avatar
                src={user?.avatar}
                name={user?.name || 'User'}
                size="xl"
                className="mx-auto shadow-xs"
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
              <Badge variant="primary" size="md">
                {designationLabel}
              </Badge>
              <Badge variant="success" size="md">
                {user?.status || 'ACTIVE'}
              </Badge>
            </div>
          </Card>

          {/* Account System Information */}
          <Card className="p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Account Information
            </h4>

            <div className="space-y-2.5 text-xs divide-y divide-slate-100">
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">Account Status:</span>
                <span className="font-bold text-emerald-700">{user?.status || 'Active'}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">Last Login:</span>
                <span className="font-medium text-slate-800">{user?.lastLogin || 'Today at 08:45 AM'}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">Account Created:</span>
                <span className="font-medium text-slate-800">{user?.accountCreated || '2024-01-10'}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">Internal Role:</span>
                <span className="font-mono text-[11px] text-slate-600">{user?.role}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 2 Columns: Editable Profile Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSave} className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Personal & Institutional Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  icon={User}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <Input
                  label="Employee ID"
                  required
                  disabled
                  helperText="Employee ID is institutional fixed identifier"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                />

                <Input
                  label="Institutional Email"
                  type="email"
                  required
                  icon={Mail}
                  disabled
                  helperText="Email is bound to SSO login"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <Input
                  label="Contact Phone"
                  icon={Phone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <Input
                  label="Designation"
                  disabled
                  value={designationLabel}
                />

                <Input
                  label="Date of Joining"
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Save}
                  loading={saving}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
