<template>
  <h1>{{ username }}</h1>
  <p>{{ location }}</p>
  <img :src='image' alt="" style="width: 200px; height: 200px; border-radius: 50%;" />
</template>

<script>
import { supabase } from "../supabase";
import { store } from "../store";
import { ref, onMounted } from "vue";

export default {
  setup() {
    const loading = ref(true);
    const username = ref("");
    const location = ref("");
    const avatar_url = ref("");
    const image = ref("");

    async function getProfile() {
      try {
        loading.value = true;
        let user = await supabase
          .from("users")
          .select(`username, location, avatar_url`)
          .eq("id", "c205d247-4a22-46ad-8458-45d6d1964d0f")
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
      getProfile();
    });
    return {
      store,
      loading,
      username,
      location,
      avatar_url,
      image
    };
  },
};
</script>