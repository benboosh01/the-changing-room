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
        <i class="fa-solid fa-star" style="color: #fec42d; margin-left: 5px;"></i>
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
  gap: 5px;
}

.home-avatar {
  border: none;
}

.user-card {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-wrap: wrap;
  text-align: center;
}
</style>
