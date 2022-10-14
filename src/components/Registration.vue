<script>
import { supabase } from '../supabase';
import { ref } from 'vue';
export default {
  emits: ['toggleLogin'],

  setup(_, context) {
    const loading = ref(false);
    const username = ref('');
    const avatar_url = ref('');
    const location = ref('');
    const avatarFile = ref('');
    const disable = ref(false);

    function setFiles(event) {
      avatarFile.value = event.target.files[0];
      avatar_url.value = `${username.value}_avatar`;
    }
    async function submitForm() {
      try {
        loading.value = true;

        const data = {
          username: username.value,
          avatar_url: avatar_url.value,
          location: location.value,
        };

        const { error } = await supabase.from('users').insert(data);

        const { image } = await supabase.storage
          .from('avatars')
          .upload(avatar_url.value, avatarFile.value, { upsert: true });

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
        username.value = '';
        avatar_url.value = '';
        avatarFile.value = '';
        location.value = '';
        alert('Succesfully registered');
        toggleLogin();
      }
    }

    function toggleLogin() {
      context.emit('toggleLogin');
    }

    return {
      loading,
      username,
      avatar_url,
      location,
      disable,
      submitForm,
      setFiles,
    };
  },
  watch: {
    username(newUsername, oldUsername) {
      if (!newUsername.match(/^[A-Za-z0-9]*$/)) {
        alert('username must only contain alpha numeric characters');
        this.disable = true;
      } else {
        this.disable = false;
      }
    },
  },
};
</script>

<template>
  <h1>Register</h1>
  <form @submit.prevent="submitForm">
    <label for="username">username</label>
    <input
      id="username"
      v-model="username"
      placeholder="Enter username"
      required
    />
    <label for="avatar">Avatar</label>
    <input
      id="avatar"
      type="file"
      v-on:change="setFiles"
      placeholder="select image"
    />
    <label for="location">Location</label>
    <input
      id="location"
      type="text"
      v-model="location"
      placeholder="Enter nearest town/city"
      required
    />
    <input
      type="submit"
      class="button block primary"
      :value="loading ? 'Loading ...' : 'Submit'"
      :disabled="loading || disable"
    />
  </form>
</template>
