import React from 'react';
import { Award, ShieldCheck, Calendar, Building2 } from 'lucide-react';

export const AQARCoverPage = ({ report }) => {
  return (
    <div className="p-8 sm:p-12 rounded-2xl border border-slate-200 bg-white text-slate-900 space-y-8 shadow-sm print:border-none print:shadow-none print:p-0">
      <div className="text-center space-y-4 pb-8 border-b-2 border-indigo-950">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-950 text-amber-400 mb-2">
          <Award className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight uppercase">
          {report.institutionName || 'Excel College of Engineering & Technology'}
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Internal Quality Assurance Cell (IQAC)
        </p>
        <div className="pt-2">
          <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            NAAC Accredited Grade A+ &bull; CGPA 3.42
          </span>
        </div>
      </div>

      <div className="text-center space-y-3 py-6 bg-slate-50 rounded-2xl border border-slate-100">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          ANNUAL QUALITY ASSURANCE REPORT (AQAR)
        </h2>
        <p className="text-base font-extrabold text-indigo-900">
          Academic Year: {report.academicYear}
        </p>
        <p className="text-xs font-semibold text-slate-500 max-w-md mx-auto">
          Submitted in accordance with NAAC guidelines for autonomous institutions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium pt-4">
        <div className="p-4 rounded-xl bg-slate-50 border space-y-1">
          <p className="font-bold text-slate-400 uppercase text-[10px]">Head of Institution</p>
          <p className="font-bold text-slate-900">{report.institutionProfile?.headOfInstitution || 'Dr. R. K. Viswanathan (Principal)'}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border space-y-1">
          <p className="font-bold text-slate-400 uppercase text-[10px]">IQAC Director / Head</p>
          <p className="font-bold text-slate-900">{report.institutionProfile?.iqacCoordinator || 'Dr. M. S. Swaminathan (IQAC Head)'}</p>
        </div>
      </div>
    </div>
  );
};
