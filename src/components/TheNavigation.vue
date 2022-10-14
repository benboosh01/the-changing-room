<template>
  <ul id="nav-bar">
    <router-link to="/home">Home</router-link>
    <router-link to="/items">Items</router-link>
    <router-link to="/profile">Profile</router-link>
  </ul>
</template>

<style scoped>
#nav-bar {
  display: flex;
  justify-content: space-between;
}
</style>
