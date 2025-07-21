<template>
  <header class="custom-header">
    <div class="container d-flex flex-wrap flex-md-nowrap justify-content-between align-items-center">
      <router-link to="/home" class="mb-2 mb-md-0 text-decoration-none">
        <h1 class="mb-0 fs-2 fs-md-2">📚 Thư viện Ước mơ</h1>
      </router-link>
      <!-- Chỉ thêm max-width cho form, không dùng flex-grow-1 ở PC -->
      <form
        class="d-flex mb-md-0 me-md-3"
        role="search"
        style="max-width: 420px; width: 100%;"
        @submit.prevent="globalSearch"
      >
        <input v-model="searchText" class="form-control" type="search" placeholder="Tìm sách..." aria-label="Search">
        <button class="btn btn-outline-light ms-2" type="submit" style="min-width: 60px;">Tìm</button>
        <button class="btn btn-outline-light logout-btn d-md-none ms-2" type="button" @click="logout" style="min-width: 80px;">Đăng xuất</button>
      </form>
      <!-- Nút đăng xuất ngoài form, chỉ hiện trên PC -->
      <button class="btn btn-outline-light ms-md-2 mt-2 mt-md-0 logout-btn d-none d-md-block" style="min-width: 110px;" @click="logout">
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
    margin-bottom: 8px;
  }

  .custom-header .container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  form[role="search"] {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    width: 100%;
  }

  .custom-header .form-control {
    flex-grow: 1;
    font-size: 0.95rem;
    padding: 6px 8px;
  }

  .custom-header .btn {
    font-size: 0.9rem;
    padding: 6px 8px;
    white-space: nowrap;
  }

  .logout-btn.d-md-none {
    display: inline-block !important;
  }

  .logout-btn.d-none.d-md-block {
    display: none !important;
  }
}

</style>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const searchText = ref('');

function globalSearch() {
  if (searchText.value.trim()) {
    router.push({ path: '/books', query: { TenSach: searchText.value.trim() } });
    searchText.value = '';
  } else {
    router.push('/books');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role'); 
  localStorage.removeItem('maDocGia');
  router.push('/login');
}

</script>