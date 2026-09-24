// Centralized IQAC Meeting Management Service (Stage 5E)

import { MOCK_MEETINGS } from '../data/mockMeetings';
import { MEETING_STATUS, MEETING_TYPES, MEETING_TYPE_LABELS, AGENDA_STATUS, MINUTES_STATUS } from '../config/meetingConfig';
import { ROLES } from '../config/roles';
import { storage } from '../utils/storage';
import { iqacService } from './iqacService';

const STORAGE_KEY = 'iqac_meetings_v1';

const getStoredMeetings = () => {
  const data = storage.get(STORAGE_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) {
    storage.set(STORAGE_KEY, MOCK_MEETINGS);
    return MOCK_MEETINGS;
  }
  return data;
};

const SIMULATED_LATENCY_MS = 150;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const meetingService = {
  /**
   * Filter meetings by user role & department scope
   */
  getAccessibleMeetings: (user, meetingsList = null) => {
    if (!user) return [];
    const list = meetingsList || getStoredMeetings();
    const role = user.role;

    const isApexOrHead =
      role === ROLES.TECHNICAL_DIRECTOR ||
      role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL ||
      role === ROLES.INSTITUTION_ADMIN ||
      role === ROLES.IQAC_HEAD;

    if (isApexOrHead) return list;

    if (role === ROLES.DEAN) {
      const assignedCodes = user.assignedDepartments || ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
      return list.filter((m) => m.departmentCode === 'INSTITUTION' || assignedCodes.includes(m.departmentCode));
    }

    if (role === ROLES.HOD || role === ROLES.IQAC_COORDINATOR) {
      const userDeptCode = user.departmentCode || 'CSE';
      return list.filter((m) => m.departmentCode === 'INSTITUTION' || m.departmentCode === userDeptCode);
    }

    if (role === ROLES.STAFF) {
      // Staff sees participating meetings or department meetings
      return list.filter((m) =>
        m.departmentCode === user.departmentCode ||
        (m.participants || []).some((p) => p.userId === user.id || p.name === user.name || p.userId === user.email)
      );
    }

    return list;
  },

  getMeetings: async (filters = {}, user) => {
    await delay();
    const accessible = meetingService.getAccessibleMeetings(user);
    const { searchQuery, statusFilter, typeFilter, deptFilter } = filters;

    let result = accessible;

    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((m) => m.status === statusFilter);
    }

    if (typeFilter && typeFilter !== 'ALL') {
      result = result.filter((m) => m.meetingType === typeFilter);
    }

    if (deptFilter && deptFilter !== 'ALL') {
      result = result.filter((m) => m.departmentCode === deptFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.meetingId.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.organizerName.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q)
      );
    }

    const stats = {
      total: accessible.length,
      upcoming: accessible.filter((m) => m.status === MEETING_STATUS.SCHEDULED).length,
      completed: accessible.filter((m) => m.status === MEETING_STATUS.COMPLETED || m.status === MEETING_STATUS.MINUTES_FINALIZED).length,
      minutesPending: accessible.filter((m) => m.status === MEETING_STATUS.MINUTES_PENDING || m.status === MEETING_STATUS.COMPLETED).length,
      minutesFinalized: accessible.filter((m) => m.status === MEETING_STATUS.MINUTES_FINALIZED).length,
    };

    return { success: true, data: result, stats };
  },

  getMeetingById: async (id, user) => {
    await delay();
    const accessible = meetingService.getAccessibleMeetings(user);
    const meeting = accessible.find((m) => m.id === id || m.meetingId === id);
    if (!meeting) {
      throw new Error('Meeting not found or access denied.');
    }
    return { success: true, data: meeting };
  },

  createMeeting: async (payload, user) => {
    await delay();
    if (!payload.title || !payload.title.trim()) {
      throw new Error('Meeting title is required.');
    }
    if (!payload.date) {
      throw new Error('Meeting date is required.');
    }

    const list = getStoredMeetings();
    const mNum = String(list.length + 101).padStart(5, '0');
    const meetingId = `M-2026-${mNum}`;
    const timestamp = new Date().toLocaleString();

    const newMeeting = {
      id: `meet_${Date.now()}`,
      meetingId,
      title: payload.title,
      meetingType: payload.meetingType || MEETING_TYPES.IQAC_GENERAL,
      typeLabel: MEETING_TYPE_LABELS[payload.meetingType] || 'IQAC Meeting',
      date: payload.date,
      startTime: payload.startTime || '10:00 AM',
      endTime: payload.endTime || '11:30 AM',
      venue: payload.venue || 'IQAC Conference Room',
      mode: payload.mode || 'PHYSICAL',
      academicYear: payload.academicYear || '2026-27',
      organizerId: user?.id || 'user_coord_cse',
      organizerName: user?.name || 'Prof. Priya Nair',
      organizerRole: user?.role || ROLES.IQAC_COORDINATOR,
      departmentCode: payload.departmentCode || user?.departmentCode || 'CSE',
      status: MEETING_STATUS.SCHEDULED,
      createdAt: timestamp,
      updatedAt: timestamp,
      participants: payload.participants || [
        { id: 'p_owner', userId: user?.id, name: user?.name, role: user?.role, department: user?.departmentCode || 'CSE', attendance: 'PRESENT' },
      ],
      agendaItems: payload.agendaItems || [],
      attendanceSummary: { total: 1, present: 1, absent: 0, late: 0, excused: 0, attendanceRate: 100 },
      minutes: null,
      resolutions: [],
      actionItemIds: [],
      evidenceIds: [],
      activityIds: [],
    };

    const updated = [newMeeting, ...list];
    storage.set(STORAGE_KEY, updated);

    // Notify participants
    iqacService.sendCoordinatorNotification({
      senderUser: user,
      recipientScope: 'DEPARTMENT_COORDINATOR',
      title: `Meeting Scheduled: ${meetingId}`,
      message: `New meeting "${newMeeting.title}" scheduled for ${newMeeting.date} at ${newMeeting.startTime}.`,
      priority: 'MEDIUM',
    });

    return { success: true, message: 'IQAC Meeting scheduled successfully.', data: newMeeting };
  },

  addAgendaItem: async (meetingId, agendaData, user) => {
    await delay();
    const list = getStoredMeetings();
    const index = list.findIndex((m) => m.id === meetingId || m.meetingId === meetingId);
    if (index === -1) throw new Error('Meeting not found.');

    const m = list[index];
    const itemNum = (m.agendaItems || []).length + 1;

    const newAgenda = {
      id: `ag_${Date.now()}`,
      agendaId: `AG-0${itemNum}`,
      itemNumber: itemNum,
      title: agendaData.title,
      description: agendaData.description || '',
      proposedBy: user?.name || 'IQAC Member',
      priority: agendaData.priority || 'NORMAL',
      status: AGENDA_STATUS.PENDING,
      discussionNotes: '',
      decision: '',
    };

    const updatedItems = [...(m.agendaItems || []), newAgenda];
    list[index] = { ...m, agendaItems: updatedItems, updatedAt: new Date().toLocaleString() };
    storage.set(STORAGE_KEY, list);

    return { success: true, message: 'Agenda item added.', data: list[index] };
  },

  recordAttendance: async (meetingId, attendanceList, user) => {
    await delay();
    const list = getStoredMeetings();
    const index = list.findIndex((m) => m.id === meetingId || m.meetingId === meetingId);
    if (index === -1) throw new Error('Meeting not found.');

    const m = list[index];
    const total = attendanceList.length;
    const present = attendanceList.filter((a) => a.attendance === 'PRESENT').length;
    const absent = attendanceList.filter((a) => a.attendance === 'ABSENT').length;
    const late = attendanceList.filter((a) => a.attendance === 'LATE').length;
    const excused = attendanceList.filter((a) => a.attendance === 'EXCUSED').length;

    const summary = {
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate: Math.round(((present + late) / (total || 1)) * 100),
    };

    list[index] = {
      ...m,
      participants: attendanceList,
      attendanceSummary: summary,
      updatedAt: new Date().toLocaleString(),
    };
    storage.set(STORAGE_KEY, list);

    return { success: true, message: 'Attendance recorded successfully.', data: list[index] };
  },

  finalizeMinutes: async (meetingId, minutesPayload, user) => {
    await delay();
    const list = getStoredMeetings();
    const index = list.findIndex((m) => m.id === meetingId || m.meetingId === meetingId);
    if (index === -1) throw new Error('Meeting not found.');

    const timestamp = new Date().toLocaleString();
    const m = list[index];

    const minutesObj = {
      id: `min_${Date.now()}`,
      minutesId: `MIN-${m.meetingId}`,
      preparedBy: minutesPayload.preparedBy || user?.name,
      preparedAt: timestamp,
      finalizedBy: user?.name,
      finalizedAt: timestamp,
      summary: minutesPayload.summary || 'Meeting minutes finalized.',
      discussions: minutesPayload.discussions || '',
      decisions: minutesPayload.decisions || '',
      status: MINUTES_STATUS.FINALIZED,
    };

    const newResolutions = minutesPayload.resolutions || [];

    list[index] = {
      ...m,
      status: MEETING_STATUS.MINUTES_FINALIZED,
      minutes: minutesObj,
      resolutions: [...(m.resolutions || []), ...newResolutions],
      updatedAt: timestamp,
    };
    storage.set(STORAGE_KEY, list);

    return { success: true, message: 'Meeting minutes and resolutions finalized.', data: list[index] };
  },
};
