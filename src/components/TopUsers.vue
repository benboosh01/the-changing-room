<template>
  <ul class="profile-list">
    <li v-for="user in processedUsersArray" class="user-card">
      <AvatarImage
        v-if="user"
        :avatarUrl="user.avatar_url"
        class="home-avatar"
      />
      <p>
        {{ user.username }}: {{ user.ave_review_score }}
        <i class="fa-solid fa-star"></i>
      </p>
    </li>
  </ul>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { supabase } from '../supabase';
import AvatarImage from './AvatarImage.vue';
const loading = ref(true);
const topUsersArray = ref([]);
const processedUsersArray = ref([]);

async function getUserRatings() {
  try {
    const { data, error } = await supabase.rpc('ave_user_rating');
    console.log(data);
    topUsersArray.value = data.slice(0, 3);

    processedUsersArray.value = topUsersArray.value.map((user) => {
      const rounding = { ...user };
      rounding.ave_review_score = Math.round(user.ave_review_score * 10) / 10;
      return rounding;
    });
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

<style scoped>
.profile-list {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  justify-content: center;
  list-style-type: none;
  width: 100%;
  gap: 10px;
}

.home-avatar {
  border: none;
}

.user-card {
  text-align: center;
  border: 1px solid black;
  margin: 10px 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-wrap: wrap;
}
</style>
