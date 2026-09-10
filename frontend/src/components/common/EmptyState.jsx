import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Button } from './Button';
import { Inbox, ArrowLeft, Construction, Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items to display at this time.',
  action = null,
  className = '',
}) => {
  return (
    <Card className={`p-10 text-center flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </Card>
  );
};

export const ComingSoon = ({
  moduleName = 'Module',
  description = null,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto my-6 text-center space-y-6">
      <Card className="p-8 sm:p-12 space-y-6 border-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto shadow-xs">
          <Construction className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
            Stage 2 Development
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Module Under Development
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {description ||
              `The Institutional ${moduleName} module is being developed and will be available in the next stage.`}
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            icon={ArrowLeft}
            onClick={() => navigate('/director/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};
