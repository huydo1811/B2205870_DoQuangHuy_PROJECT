import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/user/Home.vue';
import Login from '../views/user/Login.vue';
import Register from '../views/user/Register.vue';
import NotFound from '../views/NotFound.vue';
import AdminHome from '../views/admin/AdminHome.vue';

const routes = [
  { path: '/', redirect: '/login' }, 
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/admin', component: AdminHome },
  { path: '/home', component: Home },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('token');

  if (authRequired && !token) {
    return next('/login');
  }
  next();
});

export default router;