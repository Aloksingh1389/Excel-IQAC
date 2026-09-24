// Custom Hook for Quality Monitoring (Stage 5F)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { qualityService } from '../services/qualityService';
import { qualityAlertService } from '../services/qualityAlertService';
import { qualityInsightService } from '../services/qualityInsightService';

export const useQualityMonitoring = (initialFilters = {}) => {
  const { user, academicYear } = useAuth();
  const [summary, setSummary] = useState(null);
  const [indicators, setIndicators] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [insights, setInsights] = useState([]);
  const [trends, setTrends] = useState([]);
  const [filters, setFilters] = useState({ academicYear, ...initialFilters });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQualityData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [sumRes, indRes, altRes, insRes, trdRes] = await Promise.all([
        qualityService.getQualitySummary(user, academicYear),
        qualityService.getQualityIndicators(filters, user),
        qualityAlertService.getQualityAlerts(),
        qualityInsightService.getManagementInsights(),
        qualityService.getQualityTrends(user),
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (indRes.success) setIndicators(indRes.data);
      setAlerts(altRes);
      setInsights(insRes);
      if (trdRes.success) setTrends(trdRes.data);
    } catch (err) {
      console.error('Error in useQualityMonitoring hook:', err);
      setError(err.message || 'Failed to fetch quality monitoring data.');
    } finally {
      setLoading(false);
    }
  }, [user, academicYear, filters]);

  useEffect(() => {
    fetchQualityData();
  }, [fetchQualityData]);

  return {
    summary,
    indicators,
    alerts,
    insights,
    trends,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchQualityData,
  };
};
