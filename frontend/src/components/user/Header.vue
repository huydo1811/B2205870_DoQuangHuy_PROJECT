<template>
  <header class="custom-header">
    <div class="container d-flex flex-wrap flex-md-nowrap justify-content-between align-items-center">
      <router-link to="/home" class="mb-2 mb-md-0 text-decoration-none">
        <h1 class="mb-0 fs-4 fs-md-2">📚 Thư viện Ước mơ</h1>
      </router-link>
      <form class="d-flex mb-2 mb-md-0 me-md-3 flex-grow-1" role="search" style="max-width: 320px;">
        <input class="form-control me-2" type="search" placeholder="Tìm sách..." aria-label="Search">
        <button class="btn btn-outline-light" type="submit">Tìm</button>
      </form>
      <button class="btn btn-outline-light ms-md-2 mt-2 mt-md-0" style="min-width: 110px;" @click="logout">
        Đăng xuất
      </button>
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
  font-size: 1.2rem;
}
@media (max-width: 767.98px) {
  .custom-header h1 {
    font-size: 1rem;
  }
  .custom-header .btn {
    font-size: 0.95rem;
    padding: 7px 12px;
    width: 100%;
  }
  .custom-header .container {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  form[role="search"] {
    width: 100% !important;
    max-width: 100% !important;
    margin-bottom: 8px !important;
  }
}
</style>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role'); 
  localStorage.removeItem('maDocGia');
  router.push('/login');
}

</script>