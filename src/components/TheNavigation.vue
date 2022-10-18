<template>
  <div id="nav-bar">
    <router-link to="/home">Home</router-link>
    <router-link to="/items">Items</router-link>
    <router-link to="/profile" v-if="store.user.id">Profile</router-link>
    <button v-if="store.user.id" @click="logOut">Log Out</button>
  </div>
</template>

<script setup>
import { useStore } from "../store";
const store = useStore();

function logOut() {
  if (store.user.id) {
    store.user = {};
    router.push({ path: "/home" });
  }
}
</script>

<style scoped>
#nav-bar {
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
}
</style>
