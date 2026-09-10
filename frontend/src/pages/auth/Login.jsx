import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { GraduationCap, Mail, Lock, Sparkles, Shield, UserCheck } from 'lucide-react';
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
      const user = await login(email, password);
      if (user.role === 'INSTITUTION_ADMIN') {
        navigate('/director/dashboard', { replace: true });
      } else {
        navigate('/director/dashboard', { replace: true });
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
      await login(demoUser.email, 'password123');
      navigate('/director/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* Institutional Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              IQAC MANAGEMENT SYSTEM
            </h1>
            <p className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
              Institutional Command & Quality Portal
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
                1-Click Institutional Logins
              </span>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                Stage 3 Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo(MOCK_USERS[0])}
                className="p-2.5 text-left rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition cursor-pointer group"
              >
                <div className="text-xs font-bold text-indigo-950 flex items-center justify-between">
                  <span>Technical Director</span>
                  <Shield className="w-3 h-3 text-indigo-600" />
                </div>
                <div className="text-[10px] text-slate-500 truncate">Dr. Vikram Seth (Apex)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(MOCK_USERS[1])}
                className="p-2.5 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-200 transition cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 flex items-center justify-between">
                  <span>Exec Dir & Principal</span>
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="text-[10px] text-slate-500 truncate">Dr. H. J. Bhabha</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(MOCK_USERS[2])}
                className="p-2.5 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-900">
                  IQAC Coordinator
                </div>
                <div className="text-[10px] text-slate-500 truncate">Dr. M. S. Swaminathan</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(MOCK_USERS[3])}
                className="p-2.5 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-900">
                  Dean of Academics
                </div>
                <div className="text-[10px] text-slate-500 truncate">Dr. Anita Desai</div>
              </button>
            </div>
          </div>
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400">
          IQAC Institutional Quality Management System &bull; Stage 3 Advanced Analytics
        </p>
      </div>
    </div>
  );
};
