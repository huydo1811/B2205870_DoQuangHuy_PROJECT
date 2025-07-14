<template>
  <h1>Trang chủ quản lý thư viện</h1>
  <button @click="logout">Đăng xuất</button>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role'); 
  router.push('/login');
}

</script>