<template>
  <img
    :src="imageSrc"
    alt=""
    style="width: 60px; height: 60px; border-radius: 50%;"
  />
</template>
<script setup>
import { supabase } from "../supabase";
import { onMounted, ref } from "vue";

const props = defineProps(["url"]);
const loading = ref(true);
const imageSrc = ref("");

async function getUserImage() {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .getPublicUrl(props.url);
    if (error && status !== 406) throw error;
    if (data) {
      console.log('data', data)
      imageSrc.value = data.publicURL;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getUserImage();
});
</script>
