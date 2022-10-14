<template>
  <h1>Available Items</h1>
  <label htmlFor="categoryName">Category</label>
  <select v-model="categoryName" @change="getItems(categoryName)">
    <option v-for="element in categoryList">{{ element.category_name }}</option>
  </select>
  <div v-if="categoryName">Displaying results for {{ categoryName }}</div>
  <ul>
    <li v-for="item in itemList" :key="item.id">
      {{ item.item_name }}
      <ItemImage v-if="item" :url="item.item_preview_url" />
      <p>{{ item.condition }}</p>
      <p>{{ item.description }}</p>
      <button @click="selectItem(item.id)">View item details</button>
    </li>
  </ul>
</template>
<script setup>
import { supabase } from "../supabase";
import { ref, onMounted } from "vue";
import ItemImage from "./ItemImage.vue";
import router from "../router";


const loading = ref(true);
const itemList = ref([]);
const categoryList = ref([]);
let categoryId = ref(0);

function selectItem(id) {
  router.push({ name: "singleItem", params: {id: id}})

}

async function getCategories() {
  try {
    const { data, error } = await supabase.from("categories").select();
    if (data) {
      categoryList.value = data;
    }
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  }
}
async function getItems(categoryName) {
  let query = supabase.from("items").select();
  if (categoryName) {
    categoryList.value.forEach((category) => {
      if (category.category_name === categoryName) {
        categoryId = category.id;
      }
    });
    query = query.eq("category_id", categoryId);
  }

  try {
    const { data, error } = await query;
    if (error && status !== 406) throw error;
    if (data) {
      itemList.value = data;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getCategories();
  getItems();
});
</script>
