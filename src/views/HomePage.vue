<template>
  <h1>Home page</h1>
  <Login v-if="loginVisible" />
  <Registration v-if="regVisible" />
  <button @click="toggleLogin" v-if="loginBtn">Login</button>
  <button @click="toggleReg" v-if="regBtn">Register</button>
</template>
<script setup>
import Login from '../components/Login.vue';
import Registration from '../components/Registration.vue';
import { ref } from 'vue';

const loginVisible = ref(false);
const loginBtn = ref(true);
const regVisible = ref(false);
const regBtn = ref(true);

function toggleLogin() {
  loginVisible.value = true;
  regBtn.value = true;
  loginBtn.value = false;
  regVisible.value = false;
}

function toggleReg() {
  loginVisible.value = false;
  regBtn.value = false;
  regVisible.value = true;
  loginBtn.value = true;
}
</script>
