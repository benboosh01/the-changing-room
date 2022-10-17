<template>
  <Login v-if="loginVisible" />
  <Registration v-if="regVisible" @toggleLogin="toggleLogin" />
  <button @click="toggleLogin" v-if="loginBtn">Login</button>
  <button @click="toggleReg" v-if="regBtn">Register</button>
</template>
<script setup>
import Login from '../components/Login.vue';
import Registration from '../components/Registration.vue';
import { onMounted, ref } from 'vue';
import { useStore } from '../store';

const store = useStore();
const loginVisible = ref(false);
const loginBtn = ref(true);
const regVisible = ref(false);
const regBtn = ref(true);
const user = store.user;

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

function checkLoggedIn() {
  if (user.id) {
    regBtn.value = false;
    loginBtn.value = false;
  } else {
    regBtn.value = true;
    loginBtn.value = true;
  }
}

onMounted(() => {
  checkLoggedIn();
});
</script>
