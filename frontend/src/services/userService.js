import { getItem, setItem, STORAGE_KEYS } from './localStorageHelper';
import { mockResponse, mockError } from './api';

export const userService = {
  async getAllUsers() {
    const users = getItem(STORAGE_KEYS.USERS) || [];
    return mockResponse(users);
  },

  async getUserById(id) {
    const users = getItem(STORAGE_KEYS.USERS) || [];
    const user = users.find((u) => u.id === id);
    if (!user) return mockError('User not found', 404);
    return mockResponse(user);
  },

  async updateUserStatus(userId, newStatus, reason = '') {
    const users = getItem(STORAGE_KEYS.USERS) || [];
    let updatedUser = null;
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        updatedUser = { ...u, status: newStatus, statusReason: reason, statusUpdatedAt: new Date().toISOString() };
        return updatedUser;
      }
      return u;
    });

    setItem(STORAGE_KEYS.USERS, updatedUsers);

    // If current logged-in user is this user, update session as well
    const currentUser = getItem(STORAGE_KEYS.CURRENT_USER);
    if (currentUser && currentUser.id === userId) {
      setItem(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }

    return mockResponse(updatedUser);
  },
};
