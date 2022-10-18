<template>
  <header id="header">
    <nav class="navbar">
      <ul class="navbar-links">
        <router-link to="/home">Home</router-link>
        <router-link to="/items">Items</router-link>
        <router-link to="/profile" v-if="store.user.id">Profile</router-link>
        <button v-if="store.user.id" @click="logOut" class="logout-btn">Log Out</button>
      </ul>
    </nav>
  </header>
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
#header {
  display: flex;
  border: 1px solid #a2a2a2;
  background-color: #f4f4f4;
  -webkit-box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.75);
	-moz-box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.75);
	box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.75);
  position: sticky;
  top: 0;
}

.navbar {
  max-width: 1366px;
  margin: 0 auto;
  padding: 0 3rem;
}

/* .navbar-links {
  margin: 0;
  padding: 0;
  list-style: none;
} */

.navbar-links > a {
  text-transform: uppercase;
  text-decoration: none;
  font-size: 20px;
  padding: 2rem;
}

.navbar-links > a:hover {
  color: #ff6700;
}

.logout-btn {
  border: none;
  background-color: transparent;
  color: #ff6700;
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
