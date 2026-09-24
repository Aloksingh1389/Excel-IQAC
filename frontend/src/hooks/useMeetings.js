// Custom Hook for IQAC Meetings Management (Stage 5E)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { meetingService } from '../services/meetingService';

export const useMeetings = (initialFilters = {}) => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeetings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await meetingService.getMeetings(filters, user);
      if (res.success) {
        setMeetings(res.data);
        setStatistics(res.stats);
      }
    } catch (err) {
      console.error('Error in useMeetings hook:', err);
      setError(err.message || 'Failed to fetch meetings.');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const createMeeting = async (payload) => {
    const res = await meetingService.createMeeting(payload, user);
    if (res.success) await fetchMeetings();
    return res;
  };

  const addAgendaItem = async (meetingId, agendaData) => {
    const res = await meetingService.addAgendaItem(meetingId, agendaData, user);
    if (res.success) await fetchMeetings();
    return res;
  };

  const recordAttendance = async (meetingId, attendanceList) => {
    const res = await meetingService.recordAttendance(meetingId, attendanceList, user);
    if (res.success) await fetchMeetings();
    return res;
  };

  const finalizeMinutes = async (meetingId, minutesPayload) => {
    const res = await meetingService.finalizeMinutes(meetingId, minutesPayload, user);
    if (res.success) await fetchMeetings();
    return res;
  };

  const getMeetingDetails = async (id) => {
    return await meetingService.getMeetingById(id, user);
  };

  return {
    meetings,
    statistics,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchMeetings,
    createMeeting,
    addAgendaItem,
    recordAttendance,
    finalizeMinutes,
    getMeetingDetails,
  };
};
