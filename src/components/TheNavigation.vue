<template>
  <header id="header">
    <nav class="navbar">
      <ul class="navbar-links">
        <router-link to="/home">home</router-link>
        <router-link to="/items">items</router-link>
        <router-link to="/profile" v-if="store.user.id">profile</router-link>
        <button v-if="store.user.id" @click="logOut" class="logout-btn">
          Log Out
        </button>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { useStore } from '../store';
import router from '../router/index';
const store = useStore();

function logOut() {
  store.user = {};
  router.push({ path: '/home' });
}
</script>

<style scoped>
#header {
  background-color: #243b4a;
  min-height: 75px;
  position: sticky;
  width: 100%;
  top: 0;
}

.navbar {
  min-height: 75px;
  max-width: 1366px;
  display: flex;
  align-items: center;
}

.navbar-links > a {
  text-decoration: none;
  font-size: 15px;
  padding: 1rem;
  color: #fff;
}

.navbar-links > a:hover {
  color: #ff6700;
}

.logout-btn {
  border: none;
  background-color: transparent;
  color: #ff6700;
  margin-left: 30px;
}

.navbar-links {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}
</style>
