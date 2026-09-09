import axios from 'axios';
import router from '@/router';
import { EnvionmentUtils } from '@/utils/envUtils';

const BASE_URL = EnvionmentUtils.getBaseUrl() + 'users';

export async function login(username, password) {
  const response = await axios.get(BASE_URL);
  const users = response.data;
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    await axios.put(`${BASE_URL}/${user.id}`, { ...user, isActive: true });
    localStorage.setItem('activeUserId', user.id);
    return { ...user, isActive: true };
  }
  throw new Error('Invalid credentials');
}

export async function logout(userId) {
  if (userId) {
    router.push('/login');
    const user = (await axios.get(`${BASE_URL}/${userId}`)).data;
    await axios.put(`${BASE_URL}/${userId}`, { ...user, isActive: false });
    localStorage.removeItem('activeUserId');
  }
}

export async function register(username, password) {
  const user = {
    username,
    password,
    isActive: false,
  };
  const existingUsers = (await axios.get(BASE_URL)).data;
  if (existingUsers.some((u) => u.username === username)) {
    throw new Error('Username already exists');
  }
  const response = await axios.post(BASE_URL, user);

  return response.data;
}

export async function getUserById(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data = await response.json();
    if (response.status === 200) {
      await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, isActive: true }),
      });
      return data;
    }
    throw new Error('User not found');
  } catch (error) {
    console.log(`error: ${error}`);
  }
}
