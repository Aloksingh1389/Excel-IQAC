import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStaff } from '../../hooks/useStaff';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, CheckSquare, AlertTriangle, Eye } from 'lucide-react';

const PRIORITY_COLORS = {
  HIGH: 'bg-rose-100 text-rose-800',
  MEDIUM: 'bg-amber-100 text-amber-800',
  LOW: 'bg-slate-100 text-slate-700',
};

export const MyTasks = () => {
  const { user } = useAuth();
  const { tasks, loading } = useStaff();

  if (loading) return <Loader message="Loading Assigned Tasks & Action Items..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
        <Link to="/staff" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Tasks & Action Items</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Tasks assigned from IQAC meetings, compliance requirements & accreditation activities
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <Card className="p-10 text-center text-slate-400 text-xs font-semibold">
          <CheckSquare className="w-10 h-10 mx-auto mb-3 text-slate-200" />
          <p>No tasks currently assigned.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto custom-scroll rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b font-bold uppercase tracking-wider">
                <th className="p-3">Task / Action Item</th>
                <th className="p-3">Source</th>
                <th className="p-3 text-center">Priority</th>
                <th className="p-3">Due Date</th>
                <th className="p-3 text-center">Progress</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-bold text-slate-900">{task.title}</td>
                  <td className="p-3 text-slate-500">{task.source || 'IQAC'}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${PRIORITY_COLORS[task.priority] || 'bg-slate-100 text-slate-700'}`}>
                      {task.priority || 'MEDIUM'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{task.dueDate || '—'}</td>
                  <td className="p-3 text-center">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[60px] mx-auto">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${task.progress || 0}%` }} />
                    </div>
                    <span className="text-[9px] text-slate-500">{task.progress || 0}%</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      task.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' :
                      task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>{task.status || 'OPEN'}</span>
                  </td>
                  <td className="p-3 text-right">
                    <Link to={`/staff/tasks/${task.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-[10px]">
                      <Eye className="w-3 h-3" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};
