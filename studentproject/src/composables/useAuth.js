import { computed } from 'vue';
import { useAuthStore } from '../stores/events/authStore';
import * as authApi from '../api/auth.js';

export function useAuth() {
  const store = useAuthStore();

  const isAuthenticated = computed(() => !!store.user);
  const activeUser = computed(() => store.user);

  const login = async (username, password) => {
    const user = await authApi.login(username, password);
    store.user = user;
  };

  const logout = async () => {
    await authApi.logout(store.user.id);
    store.user = null;
  };

  const register = async (username, password) => {
    const newUser = await authApi.register(username, password);
    store.user = newUser;
  };

  const authenticateUser = async () => {
    // We assume that the local storage can be trusted
    const activeUserId = localStorage.getItem('activeUserId');
    if (activeUserId) {
      const foundUser = await authApi.getUserById(activeUserId);
      if (foundUser) store.user = foundUser;
    }
  };

  return { isAuthenticated, activeUser, login, logout, register, authenticateUser };
}
