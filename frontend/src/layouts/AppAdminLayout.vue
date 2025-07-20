<template>
  <div class="admin-layout">
    <AdminHeader />
    <div class="d-flex">
      <AdminSidebar />
      <div class="admin-content flex-grow-1">
        <router-view />
        <AdminFooter />
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminHeader from '../components/admin/Header.vue';
import AdminSidebar from '../components/admin/Sidebar.vue';
import AdminFooter from '../components/admin/Footer.vue';
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}
.d-flex {
  flex: 1;
  display: flex;
  flex-direction: row;
}
.admin-content {
  margin-left: 220px;
  min-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  padding: 32px 18px 0 18px;
  animation: fadein 0.7s;
}
@media (max-width: 991.98px) {
  .admin-content {
    margin-left: 0;
    padding: 16px 4px 0 4px;
  }
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: none;}
}
</style>