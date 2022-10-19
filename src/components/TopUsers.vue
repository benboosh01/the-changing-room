<template>
  <ul>
    <li v-for="user in topUsersArray">
      <p>{{ user.username }}: {{ user.ave_review_score }}</p>
    </li>
  </ul>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../supabase";
const loading = ref(true);
const topUsersArray = ref([]);

async function getUserRatings() {
  try {
    const { data, error } = await supabase.rpc("ave_user_rating");
    console.log(data);
    topUsersArray.value = data.slice(0, 3);
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getUserRatings();
});
</script>
