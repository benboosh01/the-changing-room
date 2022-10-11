<script>
import { supabase } from "../supabase";
import { ref } from "vue";
export default {
  setup() {
    const loading = ref(false);
    const item_name = ref('');
    const description = ref('');
    const category_id = ref(null);
    const condition = ref('');
    const item_preview_url = ref('');

    async function uploadItemForm() {
      try {
        loading.value = true;

        // todo - owner_id is hardcoded, user login must be working to send this
        const data = {
          item_name: item_name.value,
          description: description.value,
          category_id: category_id.value,
          condition: condition.value,
          item_preview_url: item_preview_url.value,
          owner_id: "c205d247-4a22-46ad-8458-45d6d1964d0f",
        };
        console.log("DATAAAAAA", data);
        const { error } = await supabase.from("items").insert(data);

        if (error) throw error;
      } catch (error) {
        console.log("error", error);
        alert(error.message);
      } finally {
        loading.value = false;
        item_name.value = "";
        description.value = "";
        category_id.value = null;
        condition.value = "";
        item_preview_url.value = "";
        alert("Succesfully uploaded item");
      }
    }

    return {
      loading,
      item_name,
      description,
      category_id,
      condition,
      item_preview_url,
      uploadItemForm,
    };
  },
      watch: {
        item_preview_url(newItemPreviewUrl, oldItemPreviewUrl) {
            if (!newItemPreviewUrl
                  .match(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/)) {
                alert('item preview url must be a valid url')
            } 
        }
    }
};
</script>

<template>
  <h1>Upload Item</h1>
  <form @submit.prevent="uploadItemForm">
    <label for="item_name">Item</label>
    <input
      id="item_name"
      type="text"
      v-model="item_name"
      placeholder="Enter new item"
      required
    />

    <label for="description">Description</label>
    <input
      id="description"
      type="text"
      v-model="description"
      placeholder="Enter item description"
      required
    />

    <label for="category_id">Category</label>

    <select v-model="category_id" required>
      <option value="0" selected disabled>
        ---- Select Category ----
      </option>
      <option value="1">Formal Wear</option>
      <option value="2">Outdoor Gear</option>
      <option value="3">Coats and Jackets</option>
      <option value="4">Footwear</option>
      <option value="5">Dresses and Skirts</option>
      <option value="6">Trousers</option>
    </select>

    <label for="condition">Condition</label>
    <input
      id="condition"
      type="text"
      v-model="condition"
      placeholder="Enter condition"
      required
    />

    <label for="item_preview_url">Image</label>
    <input
      id="item_preview_url"
      type="text"
      v-model="item_preview_url"
      placeholder="Enter image url"
      required
    />

    <input
      type="submit"
      class="button block primary"
      :value="loading ? 'Loading ...' : 'Submit'"
      :disabled="loading"
    />
  </form>
</template>
