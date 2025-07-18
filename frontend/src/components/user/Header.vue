<template>
  <header class="custom-header">
    <div class="container d-flex justify-content-between align-items-center">
      <router-link to="/home" class="mb-0 text-decoration-none">
        <h1 class="mb-0">📚 Thư viện Ước mơ</h1>
      </router-link>
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Tìm sách..." aria-label="Search">
        <button class="btn btn-outline-light" type="submit">Tìm</button>
      </form>
      <button class="btn btn-outline-light" @click="logout">Đăng xuất</button>
    </div>
  </header>
</template>

<style scoped>
.custom-header {
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  color: #fff;
  padding: 16px 0;
}
.custom-header h1 {
  color: #fff;
}
</style>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role'); 
  router.push('/login');
}

</script>