<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <TheNavigation />
    <button v-if="store.user.id" @click="logOut">Log Out</button>
    <Title />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Title from './components/Title.vue';
import TheNavigation from './components/TheNavigation.vue';
import { store } from './store';
import router from './router';

function logOut() {
  if (store.user.id) {
    store.user = {};
    router.push({ path: '/home' });
  }
}
</script>
