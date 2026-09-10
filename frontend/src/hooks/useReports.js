import { useState, useEffect, useCallback } from 'react';
import { reportService } from '../services/reportService';
import { useAuth } from '../context/AuthContext';

export const useReports = (initialCategory = 'ALL') => {
  const { user, academicYear } = useAuth();
  const [categories, setCategories] = useState([]);
  const [reportTypes, setReportTypes] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, types, hist, favs] = await Promise.all([
        reportService.getReportCategories(),
        reportService.getReportTypes(initialCategory),
        reportService.getReportHistory(),
        reportService.getFavorites(),
      ]);

      setCategories(cats);
      setReportTypes(types);
      setHistory(hist.history);
      setFavorites(favs);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err.message || 'Unable to load report data.');
    } finally {
      setLoading(false);
    }
  }, [initialCategory]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const filterHistory = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await reportService.getReportHistory(filters);
      if (res.success) {
        setHistory(res.history);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (config) => {
    return await reportService.generateReport({
      ...config,
      user,
      academicYear: config.academicYear || academicYear,
    });
  };

  const getReport = async (reportId) => {
    return await reportService.getReportById(reportId);
  };

  const archiveReport = async (reportId) => {
    await reportService.archiveReport(reportId);
    await filterHistory();
  };

  const toggleFavorite = async (configId) => {
    const updated = await reportService.toggleFavorite(configId);
    setFavorites(updated);
  };

  return {
    categories,
    reportTypes,
    history,
    favorites,
    loading,
    error,
    generateReport,
    getReport,
    archiveReport,
    toggleFavorite,
    filterHistory,
    refreshHistory: fetchInitialData,
  };
};
