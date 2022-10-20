<template>
  <Hero />
  <Login v-if="loginVisible" />
  <Registration v-if="regVisible" @toggleLogin="toggleLogin" />
  
  <div v-if="!store.user.id" class="flex flex-center button-group">
    <button
      @click="toggleLogin"

      v-show="loginBtn"
      class="primary"
    >
      Login
    </button>
    <button
      @click="toggleReg"
      v-show="regBtn"
      class="primary"
    >
      Register
    </button>
  </div>

  <div class="section-1">
    <h2 class="home-list-title">Our highest rated swappers</h2>
    <TopUsers />
  </div>

  <div class="section-2">
  <h2 class="home-list-title">Our most recent listings</h2>
  <ul id="home-item-list">
    <li v-for="item in recentItems" :key="item.id" class="home-item-card">
      <ItemImage v-if="item" :url="item.item_preview_url" />
      <h3>{{ item.item_name }}</h3>
      <button @click="selectItem(item.id)" class="select-button">
        View item details
      </button>
    </li>
  </ul>
  </div>
</template>
<script setup>
import Login from '../components/Login.vue';
import Registration from '../components/Registration.vue';
import { onMounted, ref } from 'vue';
import { useStore } from '../store';
import TopUsers from '../components/TopUsers.vue';
import { supabase } from '../supabase';
import router from '../router/index';
import ItemImage from '../components/ItemImage.vue';
import Hero from '../components/Hero.vue';

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

#home-item-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 100%;
  gap: 5px;
}

.home-item-card {
  text-align: center;
  border: 1px solid black;
  margin: 10px 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-wrap: wrap;
  background-color: white;
}

.home-list-title {
  text-align: center;
  font-size: 32px;
  padding: 30px;
  color: #243b4a;

}
</style>
