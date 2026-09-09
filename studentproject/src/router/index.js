import { createRouter, createWebHistory } from 'vue-router';
import Home from '../features/home/Home.vue';
import EditPage from '../features/edit-page/EditPage.vue';
import LoginForm from '../features/login/LoginForm.vue';
import { useAuth } from '../composables/useAuth';

const routes = [
  { path: '/edit-event/:id', name: 'EditEvent', component: EditPage },
  { path: '/', redirect: 'login' },
  { path: '/home', name: 'Home', component: Home },
  { path: '/login', name: 'LoginForm', component: LoginForm },
];

const history = createWebHistory();
const router = createRouter({
  history,
  routes,
});

router.beforeEach(async (to, _, next) => {
  const store = useAuth();
  await store.authenticateUser();

  // If the user is already authenticated and tries to access the login page, redirect to the home page
  if (to.name === 'LoginForm' && store.isAuthenticated.value) {
    next({ name: 'Home' });
    return;
  }
  // If the user is not authenticated and tries to access a page other than the login page, redirect to the login page
  if (to.name !== 'LoginForm' && !store.isAuthenticated.value) {
    next({ name: 'LoginForm' });
    return;
  }
  next();
});

export default router;
