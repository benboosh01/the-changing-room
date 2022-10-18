<template>
  <Login v-if="loginVisible" />
  <Registration v-if="regVisible" @toggleLogin="toggleLogin" />
  <button @click="toggleLogin" v-if="!store.user.id" v-show="loginBtn">
    Login
  </button>
  <button @click="toggleReg" v-if="!store.user.id" v-show="regBtn">
    Register
  </button>

<!-- TODO - move to components -->
  <div>homepage content</div>
  <div>Our highest rated swappers
    <TopUsers/>
  </div>
  <div>Newest items preview</div>


</template>
<script setup>
import Login from '../components/Login.vue';
import Registration from '../components/Registration.vue';
import { ref } from 'vue';
import { useStore } from '../store';
import TopUsers from '../components/TopUsers.vue';

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
</script>
