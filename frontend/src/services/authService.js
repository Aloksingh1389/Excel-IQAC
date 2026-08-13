import { getItem, setItem, STORAGE_KEYS, initializeLocalStorage } from './localStorageHelper';
import { mockResponse, mockError } from './api';

initializeLocalStorage();

export const authService = {
  async login(email, password) {
    const users = getItem(STORAGE_KEYS.USERS) || [];
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return mockError('Invalid credentials. Please verify your email.', 401);
    }

    if (user.status === 'SUSPENDED') {
      return mockError('Your account has been suspended by the Directorate.', 403);
    }

    if (user.status === 'DEACTIVATED') {
      return mockError('This account is deactivated. Please contact IQAC Admin.', 403);
    }

    // Persist current session
    setItem(STORAGE_KEYS.CURRENT_USER, user);
    return mockResponse(user);
  },

  async getCurrentUser() {
    const user = getItem(STORAGE_KEYS.CURRENT_USER);
    if (!user) {
      const users = getItem(STORAGE_KEYS.USERS) || [];
      return mockResponse(users[0] || null);
    }
    return mockResponse(user);
  },

  async switchUserByRole(roleKey, subType = null) {
    const users = getItem(STORAGE_KEYS.USERS) || [];
    let user = users.find((u) => {
      if (subType) {
        return u.role === roleKey && u.subType === subType;
      }
      return u.role === roleKey;
    });

    if (!user) {
      user = users[0];
    }

    setItem(STORAGE_KEYS.CURRENT_USER, user);
    return mockResponse(user);
  },

  async switchUserById(userId) {
    const users = getItem(STORAGE_KEYS.USERS) || [];
    const user = users.find((u) => u.id === userId);
    if (user) {
      setItem(STORAGE_KEYS.CURRENT_USER, user);
      return mockResponse(user);
    }
    return mockError('User not found', 404);
  },

  async updateProfile(userId, updateData) {
    const users = getItem(STORAGE_KEYS.USERS) || [];
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, ...updateData };
      }
      return u;
    });
    setItem(STORAGE_KEYS.USERS, updatedUsers);

    const currentUser = getItem(STORAGE_KEYS.CURRENT_USER);
    if (currentUser && currentUser.id === userId) {
      const newCurr = { ...currentUser, ...updateData };
      setItem(STORAGE_KEYS.CURRENT_USER, newCurr);
      return mockResponse(newCurr);
    }
    return mockResponse(updateData);
  },

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return mockResponse({ loggedOut: true });
  },
};
