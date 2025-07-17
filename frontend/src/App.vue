<template>
  <Header v-if="!isLoginOrRegisterPage" />
  <router-view />
  <Footer v-if="!isLoginOrRegisterPage" />
</template>


<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import Header from './components/user/Header.vue';
import Footer from './components/user/Footer.vue';

const route = useRoute();
const isLoginOrRegisterPage = computed(() =>
  ['/login', '/register'].includes(route.path) || route.name === 'NotFound'
);

</script>