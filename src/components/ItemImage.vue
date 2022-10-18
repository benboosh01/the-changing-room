<template>
  <img
    :src="imageSrc"
    alt=""
    style="width: 200px; height: 200px; border-radius: 50%; margin: 20px"
  />
</template>
<script setup>
import { supabase } from "../supabase";
import { onMounted, ref } from "vue";

const props = defineProps(["url"]);
const loading = ref(true);
const imageSrc = ref("");

async function getItemImage() {
  try {
    const { data, error } = await supabase.storage
      .from("item-images")
      .getPublicUrl(props.url);
    if (error && status !== 406) throw error;
    if (data) {
      imageSrc.value = data.publicURL;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getItemImage();
});
</script>
