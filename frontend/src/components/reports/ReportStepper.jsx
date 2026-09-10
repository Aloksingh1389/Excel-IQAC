import React from 'react';
import { Check } from 'lucide-react';

export const ReportStepper = ({ currentStep = 1, steps = [] }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label */}
              <div className="flex flex-col items-center text-center space-y-1.5 relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-xs'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>

                <div className="space-y-0.5">
                  <span
                    className={`text-xs font-bold block ${
                      isCurrent
                        ? 'text-indigo-600'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  {step.subtitle && (
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                      {step.subtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-5 transition-all ${
                    currentStep > stepNum ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
