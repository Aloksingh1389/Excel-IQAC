import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES, DEAN_TYPES, DIRECTOR_TYPES } from '../../config/roles';
import { Input } from '../../components/forms/Input';
import { Button } from '../../components/common/Button';
import { ShieldCheck, Sparkles, GraduationCap, Lock, Mail, ArrowRight, Check } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('staff@iqac.demo');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, switchRole } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleKey, subType = null, demoEmail = '') => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    try {
      await switchRole(roleKey, subType);
      toast.success(`Logged in as ${subType || roleKey}`);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo & Institutional Heading */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            IQAC Management System
          </h2>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Internal Quality Assurance Cell & Institutional ERP Portal
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-200">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {errorMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              label="Email / Employee ID"
              type="email"
              required
              icon={Mail}
              placeholder="e.g. staff@iqac.demo"
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

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-600">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Sign In to Portal
            </Button>
          </form>

          {/* 1-Click Demo Accounts Selector */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                1-Click Demo Logins
              </span>
              <span className="text-[10px] text-slate-400">Select any role to test</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo(ROLES.STAFF, null, 'staff@iqac.demo')}
                className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer"
              >
                <div className="font-bold text-slate-900">Staff</div>
                <div className="text-[10px] text-slate-500 truncate">Dr. Rajesh Kumar</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(ROLES.HOD, null, 'hod@iqac.demo')}
                className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer"
              >
                <div className="font-bold text-slate-900">HOD (CSE)</div>
                <div className="text-[10px] text-slate-500 truncate">Dr. Ramesh Sharma</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(ROLES.DEAN, DEAN_TYPES.ACADEMIC, 'dean@iqac.demo')}
                className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer"
              >
                <div className="font-bold text-slate-900">Dean Academics</div>
                <div className="text-[10px] text-slate-500 truncate">Dr. Anita Desai</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(ROLES.IQAC_MEMBER, null, 'member@iqac.demo')}
                className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer"
              >
                <div className="font-bold text-slate-900">IQAC Member</div>
                <div className="text-[10px] text-slate-500 truncate">Prof. Priya Nair</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(ROLES.IQAC_HEAD, null, 'head@iqac.demo')}
                className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer"
              >
                <div className="font-bold text-slate-900">IQAC Head</div>
                <div className="text-[10px] text-slate-500 truncate">Dr. Swaminathan</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(ROLES.DIRECTOR, DIRECTOR_TYPES.ACADEMIC, 'admin.director@iqac.demo')}
                className="p-2 text-left rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 transition cursor-pointer"
              >
                <div className="font-bold text-indigo-900 flex items-center gap-1">
                  Director (Admin)
                </div>
                <div className="text-[10px] text-indigo-600 font-medium truncate">Dr. H.J. Bhabha</div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          IQAC Institutional Quality Assurance & Governance Framework &bull; v2.4
        </div>
      </div>
    </div>
  );
};
