<template>
  <h1>{{ loggedInUser === userId ? 'Your' : username }} Items</h1>
  <button @click="toggleUpload">Add New Item</button>
  <UploadItem v-if="upLoadVisible && loggedInUser === userId" />
  <ul>
    <li v-for="item in userItems" :key="item.id">
      <h3>{{ item.item_name }}</h3>
      <ItemImage v-if="item" :url="item.item_preview_url" />
      <p>{{ item.condition }}</p>
      <p>{{ item.description }}</p>
    </li>
  </ul>
</template>

<script>
import { supabase } from '../supabase';
import { onMounted, ref } from 'vue';
import { store } from '../store';
import ItemImage from './ItemImage.vue';
import UploadItem from './UploadItem.vue';

export default {
  components: { ItemImage, UploadItem },

  setup() {
    const loading = ref(false);
    const username = ref('');
    const userId = ref('');
    const userItems = ref([]);
    const loggedInUser = store.user.id;
    const upLoadVisible = ref(false);

    async function getUser() {
      try {
        loading.value = true;
        username.value = store.user.username;
        userId.value = store.user.id;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function getUserItems() {
      try {
        loading.value = true;

        const { data: items, error } = await supabase
          .from('items')
          .select('*')
          .eq('owner_id', userId.value);

        if (error) throw error;

        if (items) {
          userItems.value = items;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    function toggleUpload() {
      upLoadVisible.value = true;
    }

    onMounted(() => {
      getUser();
      getUserItems();
    });

    return {
      loading,
      username,
      userId,
      userItems,
      loggedInUser,
      upLoadVisible,
      toggleUpload,
    };
  },
};
</script>
