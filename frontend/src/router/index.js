import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/user/Home.vue';
import Login from '../views/user/Login.vue';
import Register from '../views/user/Register.vue';
import NotFound from '../views/NotFound.vue';
import AdminHome from '../views/admin/AdminHome.vue';
import UpdateInfo from '../views/user/UpdateInfo.vue';
import Contact from '../views/user/Contact.vue';
import Guide from '../views/user/Guide.vue';
import Account from '../views/user/Account.vue';
import Books from '../views/user/Books.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { title: 'Đăng nhập' } },
  { path: '/register', component: Register, meta: { title: 'Đăng ký' } },
  { path: '/admin', component: AdminHome, meta: { title: 'Quản trị viên' } },
  { path: '/home', component: Home, meta: { title: 'Trang chủ' } },
  { path: '/update-info', component: UpdateInfo },
  { path: '/contact', component: Contact, meta: { title: 'Liên hệ' } },
  { path: '/guide', component: Guide, meta: { title: 'Hướng dẫn mượn sách' } },
  { path: '/account', component: Account, meta: { title: 'Tài khoản' } },
  { path: '/books', component: Books, meta: { title: 'Sách' } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: 'Không tìm thấy' } }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const isNotFound = to.name === 'NotFound';
  const authRequired = !publicPages.includes(to.path) && !isNotFound;
  const token = localStorage.getItem('token');

  if (authRequired && !token) {
    return next('/login');
  }
  document.title = to.meta.title || 'Quản lý thư viện';
  next();
});

export default router;