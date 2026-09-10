// Dashboard Service for Director / Principal Stage 1 Shell

import {
  MOCK_DASHBOARD_STATS,
  MOCK_QUICK_ACTIONS,
  MOCK_RECENT_ACTIVITY,
  MOCK_ATTENTION_ITEMS,
} from '../data/mockDashboard';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardService = {
  getDashboardStats: async () => {
    await delay();
    return {
      success: true,
      data: MOCK_DASHBOARD_STATS,
    };
  },

  getQuickActions: async () => {
    await delay(100);
    return {
      success: true,
      data: MOCK_QUICK_ACTIONS,
    };
  },

  getRecentActivity: async () => {
    await delay();
    return {
      success: true,
      data: MOCK_RECENT_ACTIVITY,
    };
  },

  getAttentionItems: async () => {
    await delay(100);
    return {
      success: true,
      data: MOCK_ATTENTION_ITEMS,
    };
  },
};
