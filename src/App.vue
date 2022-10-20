<template>
  <TheNavigation />

  <div style="padding: 0px 0 100px 0">
    <router-view></router-view>
  </div>
  <Footer />
</template>

<script setup>
import TheNavigation from './components/TheNavigation.vue';
import Footer from './components/Footer.vue';
</script>

