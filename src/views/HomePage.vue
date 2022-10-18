<template>
  <Login v-if="loginVisible" />
  <Registration v-if="regVisible" @toggleLogin="toggleLogin" />

  <div class="flex flex-center button-group">
    <button
      @click="toggleLogin"
      v-if="!store.user.id"
      v-show="loginBtn"
      class="primary"
    >
      Login
    </button>
    <button
      @click="toggleReg"
      v-if="!store.user.id"
      v-show="regBtn"
      class="primary"
    >
      Register
    </button>
  </div>

  <!-- TODO - move to components -->
  <div>homepage content</div>
  <div>Our highest rated swappers</div>
  <div>Newest items preview</div>
</template>
<script setup>
import Login from "../components/Login.vue";
import Registration from "../components/Registration.vue";
import { ref } from "vue";
import { useStore } from "../store";

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

<style scoped>
.button-group {
  margin-top: 30px;
}
</style>
