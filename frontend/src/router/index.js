import { createRouter, createWebHistory } from 'vue-router';
import AppUserLayout from '../layouts/AppUserLayout.vue';
import AppAdminLayout from '../layouts/AppAdminLayout.vue';
import Home from '../views/user/Home.vue';
import Login from '../views/user/Login.vue';
import Register from '../views/user/Register.vue';
import NotFound from '../views/NotFound.vue';
import UpdateInfo from '../views/user/UpdateInfo.vue';
import Contact from '../views/user/Contact.vue';
import Guide from '../views/user/Guide.vue';
import Account from '../views/user/Account.vue';
import Books from '../views/user/Books.vue';
import History from '../views/user/History.vue';
import AdminHome from '../views/admin/AdminHome.vue';
import AdminProfile from '../views/admin/Profile.vue';
import Users from '../views/admin/Users.vue';
import BooksManager from '../views/admin/Books.vue';
import Publishers from '../views/admin/Publishers.vue'; 
import Borrow from '../views/admin/Borrow.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { title: 'Đăng nhập' } },
  { path: '/register', component: Register, meta: { title: 'Đăng ký' } },
  // Layout cho user
  {
    path: '/',
    component: AppUserLayout,
    children: [
      { path: 'home', component: Home, meta: { title: 'Trang chủ' } },
      { path: 'update-info', component: UpdateInfo },
      { path: 'contact', component: Contact, meta: { title: 'Liên hệ' } },
      { path: 'guide', component: Guide, meta: { title: 'Hướng dẫn mượn sách' } },
      { path: 'account', component: Account, meta: { title: 'Tài khoản' } },
      { path: 'books', component: Books, meta: { title: 'Sách' } },
      { path: 'history', component: History, meta: { title: 'Lịch sử mượn sách' } },
    ]
  },
  // Layout cho admin
  {
    path: '/admin',
    component: AppAdminLayout,
    children: [
      { path: '', component: AdminHome, meta: { title: 'Quản trị viên' } },
      { path: 'profile', component: AdminProfile, meta: { title: 'Thông tin cá nhân' } },
      { path: 'staff', component: () => import('../views/admin/Staff.vue'), meta: { title: 'Quản lý nhân viên' } },
      { path: 'users', component: Users, meta: { title: 'Quản lý người dùng' } },
      { path: 'books', component: BooksManager, meta: { title: 'Quản lý sách' } },
      { path: 'publishers', component: Publishers, meta: { title: 'Quản lý nhà xuất bản' } },
      { path: 'borrow', component: Borrow, meta: { title: 'Mượn sách' } }
    ]
  },
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
  const role = localStorage.getItem('role');

  if (authRequired && !token) {
    return next('/login');
  }

  // Chặn user vào admin
  if (to.path.startsWith('/admin')) {
    if (role !== 'admin') {
      return next('/home');
    }
  }

  // Chặn admin vào user
  if (
    to.matched.some(r => r.path === '/' && r.path !== '/login' && r.path !== '/register')
    && role === 'admin'
  ) {
    return next('/admin');
  }

  document.title = to.meta.title || 'Quản lý thư viện';
  next();
});

export default router;