<template>
  <h2 class="title" style="text-align: center">Available Items</h2>
  <div id="category">
    <label class="label" htmlFor="categoryName">Category</label>
    <select
      class="dropdown"
      v-model="categoryName"
      @change="getItems(categoryName)"
    >
      <option v-for="element in categoryList">
        {{ element.category_name }}
      </option>
    </select>
    <div v-if="categoryName">Displaying results for {{ categoryName }}</div>
  </div>
  <ul id="item-list">
    <li v-for="item in itemList" :key="item.id" class="item">
      <h2>{{ item.item_name }}</h2>
      <ItemImage v-if="item" :url="item.item_preview_url" />
      <button @click="selectItem(item.id)" class="select-button primary">
        View item details
      </button>
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
  router.push({ name: "singleItem", params: { id: id } });
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

<style scoped>
#item-list {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  justify-content: center;
  list-style-type: none;
  width: 100%;
}
.item {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-wrap: wrap;
  text-align: center;
}

#category {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px;
}

.dropdown {
  padding: 6px 20px;
  margin: 8px 8px;
  border: 1px solid #f4f4f4;
  text-align: center;
  border-radius: 10px;
}

.title {
  font-size: 32px;
  margin-top: 50px;
}

.label {
  font-size: 18px;
}
</style>
