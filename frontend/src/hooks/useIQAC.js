// Custom Hook for IQAC Module State & Service Operations (Stage 5A & 5B)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { iqacService } from '../services/iqacService';

export const useIQAC = (initialDeptId = null) => {
  const { user, academicYear } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [coordinatorStats, setCoordinatorStats] = useState(null);
  const [unassignedDepartments, setUnassignedDepartments] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [staffMonitoring, setStaffMonitoring] = useState([]);
  const [attentionRequired, setAttentionRequired] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(initialDeptId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const [dashRes, coordRes, notifRes] = await Promise.all([
        iqacService.getIQACDashboard(user, academicYear),
        iqacService.getCoordinators(user),
        iqacService.getNotificationHistory(user),
      ]);

      if (dashRes.success) {
        const { data } = dashRes;
        setStatistics(data.statistics);
        setDepartments(data.departments);
        setStaffMonitoring(data.staffMonitoring);
        setAttentionRequired(data.attentionRequired);
        setPendingItems(data.attentionRequired);
        setRecentActivities(data.recentActivities);

        if (!selectedDeptId && data.departments.length > 0) {
          setSelectedDeptId(data.departments[0].id);
        }
      }

      if (coordRes.success) {
        setCoordinators(coordRes.data);
        setCoordinatorStats(coordRes.stats);
        setUnassignedDepartments(coordRes.unassignedDepartments);
      }

      if (notifRes.success) {
        setNotifications(notifRes.data);
      }
    } catch (err) {
      console.error('Error in useIQAC hook:', err);
      setError(err.message || 'Failed to fetch IQAC data.');
    } finally {
      setLoading(false);
    }
  }, [user, academicYear, selectedDeptId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const assignCoordinator = async (payload) => {
    const res = await iqacService.assignCoordinator({ ...payload, actorUser: user });
    if (res.success) await fetchData();
    return res;
  };

  const reassignCoordinator = async (payload) => {
    const res = await iqacService.reassignCoordinator({ ...payload, actorUser: user });
    if (res.success) await fetchData();
    return res;
  };

  const updateCoordinatorStatus = async (payload) => {
    const res = await iqacService.updateCoordinatorStatus({ ...payload, actorUser: user });
    if (res.success) await fetchData();
    return res;
  };

  const sendNotification = async (payload) => {
    const res = await iqacService.sendCoordinatorNotification({ ...payload, senderUser: user });
    if (res.success) await fetchData();
    return res;
  };

  const getCoordinatorDetails = async (coordId) => {
    return await iqacService.getCoordinatorById(coordId, user);
  };

  const getEligibleFacultyCandidates = async (deptId) => {
    return await iqacService.getEligibleFacultyCandidates(deptId);
  };

  return {
    statistics,
    departments,
    coordinators,
    coordinatorStats,
    unassignedDepartments,
    pendingItems,
    staffMonitoring,
    attentionRequired,
    recentActivities,
    notifications,
    selectedDeptId,
    setSelectedDeptId,
    loading,
    error,
    refreshData: fetchData,
    assignCoordinator,
    reassignCoordinator,
    updateCoordinatorStatus,
    sendNotification,
    getCoordinatorDetails,
    getEligibleFacultyCandidates,
  };
};
