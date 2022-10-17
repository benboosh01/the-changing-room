<template>
  <h1>{{ username }}</h1>
  <p>{{ location }}</p>
  <img
    :src="image"
    alt=""
    style="width: 200px; height: 200px; border-radius: 50%"
  />
  <button @click="onClick()" v-show="!clicked">Update details</button>
  <form v-show="clicked" @submit.prevent="onSubmit">
    <label htmlFor="name">Name</label>
    <input v-model="username" />
    <label htmlFor="location">Location</label>
    <input v-model="location" />
    <label htmlFor="avatar">Profile picture</label>
    <input type="file" v-on:change="setFiles" />
    <br />
    <button>Submit</button>
  </form>
</template>

<script setup>
import { supabase } from '../supabase';
import { useStore } from '../store';
import { ref, onMounted } from 'vue';

const store = useStore();
const loading = ref(true);
const userId = ref('');
const username = ref('');
const location = ref('');
const avatar_url = ref('');
const avatarFile = ref('');
const image = ref('');
let clicked = ref(false);

function setFiles(event) {
  avatarFile.value = event.target.files[0];
}

function onClick() {
  clicked.value = true;
}
async function onSubmit() {
  try {
    loading.value = true;

    const { data, error1 } = await supabase.storage
      .from('avatars')
      .remove([avatar_url.value]);

    avatar_url.value = avatar_url.value + new Date().getTime();

    const { image, error2 } = await supabase.storage
      .from('avatars')
      .upload(avatar_url.value, avatarFile.value, { upsert: true });

    const updatedDetails = {
      username: username.value,
      avatar_url: avatar_url.value,
      location: location.value,
    };

    const { error } = await supabase
      .from('users')
      .update(updatedDetails)
      .eq('id', userId.value);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    getProfile();
    loading.value = false;
    clicked.value = false;
    alert('details updated');
  }
}

async function getUser() {
  try {
    loading.value = true;

    if (!store.user.id) throw error;
    userId.value = store.user.id;
  } catch (error) {
    alert('Please log in or register');
  } finally {
    loading.value = false;
  }
}

async function getProfile() {
  try {
    loading.value = true;
    let user = await supabase
      .from('users')
      .select(`username, location, avatar_url`)
      .eq('id', userId.value)
      .single();
    if (user.error && user.status !== 406) throw error;
    if (user.data) {
      username.value = user.data.username;
      location.value = user.data.location;
      avatar_url.value = user.data.avatar_url;
    }
    const { data, error } = await supabase.storage
      .from('avatars')
      .getPublicUrl(avatar_url.value);
    image.value = data.publicURL;
  } catch (error) {
    alert('Please log in or register');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getUser();
  getProfile();
});
</script>
