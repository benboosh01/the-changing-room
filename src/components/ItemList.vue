<template>
  <h1>Available Items</h1>
  <label htmlFor="category">Category</label>
  <select v-model="categoryName">
    <option v-for="element in categoryList">{{ element.category_name }}</option>
  </select>
  <div v-if="categoryName">Displaying results for {{ categoryName }}</div>
  <ul>
    <li v-for="item in itemList" :key="item.id">
      {{ item.item_name }}
      <ItemImage v-if="item" :url="item.item_preview_url" />
      <p>{{ item.condition }}</p>
      <p>{{ item.description }}</p>
    </li>
  </ul>
</template>
<script>
import { supabase } from "../supabase";
import { ref, onMounted, onUpdated } from "vue";
import ItemImage from "./ItemImage.vue";

export default {
  components: { ItemImage },

  setup() {
    const loading = ref(true);
    const itemList = ref([]);
    const categoryList = ref([]);
    const categoryName = ref("");
    const categoryId = ref(0);

    async function getCategories() {
      try {
        const { data, error } = await supabase.from("categories").select();
        if (data) {
          categoryList.value = data;
        }
      } catch (error) {
        alert(error.message);
      }
    }
    async function getItems() {
      let query = supabase.from("items").select();
      console.log(categoryName.value)
      if (categoryName.value) {
        categoryList.value.forEach((category) => {
          if (category.category_name === categoryName) {
            categoryId = category.id;
          }
        });
        console.log(categoryId.value);
        query = query.eq("category_id", categoryId.value);
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
    onUpdated(() => {
      getCategories();
    });
    return { itemList, categoryList, categoryName, categoryId };
  },
};
</script>
