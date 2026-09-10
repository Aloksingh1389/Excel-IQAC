import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { AlertCircle, ArrowLeft, Home, ShieldAlert } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-5 border-slate-200 shadow-sm">
        <div className="w-14 h-14 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-slate-900">404</h1>
          <h2 className="text-base font-bold text-slate-800">Page Not Found</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            The institutional resource or page URL you requested does not exist.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Home}
            onClick={() => navigate('/director/dashboard')}
          >
            Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-5 border-slate-200 shadow-sm">
        <div className="w-14 h-14 bg-amber-50 border border-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-slate-900">403</h1>
          <h2 className="text-base font-bold text-slate-800">Access Restricted</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            You do not have the required institutional management permissions to access this portal.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/login')}
          >
            Switch Account
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Home}
            onClick={() => navigate('/director/dashboard')}
          >
            Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};
