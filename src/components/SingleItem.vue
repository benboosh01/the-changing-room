<template>
  <div v-if="loading">Loading details...</div>
  <h1>{{ itemName }}</h1>
  <h2>{{ itemCategory }}</h2>
  <h3>Condition: {{ itemCondition }}</h3>
  <ItemImage v-if="itemImage" :url="itemImage" />
  <p>Posted by: {{ itemOwner }}</p>
  <p>{{ itemDescription }}</p>
  <button>Message {{ itemOwner }}</button>
  <button>Start a swap</button>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import router from "../router";
import { supabase } from "../supabase";
import ItemImage from "./ItemImage.vue";

const route = useRoute();
const id = route.params.id;
const loading = ref(true);
const itemName = ref("");
const itemDescription = ref("");
const itemCondition = ref("");
const itemCategory = ref("");
const itemOwner = ref("");
const itemImage = ref("");

async function getItemById() {
  try {
    const { data, error } = await supabase
      .from("items")
      .select("*, categories (category_name)")
      .eq("id", id);

    console.log(data);

    itemName.value = data[0].item_name;
    itemDescription.value = data[0].description;
    itemCondition.value = data[0].condition;
    itemCategory.value = data[0].categories.category_name;
    itemOwner.value = data[0].owner_username;
    itemImage.value = data[0].item_preview_url;
    console.log(itemOwner);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
function onMessageClick() {
  router.push({ name: "inbox" });
}

function onSwapClick() {
  router.push({ name: "swapForm", params: { item_id: id } });
}

onMounted(() => {
  getItemById();
});
</script>
