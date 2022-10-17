<template>
  <ul id="nav-bar">
    <router-link to="/home">Home</router-link>
    <router-link to="/items">Items</router-link>
    <router-link to="/profile" v-if="store.user.id">Profile</router-link>
  </ul>
</template>

<style scoped>
#nav-bar {
  display: flex;
  justify-content: space-between;
}
</style>

<script setup>
import { useStore } from '../store';
const store = useStore();
const user = store.user;
</script>
