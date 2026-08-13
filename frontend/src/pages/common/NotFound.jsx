import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Home, ArrowLeft, AlertCircle, ShieldX } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-2xl border border-slate-200">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900">404</h1>
          <h2 className="text-lg font-bold text-slate-800">Page Not Found</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            The requested institutional resource or module route does not exist or has been archived.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="primary" size="sm" icon={Home} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-2xl border border-slate-200">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldX className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900">403</h1>
          <h2 className="text-lg font-bold text-slate-800">Access Restricted</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You do not have the required institutional RBAC permissions to access this administrative portal.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="primary" size="sm" icon={Home} onClick={() => navigate('/dashboard')}>
            My Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
