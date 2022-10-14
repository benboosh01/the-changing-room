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
    <input v-model="avatar_url" />
    <br />
    <button>Submit</button>
  </form>
</template>

<script setup>
import { supabase } from "../supabase";
import { store } from "../store";
console.log("store", store);
import { ref, onMounted } from "vue";

const loading = ref(true);
const userId = ref("");
const username = ref("");
const location = ref("");
const avatar_url = ref("");
const image = ref("");
let clicked = ref(false);

async function onClick() {
  clicked.value = true;
}
async function onSubmit() {
  const updatedDetails = {
    username: username.value,
    avatar_url: avatar_url.value,
    location: location.value,
  };
  try {
    console.log("updating");
    loading.value = true;
    const { error } = await supabase
      .from("users")
      .update(updatedDetails)
      .eq("id", userId.value);
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
    clicked.value = false;
    alert("details updated");
  }
}

async function getUser() {
  try {
    loading.value = true;
    userId.value = store.user.id;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function getProfile() {
  try {
    loading.value = true;
    let user = await supabase
      .from("users")
      .select(`username, location, avatar_url`)
      .eq("id", userId.value)
      .single();
    if (user.error && user.status !== 406) throw error;
    if (user.data) {
      username.value = user.data.username;
      location.value = user.data.location;
      avatar_url.value = user.data.avatar_url;
    }
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(avatar_url.value);

      console.log('avatar data', data, error)
    image.value = URL.createObjectURL(data);
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getUser();
  getProfile();
});
</script>
