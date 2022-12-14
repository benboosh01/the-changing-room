<template>
  <div id="requests-section">
    <h2>Swap Requests</h2>
    <ul id="requests-list">
      <li
        v-for="request in swapRequests"
        :key="request.swap_id"
        class="request-card"
      >
        <p>From: {{ request.users.username }}</p>
        <p>Item Requested: {{ request.items.item_name }}</p>
        <button class="primary" :value="request.swap_id" @click="viewRequest">
          View Request
        </button>
        <SwapConfirmation
          v-if="requestVisible && requestId === request.swap_id"
          :swapId="request.swap_id"
          @toggleVisible="toggleVisible"
          @updateRequests="updateRequests"
        />
      </li>
    </ul>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from '../store';
import { supabase } from '../supabase';
import SwapConfirmation from './SwapConfirmation.vue';

const store = useStore();
const swapRequests = ref([]);
const loading = ref(false);
const loggedInUser = ref('');
const requestVisible = ref(false);
const requestId = ref();

async function getUser() {
  try {
    loading.value = true;
    loggedInUser.value = store.user.id;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function getRequests() {
  try {
    loading.value = true;

    const { data: requests, error } = await supabase
      .from('swaps')
      .select(
        `swap_id, item_id, approved, users (username, id), items!inner(item_name, item_preview_url)`
      )
      .eq('items.owner_id', loggedInUser.value)
      .eq('approved', 'false');

    if (error) throw error;

    console.log(requests);
    if (requests) {
      swapRequests.value = requests;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

function viewRequest(event) {
  if (requestVisible.value) {
    requestVisible.value = false;
  } else {
    requestId.value = event.target.value;
    requestVisible.value = true;
  }
}

function toggleVisible() {
  if (requestVisible.value) {
    requestVisible.value = false;
  } else {
    requestVisible.value = true;
  }
}

function updateRequests(swapId) {
  const updatedRequests = swapRequests.value.filter((swap) => {
    if (swap.swap_id !== swapId) {
      return { ...swap };
    }
  });
  swapRequests.value = updatedRequests;
}

onMounted(() => {
  getUser();
  getRequests();
});
</script>

<style scoped>
#requests-list {
  display: flex;
  list-style: none;
  justify-content: center;
  flex-direction: column;
}

#requests-section {
  border: 1px solid black;
  padding: 10px;
  margin: 20px 0;
  text-align: center;
  background-color: #f4f4f4;
}

.request-card {
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
  align-items: center;
}

.request-card > button {
  width: 225px;
}
</style>
