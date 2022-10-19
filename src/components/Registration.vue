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
  <div class="register-box">
  <h1 class="register-title">Register</h1>
  <form @submit.prevent="submitForm" class="register-form">
    <label for="username">username</label>
    <input
      id="username"
      v-model="username"
      placeholder="Enter username"
      required
    />
    <label for="avatar">avatar</label>
    <input
      id="avatar"
      type="file"
      v-on:change="setFiles"
      placeholder="Upload image file"
    />
    <label for="location">location</label>
    <input
      id="location"
      type="text"
      v-model="location"
      placeholder="Enter nearest town/city"
      required
    />
    <input
      type="submit"
      class="input-button"
      :value="loading ? 'Loading ...' : 'Submit'"
      :disabled="loading || disable"
    />
  </form>
</div>
</template>

<style scoped>
.register-box {
  padding: 40px;
  background-color: #E9F1F7;
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0, 0.5);
  border-radius: 10px;
}

.register-title {
  margin: 0 0 30px;
  padding: 0;
  text-align: center;
}

.register-form > #username, 
.register-form > #location,
.register-form > #avatar
 {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.register-form > label {
  font-size: 16px;
  pointer-events: none;
  transition: .5s;
}

.register-box #username:focus ~ label,
.register-box #username:valid ~ label,
.register-box #location:focus ~ label,
.register-box #location:focus ~ label
  {
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
