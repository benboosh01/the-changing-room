<template>
  <p>hi</p>
  <img
    :src="imageSrc"
    alt=""
    style="width: 200px; height: 200px; border-radius: 50%"
  />
</template>
<script>
import { supabase } from "../supabase";
import { onMounted, ref } from "vue";

export default {
  props: ["url"],
  setup() {
    const loading = ref(true);
    const imageSrc = ref("");
    async function getItemImage() {
      try {
        const { data, error } = await supabase.storage
          .from("item-images")
          .download("socks.png");
        if (user.error && user.status !== 406) throw error;
        imageSrc.value = URL.createObjectURL(data);
        console.log(imageSrc);
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }
    onMounted(() => {
      getItemImage();
    });
    return { imageSrc };
  },
};
</script>
