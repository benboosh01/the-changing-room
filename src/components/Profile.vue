<template>
    <h1>{{username}}</h1>
</template>

<script>
import {supabase} from "../supabase";
import {store} from "../store";
import { ref, onMounted } from "vue";

export default {
  setup() {
    const loading = ref(true);
    const username = ref('');
    const location = ref('');
    const avatar_url = ref('');

    async function getProfile() {
      try {
        loading.value = true;
        let { data, error, status } = await supabase
          .from("users")
          .select(`username, location, avatar_url`)
            .eq("id", 'c205d247-4a22-46ad-8458-45d6d1964d0f')
          .single();
        if (error && status !== 406) throw error;
        if (data) {
          username.value = data.username;
          location.value = data.location;
          avatar_url.value = data.avatar_url;
        }
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
      avatar_url,
    };
  },
};
</script>

