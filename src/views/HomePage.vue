<template>
  <Login v-if="loginVisible" />
  <Registration v-if="regVisible" @toggleLogin="toggleLogin" />

  <div class="flex flex-center button-group">
    <button
      @click="toggleLogin"
      v-if="!store.user.id"
      v-show="loginBtn"
      class="primary"
    >
      Login
    </button>
    <button
      @click="toggleReg"
      v-if="!store.user.id"
      v-show="regBtn"
      class="primary"
    >
      Register
    </button>
  </div>

  <h2>Our most recent listings</h2>
  <ul id="item-list">
    <li v-for="item in recentItems" :key="item.id" class="item">
      <h2>{{ item.item_name }}</h2>
      <ItemImage v-if="item" :url="item.item_preview_url" />
      <p>{{ item.condition }}</p>
      <p>{{ item.description }}</p>
      <button @click="selectItem(item.id)" class="select-button">
        View item details
      </button>
    </li>
  </ul>
</template>
<script setup>
import Login from '../components/Login.vue';
import Registration from '../components/Registration.vue';
import { onMounted, ref } from 'vue';
import { useStore } from '../store';
import { supabase } from '../supabase';
import router from '../router/index';
import ItemImage from '../components/ItemImage.vue';

const store = useStore();
const loading = ref(false);
const loginVisible = ref(false);
const loginBtn = ref(true);
const regVisible = ref(false);
const regBtn = ref(true);
const user = store.user;
const recentItems = ref([]);

function toggleLogin() {
  loginVisible.value = true;
  regBtn.value = true;
  loginBtn.value = false;
  regVisible.value = false;
}

function toggleReg() {
  loginVisible.value = false;
  regBtn.value = false;
  regVisible.value = true;
  loginBtn.value = true;
}

async function getItems() {
  try {
    loading.value = true;

    const { data: items, error } = await supabase
      .from('items')
      .select()
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    if (items) {
      recentItems.value = items;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = true;
  }
}

function selectItem(id) {
  router.push({ name: 'singleItem', params: { id: id } });
}

onMounted(() => {
  getItems();
});
</script>

<style scoped>
.button-group {
  margin-top: 30px;
}
</style>
