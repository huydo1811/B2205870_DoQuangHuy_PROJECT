<template>
  <div class="app-wrapper">
    <Header v-if="!isLoginOrRegisterPage" />
    <Navbar v-if="!isLoginOrRegisterPage" />
    <router-view />
    <Footer v-if="!isLoginOrRegisterPage" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import Header from './components/user/Header.vue';
import Navbar from './components/user/Navbar.vue';
import Footer from './components/user/Footer.vue';

const route = useRoute();
const isLoginOrRegisterPage = computed(() =>
  ['/login', '/register'].includes(route.path) || route.name === 'NotFound'
);

</script>

<style>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
}
</style>
