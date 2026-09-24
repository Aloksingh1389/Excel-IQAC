import React from 'react';
import { Card } from '../common/Card';
import { User, Mail, Phone, Building2, Award, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StaffProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <Card className="p-5 sm:p-6 space-y-4 bg-white border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
            {profile.name ? profile.name.charAt(0) : 'S'}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{profile.name}</h2>
            <p className="text-xs font-semibold text-indigo-900">{profile.designation} &bull; {profile.departmentCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
            {profile.completionPercentage}% Complete
          </span>
          <Link
            to="/staff/profile"
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700 transition"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="truncate">{profile.email}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>{profile.phone}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="truncate">{profile.qualification}</span>
        </div>
      </div>
    </Card>
  );
};
