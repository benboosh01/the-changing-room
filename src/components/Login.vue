<template>
  <h1>Login</h1>
  <form @submit.prevent="loginUser">
    <label for="username">Username:</label>
    <input id="username" type="search" v-model="username" />
    <input
      type="submit"
      class="button block primary"
      :value="loading ? 'Loading ...' : 'Login User'"
      :disabled="loading"
    />
  </form>
</template>

<script>
import { supabase } from '../supabase';
import { ref } from 'vue';
import { store } from '../store';
import router from '../router';

export default {
  data() {
    const loading = ref(false);
    const username = ref('');

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
