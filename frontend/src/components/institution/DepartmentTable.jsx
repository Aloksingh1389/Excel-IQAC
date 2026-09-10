import React from 'react';
import { Link } from 'react-router-dom';
import { getDepartmentStatus } from '../../utils/institutionUtils';
import { ArrowRight, ChevronRight, User } from 'lucide-react';
import { Button } from '../common/Button';

export const DepartmentTable = ({ departments = [] }) => {
  if (!departments || departments.length === 0) return null;

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200/90 shadow-2xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Students</th>
            <th className="py-3 px-4">Faculty</th>
            <th className="py-3 px-4">HOD</th>
            <th className="py-3 px-4">Pass %</th>
            <th className="py-3 px-4">Placement</th>
            <th className="py-3 px-4">Publications</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {departments.map((dept) => {
            const status = getDepartmentStatus(dept.passPercentage);
            return (
              <tr
                key={dept.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 font-mono">
                      {dept.code}
                    </span>
                    <Link
                      to={`/director/institution/departments/${dept.id}`}
                      className="font-bold text-slate-900 group-hover:text-indigo-600 transition truncate max-w-xs block"
                    >
                      {dept.name}
                    </Link>
                  </div>
                </td>

                <td className="py-3.5 px-4 font-bold text-slate-800">
                  {Number(dept.students).toLocaleString()}
                </td>

                <td className="py-3.5 px-4 text-slate-700">{dept.faculty}</td>

                <td className="py-3.5 px-4 text-slate-600">
                  <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{dept.hod?.name || 'HOD In-Charge'}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-900">{dept.passPercentage}%</span>
                </td>

                <td className="py-3.5 px-4 text-slate-700 font-semibold">
                  {dept.placementPercentage}%
                </td>

                <td className="py-3.5 px-4 text-indigo-600 font-bold">
                  {dept.publications}
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.colorClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                    {status.label}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <Link to={`/director/institution/departments/${dept.id}`}>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
