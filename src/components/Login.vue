<template>
<div class="login-box">
  <h2 class="login-title">Login</h2>
  <form @submit.prevent="loginUser" class="login-form">
    <label for="username">username</label>
    <input
      id="username"
      type="search"
      v-model="username"
      placeholder="Enter username"
      required
      />
    <input
      type="submit"
      class="input-button"
      :value="loading ? 'Loading ...' : 'Login User'"
      :disabled="loading"
    />
  </form>
</div>
</template>

<script>
import { supabase } from '../supabase';
import { ref } from 'vue';
import { useStore } from '../store';
import router from '../router';

export default {
  data() {
    const loading = ref(false);
    const username = ref('');
    const store = useStore();

    async function loginUser() {
      try {
        loading.value = true;

        const { data, error, status } = await supabase
          .from('users')
          .select('*')
          .eq('username', username.value)
          .single();

        if (error && status !== 406) throw error;

        if (data) {
          store.user = data;
          router.push('/profile');
        } else {
          alert('no user found, please register');
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    return {
      loading,
      username,
      loginUser,
    };
  },
};
</script>

<style scoped>
.login-box {
  padding: 40px;
  /* background: rgba(0,0,0,.5); */
  background-color: #E9F1F7;
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0, 0.5);
  border-radius: 10px;
}

.login-title {
  margin: 0 0 30px;
  padding: 0;
  text-align: center;
}

.login-form > #username {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.login-form > label {
  font-size: 16px;
  pointer-events: none;
  transition: .5s;
}

.login-box #username:focus ~ label,
.login-box #username:valid ~ label {
  top: -20px;
  left: 0;
  color: red;
  font-size: 12px;
}

.input-button {
  border: 3px solid #333333;
  text-transform: uppercase;
  background: #f1f1f1;
  padding: 5px 20px;
  margin: 5px;
}
</style>