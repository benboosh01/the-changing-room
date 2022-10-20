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
  /* border: 1px solid #a2a2a2; */
  /* background-color: #f4f4f4; */
  background-color: #243b4a;
  /* -webkit-box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.75); */
  /* -moz-box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.5); */
  /* box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.5); */
  position: sticky;
  width: 100%;
  top: 0;
}

.navbar {
  max-width: 1366px;
  display: flex;
  align-items: center;
}

.navbar-links > a {
  /* text-transform: uppercase; */
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

/* media queries */
@media (min-width: 769px) {
  .navbar,
  .navbar-links {
    display: flex;
  }
  .navbar {
    flex-direction: column;
    align-items: center;
  }
}

@media (min-width: 1025px) {
  .navbar {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
