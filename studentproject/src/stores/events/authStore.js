import { defineStore } from 'pinia';
import axios from 'axios';

const mac = true;
const PORT = mac ? 8080 : 5000;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await axios.get(`http://localhost:${PORT}/users`);
        const users = response.data;
        const user = users.find((u) => u.username === username && u.password === password);
        if (user) {
          this.user = user;
          await axios.put(`http://localhost:${PORT}/users/${user.id}`, { ...user, isActive: true });
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (error) {
        console.error('An error occurred during login:', error);
        throw error;
      }
    },
    async logout() {
      if (this.user) {
        await axios.put(`http://localhost:${PORT}/users/${this.user.id}`, { ...this.user, isActive: false });
        this.user = null;
      }
    },
  },
});
