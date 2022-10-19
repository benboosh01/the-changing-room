<template>
    <div class="profile-card">
  <img :src="image"  alt="profile-image"
        class="profile-image"
        style="width: 200px; height: 200px; border-radius: 50%" />
        </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../supabase";
const image = ref("");
const loading = ref(false);
const props = defineProps(["avatarUrl"]);

async function getAvatar() {
  loading.value = true;
  try {
      const { data, error } = await supabase.storage
          .from("avatars")
          .getPublicUrl(props.avatarUrl);
      image.value = data.publicURL;
      if(error) throw error
  } catch (error) {
      alert(error.message)
  } finally {
      loading.value = false
  }
}

onMounted(() => {
  getAvatar();
});
</script>
<style scoped>
.profile-card {
  border: 1px solid black;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  list-style: none;
  margin-bottom: 20px;
  justify-content: center;
}
.profile-image {
    border: 2px solid #03bfcb;
    padding: 5px;
}
</style>
