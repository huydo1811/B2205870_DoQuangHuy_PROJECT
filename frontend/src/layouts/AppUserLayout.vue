<template>
  <div class="app-wrapper">
    <Header />
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '../components/user/Header.vue';
import Navbar from '../components/user/Navbar.vue';
import Footer from '../components/user/Footer.vue';
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