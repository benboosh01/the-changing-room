<template>
    <TheNavigation />
  <div class="container" style="padding: 0px 0 100px 0">
    <Title class="app-title" />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Title from "./components/Title.vue";
import TheNavigation from "./components/TheNavigation.vue";
</script>

<style scoped>
.app-title {
  border: 1px solid black;
  text-align: center;
  font-size: 50px;
  margin-bottom: 30px;
  margin-top: 30px;
}
</style>
