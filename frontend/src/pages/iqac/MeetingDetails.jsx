import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMeetings } from '../../hooks/useMeetings';
import { useActionItems } from '../../hooks/useActionItems';
import { useToast } from '../../context/ToastContext';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { MeetingStatusBadge } from '../../components/iqac/MeetingStatusBadge';
import { CreateActionItemModal } from '../../components/iqac/CreateActionItemModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  CheckCircle2,
  Plus,
  ShieldCheck,
  CheckSquare,
  MessageSquare,
} from 'lucide-react';
import { MEETING_STATUS, MINUTES_STATUS } from '../../config/meetingConfig';

export const MeetingDetails = () => {
  const { meetingId } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const {
    getMeetingDetails,
    addAgendaItem,
    recordAttendance,
    finalizeMinutes,
  } = useMeetings();

  const { createActionItem } = useActionItems();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  // Agenda form state
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [newAgendaDesc, setNewAgendaDesc] = useState('');
  const [isAddingAgenda, setIsAddingAgenda] = useState(false);

  // Minutes & Resolution form state
  const [minutesSummary, setMinutesSummary] = useState('');
  const [resolutionTitle, setResolutionTitle] = useState('');
  const [resolutionDesc, setResolutionDesc] = useState('');
  const [isFinalizingModal, setIsFinalizingModal] = useState(false);

  // Action item modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await getMeetingDetails(meetingId);
      if (res.success) {
        setMeeting(res.data);
        if (res.data.minutes) {
          setMinutesSummary(res.data.minutes.summary || '');
        }
      }
    } catch (err) {
      console.error('Error loading meeting details:', err);
      toast.error(err.message || 'Failed to load meeting.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [meetingId]);

  if (loading || !meeting) {
    return <Loader message="Loading Meeting Agendas, Minutes & Resolutions..." />;
  }

  const role = user?.role || ROLES.STAFF;
  const isOrganizer = user?.id === meeting.organizerId || user?.name === meeting.organizerName;
  const isHeadOrCoordinator = role === ROLES.IQAC_HEAD || role === ROLES.IQAC_COORDINATOR || role === ROLES.HOD || role === ROLES.TECHNICAL_DIRECTOR;

  const handleAddAgenda = async (e) => {
    e.preventDefault();
    if (!newAgendaTitle.trim()) return;
    try {
      const res = await addAgendaItem(meeting.id, {
        title: newAgendaTitle,
        description: newAgendaDesc,
        priority: 'NORMAL',
      });
      toast.success('Agenda item added successfully.');
      setNewAgendaTitle('');
      setNewAgendaDesc('');
      setIsAddingAgenda(false);
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to add agenda item.');
    }
  };

  const handleAttendanceChange = async (userId, status) => {
    const updatedParticipants = (meeting.participants || []).map((p) =>
      p.userId === userId || p.name === userId ? { ...p, attendance: status } : p
    );
    try {
      await recordAttendance(meeting.id, updatedParticipants);
      toast.success('Attendance updated.');
      await fetchDetails();
    } catch (err) {
      toast.error('Failed to update attendance.');
    }
  };

  const handleFinalizeMinutesSubmit = async (e) => {
    e.preventDefault();
    if (!minutesSummary.trim()) {
      toast.error('Please enter a meeting summary for the minutes.');
      return;
    }

    const resolutionsPayload = resolutionTitle.trim()
      ? [
          {
            id: `res_${Date.now()}`,
            resolutionNumber: `RES-0${(meeting.resolutions || []).length + 1}/2026`,
            title: resolutionTitle,
            description: resolutionDesc || minutesSummary,
            approvedBy: `${user.name} (${user.role.replace(/_/g, ' ')})`,
            createdAt: new Date().toLocaleString(),
          },
        ]
      : [];

    try {
      const res = await finalizeMinutes(meeting.id, {
        summary: minutesSummary,
        discussions: 'Deliberated on all agenda items.',
        resolutions: resolutionsPayload,
      });
      toast.success('Meeting minutes finalized.');
      setIsFinalizingModal(false);
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to finalize minutes.');
    }
  };

  const handleCreateActionSubmit = async (payload) => {
    try {
      const res = await createActionItem({
        ...payload,
        meetingId: meeting.meetingId,
        meetingTitle: meeting.title,
        resolutionId: selectedResolution?.resolutionNumber,
        resolutionTitle: selectedResolution?.title,
      });
      toast.success(res.message || 'Action item created.');
      await fetchDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to create action item.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/meetings"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {meeting.meetingId}
              </h1>
              <MeetingStatusBadge status={meeting.status} />
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
                {meeting.typeLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Organized by {meeting.organizerName} ({meeting.organizerRole.replace(/_/g, ' ')})
            </p>
          </div>
        </div>

        {isHeadOrCoordinator && meeting.status !== MEETING_STATUS.MINUTES_FINALIZED && (
          <button
            type="button"
            onClick={() => setIsFinalizingModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Finalize Minutes & Resolutions</span>
          </button>
        )}
      </div>

      {/* Overview Card */}
      <Card className="p-5 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
          {meeting.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Date</p>
              <p className="font-bold text-slate-900">{meeting.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Time</p>
              <p className="font-bold text-slate-900">{meeting.startTime} - {meeting.endTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Venue & Mode</p>
              <p className="font-bold text-slate-900 truncate">{meeting.venue} ({meeting.mode})</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Users className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Attendance Rate</p>
              <p className="font-bold text-emerald-700">{meeting.attendanceSummary?.attendanceRate || 83}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Agenda Items Card */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Meeting Agendas ({(meeting.agendaItems || []).length})
            </h3>
          </div>

          {isHeadOrCoordinator && (
            <button
              type="button"
              onClick={() => setIsAddingAgenda(!isAddingAgenda)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Agenda Item</span>
            </button>
          )}
        </div>

        {isAddingAgenda && (
          <form onSubmit={handleAddAgenda} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <Input
              label="Agenda Title"
              placeholder="e.g. Scopus Publication Indexing Audit"
              value={newAgendaTitle}
              onChange={(e) => setNewAgendaTitle(e.target.value)}
              required
            />
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Agenda Description</label>
              <textarea
                rows={2}
                placeholder="Brief background notes for discussion..."
                value={newAgendaDesc}
                onChange={(e) => setNewAgendaDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddingAgenda(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Agenda Item
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2.5">
          {(!meeting.agendaItems || meeting.agendaItems.length === 0) ? (
            <p className="text-xs text-slate-400 text-center py-3">No agenda items added yet.</p>
          ) : (
            meeting.agendaItems.map((ag) => (
              <div key={ag.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    #{ag.itemNumber}. {ag.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-200">
                    {ag.status}
                  </span>
                </div>
                {ag.description && <p className="text-slate-600 leading-snug">{ag.description}</p>}
                {ag.decision && (
                  <p className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    Decision: {ag.decision}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Attendance Recording Table (Section 23 requirement) */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Participant Attendance ({(meeting.participants || []).length} Invited)
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scroll text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b font-bold uppercase tracking-wider">
                <th className="p-3">Participant Name</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Department</th>
                <th className="p-3 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(meeting.participants || []).map((p) => (
                <tr key={p.id || p.userId}>
                  <td className="p-3 font-bold text-slate-900">{p.name}</td>
                  <td className="p-3 text-slate-600">{p.role.replace(/_/g, ' ')}</td>
                  <td className="p-3 text-center font-bold text-slate-800">{p.department}</td>
                  <td className="p-3 text-center">
                    {isHeadOrCoordinator ? (
                      <select
                        value={p.attendance || 'PRESENT'}
                        onChange={(e) => handleAttendanceChange(p.userId || p.name, e.target.value)}
                        className="px-2 py-1 text-xs font-bold border border-slate-200 rounded-lg bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="PRESENT">PRESENT</option>
                        <option value="ABSENT">ABSENT</option>
                        <option value="LATE">LATE</option>
                        <option value="EXCUSED">EXCUSED</option>
                      </select>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {p.attendance || 'PRESENT'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Minutes & Resolutions Section (Section 25 & 29 requirement) */}
      {meeting.minutes && (
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Finalized Minutes of Meeting & Board Resolutions
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-900 border border-teal-200">
              MINUTES FINALIZED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Executive Summary</p>
              <p className="font-semibold text-slate-900 leading-relaxed">{meeting.minutes.summary}</p>
              <p className="text-[10px] text-slate-400 pt-1">
                Finalized by {meeting.minutes.finalizedBy} on {meeting.minutes.finalizedAt}
              </p>
            </div>

            {/* Resolutions List */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">Official Board Resolutions ({(meeting.resolutions || []).length})</h4>
              </div>

              {(meeting.resolutions || []).map((res) => (
                <div key={res.id} className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-indigo-950">{res.resolutionNumber}: {res.title}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedResolution(res);
                        setIsActionModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                    >
                      <CheckSquare className="w-3 h-3" />
                      <span>Assign Action Item</span>
                    </button>
                  </div>
                  <p className="text-slate-700">{res.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Finalize Minutes Modal */}
      {isFinalizingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <Card className="w-full max-w-lg p-6 space-y-4 bg-white">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b">
              Finalize Minutes & Resolutions
            </h3>

            <form onSubmit={handleFinalizeMinutesSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Meeting Executive Summary *</label>
                <textarea
                  rows={3}
                  placeholder="Summarize key discussions, decisions and conclusions..."
                  value={minutesSummary}
                  onChange={(e) => setMinutesSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border space-y-2">
                <p className="font-bold text-slate-800">Add Board Resolution (Optional)</p>
                <Input
                  label="Resolution Title"
                  placeholder="e.g. Mandatory Scopus Evidence Policy"
                  value={resolutionTitle}
                  onChange={(e) => setResolutionTitle(e.target.value)}
                />
                <Input
                  label="Resolution Decision Text"
                  placeholder="e.g. Approved for implementation by all departments"
                  value={resolutionDesc}
                  onChange={(e) => setResolutionDesc(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" size="md" onClick={() => setIsFinalizingModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Confirm Finalize Minutes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Action Item Modal */}
      <CreateActionItemModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSubmit={handleCreateActionSubmit}
        preselectedMeetingId={meeting.meetingId}
        preselectedResolutionId={selectedResolution?.resolutionNumber}
      />
    </div>
  );
};
