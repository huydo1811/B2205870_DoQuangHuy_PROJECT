<template>
  <header :class="headerClass" class="py-3 text-center">
    <h1 style="color: #339af0;">Chào mừng đến với Thư viện Ước Mơ</h1>
    <button @click="logout">Đăng xuất</button>
  </header>
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