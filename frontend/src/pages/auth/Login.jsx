import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { GraduationCap, Mail, Lock, Sparkles, Shield, UserCheck, Award, Building2, User } from 'lucide-react';
import { MOCK_USERS } from '../../data/mockUsers';

export const Login = () => {
  const [email, setEmail] = useState('technical@iqac.demo');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your employee ID or institutional email.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const loggedInUser = await login(email, password);
      // STAFF Portal redirect (Stage 6)
      if (loggedInUser?.role === 'STAFF') {
        navigate('/staff', { replace: true });
      } else {
        navigate('/iqac/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoUser) => {
    setEmail(demoUser.email);
    setPassword('password123');
    setLoading(true);
    setErrorMessage('');

    try {
      const loggedInUser = await login(demoUser.email, 'password123');
      // STAFF Portal redirect (Stage 6)
      if (loggedInUser?.role === 'STAFF') {
        navigate('/staff', { replace: true });
      } else {
        navigate('/iqac/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl space-y-6">
        {/* Institutional Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              EXCEL-IQAC MANAGEMENT SYSTEM
            </h1>
            <p className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
              Stage 5A &bull; IQAC Dashboard & Structure
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 sm:p-8 shadow-sm border-slate-200">
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Employee ID / Email"
              type="email"
              required
              icon={Mail}
              placeholder="e.g. technical@iqac.demo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-600 font-medium">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Log In to Portal
            </Button>
          </form>

          {/* 1-Click Demo Accounts Selector */}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                1-Click Institutional Role Logins
              </span>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                Stage 5A Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {MOCK_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickDemo(u)}
                  className="p-2.5 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-200 transition cursor-pointer group"
                >
                  <div className="font-bold text-slate-900 group-hover:text-indigo-950 flex items-center justify-between">
                    <span className="truncate">{u.role.replace(/_/g, ' ')}</span>
                    <Shield className="w-3 h-3 text-indigo-600 shrink-0 ml-1" />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{u.name} ({u.departmentCode || 'Institutional'})</div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400">
          Excel-IQAC Management System &bull; Stage 5A Institutional Quality & Governance Framework
        </p>
      </div>
    </div>
  );
};
