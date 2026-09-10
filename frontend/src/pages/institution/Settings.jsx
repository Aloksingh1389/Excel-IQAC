import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  Monitor, 
  CheckCircle2, 
  Save, 
  Shield 
} from 'lucide-react';

export const Settings = () => {
  const { theme, setTheme } = useAuth();

  const [passwordData, setPasswordData] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    system: true,
    approvals: true,
  });

  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordData.newPass.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPass !== passwordData.confirm) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswordSuccess(true);
      setPasswordData({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Heading */}
      <div className="pb-2 border-b border-slate-200/80">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Portal Settings
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Manage your account security, notification frequencies, and visual appearance.
        </p>
      </div>

      {/* 1. Account & Password Section */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Security & Password</h3>
            <p className="text-xs text-slate-500">Update your portal authentication credentials.</p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Password updated successfully.</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <Input
            label="Current Password"
            type="password"
            required
            placeholder="••••••••"
            value={passwordData.current}
            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
          />

          <Input
            label="New Password"
            type="password"
            required
            placeholder="••••••••"
            value={passwordData.newPass}
            onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            required
            placeholder="••••••••"
            value={passwordData.confirm}
            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={loading}
          >
            Update Password
          </Button>
        </form>
      </Card>

      {/* 2. Notification Preferences */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Notification Preferences</h3>
            <p className="text-xs text-slate-500">Configure how and when you receive system alerts.</p>
          </div>
        </div>

        <div className="space-y-3 max-w-xl text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div className="space-y-0.5 pr-4">
              <span className="font-bold text-slate-800 block">Email Notifications</span>
              <span className="text-slate-500 text-[11px]">
                Receive executive digests and critical submissions directly to your email.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div className="space-y-0.5 pr-4">
              <span className="font-bold text-slate-800 block">System Activity Alerts</span>
              <span className="text-slate-500 text-[11px]">
                Notify when departments upload annual data or report submissions.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.system}
              onChange={(e) => setNotifications({ ...notifications, system: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div className="space-y-0.5 pr-4">
              <span className="font-bold text-slate-800 block">Approval & Verification Requests</span>
              <span className="text-slate-500 text-[11px]">
                Instant notifications for items requiring institutional executive endorsement.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.approvals}
              onChange={(e) => setNotifications({ ...notifications, approvals: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>
      </Card>

      {/* 3. Appearance Settings */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Appearance & Theme</h3>
            <p className="text-xs text-slate-500">Customize the visual presentation of the ERP shell.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="p-2 rounded-lg bg-white border border-slate-200 text-amber-500">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Light Mode</div>
              <div className="text-[10px] text-slate-500">Standard ERP</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Dark Mode</div>
              <div className="text-[10px] text-slate-500">High Contrast</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
              theme === 'system'
                ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">System Auto</div>
              <div className="text-[10px] text-slate-500">Match OS</div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
};
