<template>
  <img
    :src="imageSrc"
    alt=""
    style="width: 200px; height: 200px; border-radius: 50%"
  />
  <p>{{url}}</p>
</template>
<script>
import { supabase } from "../supabase";
import { onMounted, ref } from "vue";

export default {
  props: ['url'],
  // data() {
  //   return {
  //     imageUrl: this.url
  //   }
  // },
  // created() {
  //   console.log(this.url)
  // },
  setup() {
    const loading = ref(true);
    const imageSrc = ref("");
    async function getItemImage() {
      try {
        console.log(this.url)
        const { data, error } = await supabase.storage
          .from("item-images")
          .download(this.url.value);
        console.log(data);
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
      // created();
      getItemImage();
    });
    return { imageSrc };
  },
};
</script>
