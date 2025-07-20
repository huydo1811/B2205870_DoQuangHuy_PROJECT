<template>
  <aside class="admin-sidebar shadow animate-slidein">
    <ul class="list-unstyled mb-0">
      <li
        v-for="item in navItems"
        :key="item.title"
        :class="['nav-item', { active: $route.path.startsWith(item.path) }]"
        @click="navigate(item.path)"
      >
        <i :class="item.icon" class="me-2"></i>{{ item.title }}
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const navItems = [
  { title: "Trang chủ", path: "/admin", icon: "bi bi-house-door" },
  { title: "Quản lý sách", path: "/admin/books", icon: "bi bi-journal-bookmark" },
  { title: "Độc giả", path: "/admin/users", icon: "bi bi-people" },
  { title: "Mượn/trả sách", path: "/admin/borrow", icon: "bi bi-arrow-left-right" },
  { title: "Nhân viên", path: "/admin/staff", icon: "bi bi-person-badge" }
];
function navigate(path) {
  router.push(path);
}
</script>

<style scoped>
.admin-sidebar {
  width: 220px;
  background: #fff;
  height: calc(100vh - 56px);
  position: fixed;
  top: 56px;
  left: 0;
  overflow-y: auto;
  border-right: 1.5px solid #e7f5ff;
  box-shadow: 2px 0 16px #339af022;
  z-index: 1000;
  animation: slidein 0.7s;
  transition: left 0.3s, width 0.3s;
}
@keyframes slidein {
  from { opacity: 0; transform: translateX(-40px);}
  to { opacity: 1; transform: none;}
}
.nav-item {
  padding: 13px 24px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 10px 0 0 10px;
  margin-bottom: 6px;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
}
.nav-item:hover,
.nav-item.active {
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  color: #fff;
  box-shadow: 0 2px 8px #339af033;
}
.nav-item i {
  font-size: 1.2rem;
}
/* Responsive: chuyển sidebar thành thanh ngang trên mobile */
@media (max-width: 991.98px) {
  .admin-sidebar {
    position: static;
    width: 100vw;
    height: auto;
    top: 0;
    box-shadow: none;
    border-right: none;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    padding: 0 0 8px 0;
  }
  .admin-sidebar ul {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 0;
    padding: 0 8px;
  }
  .nav-item {
    border-radius: 10px;
    margin: 0 4px 0 0;
    padding: 10px 12px;
    font-size: 1rem;
    white-space: nowrap;
  }
}
</style>