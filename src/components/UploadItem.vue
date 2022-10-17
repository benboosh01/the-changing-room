<script>
import { supabase } from '../supabase';
import { ref } from 'vue';
import { useStore } from '../store';

export default {
  setup() {
    const store = useStore();
    const loading = ref(false);
    const item_name = ref('');
    const description = ref('');
    const category_id = ref(null);
    const condition = ref('');
    let item_preview_url = ref('');

    async function uploadItemForm() {
      try {
        loading.value = true;

        const file = item_preview_url.value[0];

        if (!file.name) return 'ERROR';

        // todo - owner_id is hardcoded, user login must be working to send this
        const data = {
          item_name: item_name.value,
          description: description.value,
          category_id: category_id.value,
          condition: condition.value,
          item_preview_url: file.name,
          owner_id: store.user.id,
          owner_username: store.user.username,
        };

        const { error } = await supabase.from('items').insert(data);

        let { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(file.name, file);

        if (error) throw error;
      } catch (error) {
        console.log('error', error);
        alert(error.message);
      } finally {
        loading.value = false;
        item_name.value = '';
        description.value = '';
        category_id.value = null;
        condition.value = '';
        item_preview_url.value = '';
        alert('Succesfully uploaded item');
      }
    }

    function onFileSelected(event) {
      if (event.target.files.length === 0) {
        return;
      }

      item_preview_url.value = event.target.files;
    }

    return {
      loading,
      item_name,
      description,
      category_id,
      condition,
      item_preview_url,
      uploadItemForm,
      onFileSelected,
    };
  },
};
</script>

<template>
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
      <option value="0" selected disabled>---- Select Category ----</option>
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
      type="file"
      @change="onFileSelected($event)"
      placeholder="Choose file to upload"
      accept="image/jpeg, image/png, image/jpg"
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

