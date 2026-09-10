// Authentication Service for Mock / LocalStorage session handling

import { MOCK_USERS } from '../data/mockUsers';
import { storage, STORAGE_KEYS } from '../utils/storage';

const SIMULATED_LATENCY_MS = 250;

const delay = (ms = SIMULATED_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Authenticates user using email and password against mock directory
   */
  loginUser: async (email, password) => {
    await delay();
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!user) {
      throw new Error('User not found. Please check your email or employee ID.');
    }

    if (password && password !== user.password && password !== 'password123') {
      throw new Error('Invalid password. Please try again.');
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      employeeId: user.employeeId,
      phone: user.phone,
      department: user.department,
      status: user.status,
      permissions: user.permissions || [],
      dateOfJoining: user.dateOfJoining,
      lastLogin: user.lastLogin || 'Just now',
      accountCreated: user.accountCreated,
      avatar: user.avatar,
    };

    // Store in localStorage
    storage.set(STORAGE_KEYS.AUTH, {
      token: `mock_jwt_token_${user.id}_${Date.now()}`,
      isAuthenticated: true,
      timestamp: new Date().toISOString(),
    });
    storage.set(STORAGE_KEYS.USER, sessionUser);

    return {
      success: true,
      user: sessionUser,
    };
  },

  /**
   * Clears session from storage and returns success
   */
  logoutUser: async () => {
    await delay(100);
    storage.clearAuth();
    return { success: true };
  },

  /**
   * Retrieves active session user from localStorage
   */
  getCurrentUser: () => {
    const auth = storage.get(STORAGE_KEYS.AUTH);
    if (!auth || !auth.isAuthenticated) return null;
    return storage.get(STORAGE_KEYS.USER);
  },

  /**
   * Updates profile data for active user session
   */
  updateUserProfile: async (userId, updatedFields) => {
    await delay();
    const currentUser = storage.get(STORAGE_KEYS.USER);
    if (!currentUser) throw new Error('No active user session found.');

    const updatedUser = {
      ...currentUser,
      ...updatedFields,
    };

    storage.set(STORAGE_KEYS.USER, updatedUser);

    // Also update in-memory mock if present
    const mockIndex = MOCK_USERS.findIndex((u) => u.id === userId);
    if (mockIndex !== -1) {
      MOCK_USERS[mockIndex] = { ...MOCK_USERS[mockIndex], ...updatedFields };
    }

    return {
      success: true,
      user: updatedUser,
    };
  },
};
