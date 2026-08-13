import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Select } from '../../components/forms/Input';
import { Button } from '../../components/common/Button';
import { GraduationCap, Mail, Lock, User, Building } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Computer Science and Engineering',
    designation: 'Assistant Professor',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Registration submitted! Awaiting HOD / IQAC approval.');
      navigate('/login');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-2 shadow-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Faculty Registration</h2>
          <p className="text-xs text-slate-400 mt-1">Register institutional staff account for IQAC portal access</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name (with title)"
              placeholder="e.g. Dr. Ramesh Kumar"
              icon={User}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Institutional Email"
              type="email"
              placeholder="e.g. ramesh.kumar@institution.edu"
              icon={Mail}
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                options={[
                  'Computer Science and Engineering',
                  'Electronics and Communication Engineering',
                  'Mechanical Engineering',
                  'Electrical and Electronics Engineering',
                  'Civil Engineering',
                  'Information Technology',
                ]}
              />

              <Select
                label="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                options={[
                  'Assistant Professor',
                  'Associate Professor',
                  'Professor',
                  'Professor & Head',
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                required
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              <Input
                label="Confirm Password"
                type="password"
                required
                icon={Lock}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              Submit Registration Request
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an active account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Reset Password</h2>
        <p className="text-xs text-slate-500 mb-6">
          Enter your institutional email address to receive password recovery instructions.
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-3">
            <p className="font-semibold">Reset instructions sent!</p>
            <p>A recovery link has been simulated for {email}. Please check your institutional inbox.</p>
            <Link to="/login" className="inline-block font-bold text-blue-600 underline">
              Return to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Institutional Email"
              type="email"
              required
              placeholder="e.g. staff@iqac.demo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="primary" loading={loading} className="w-full">
              Send Password Reset Link
            </Button>
            <div className="text-center text-xs pt-2">
              <Link to="/login" className="text-slate-500 hover:text-slate-800">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
