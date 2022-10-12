<template>
  <h1>{{ username }}</h1>
  <p>{{ location }}</p>
  <img
    :src="image"
    alt=""
    style="width: 200px; height: 200px; border-radius: 50%"
  />
  <button @click="onClick()">Update details</button>
  <form v-show="clicked">
    <label htmlFor="name">Name</label>
    <input v-model="username"/>
  </form>
</template>

<script setup>
import { supabase } from "../supabase";
import { store } from "../store";
import { ref, onMounted } from "vue";

    const loading = ref(true);
    const userId = ref("");
    const username = ref("");
    const location = ref("");
    const avatar_url = ref("");
    const image = ref("");
    let clicked = ref(false)

    async function onClick() {
      console.log(clicked)
      clicked.value = true
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
