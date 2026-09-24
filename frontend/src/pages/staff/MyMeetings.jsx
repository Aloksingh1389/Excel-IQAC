import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, CalendarDays } from 'lucide-react';

export const MyMeetings = () => {
  const { user } = useAuth();

  // Simulated meeting data scoped to this staff member's invitations
  const meetings = [
    {
      id: 'mtg_001',
      title: 'Department IQAC Quality Review Meeting Q2',
      type: 'Department IQAC',
      date: '2026-09-10',
      time: '10:00 AM',
      venue: 'Conference Hall A',
      attendanceStatus: 'Present',
      status: 'COMPLETED',
    },
    {
      id: 'mtg_002',
      title: 'FDP Programme Awareness Workshop',
      type: 'FDP Workshop',
      date: '2026-09-20',
      time: '02:00 PM',
      venue: 'Online (MS Teams)',
      attendanceStatus: 'Invited',
      status: 'SCHEDULED',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
        <Link to="/staff" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Meetings</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Meetings where I am invited, assigned, or participating</p>
        </div>
      </div>

      {meetings.length === 0 ? (
        <Card className="p-10 text-center text-slate-400 text-xs font-semibold">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 text-slate-200" />
          <p>No upcoming meetings assigned to you.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {meetings.map((mtg) => (
            <Card key={mtg.id} className="p-4 sm:p-5 space-y-3 bg-white border-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{mtg.title}</h3>
                  <p className="text-xs text-indigo-700 font-semibold">{mtg.type}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                  mtg.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                  mtg.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                }`}>{mtg.status}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-medium text-slate-600">
                <div><span className="font-bold text-slate-800">Date:</span> {mtg.date}</div>
                <div><span className="font-bold text-slate-800">Time:</span> {mtg.time}</div>
                <div><span className="font-bold text-slate-800">Venue:</span> {mtg.venue}</div>
                <div><span className="font-bold text-slate-800">My Status:</span>
                  <span className={`ml-1 font-black ${mtg.attendanceStatus === 'Present' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {mtg.attendanceStatus}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
