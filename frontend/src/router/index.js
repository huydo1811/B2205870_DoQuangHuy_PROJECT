import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/user/Home.vue';
import Login from '../views/user/Login.vue';
import Register from '../views/user/Register.vue';
import NotFound from '../views/NotFound.vue';
import AdminHome from '../views/admin/AdminHome.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { title: 'Đăng nhập' } },
  { path: '/register', component: Register, meta: { title: 'Đăng ký' } },
  { path: '/admin', component: AdminHome, meta: { title: 'Quản trị viên' } },
  { path: '/home', component: Home, meta: { title: 'Trang chủ' } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: 'Không tìm thấy' } }
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
  document.title = to.meta.title || 'Quản lý thư viện';
  next();
});

export default router;