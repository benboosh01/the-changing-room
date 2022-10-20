<template>
  <div class="container">
  <Profile />
  <div class="flex flex-center button-group">
    <button @click="toggleItems" class="primary">Items</button>
    <button @click="toggleMessages" class="primary">Messages</button>
    <button @click="toggleRequests" class="primary">Swap Requests</button>
    <button @click="toggleSwaps" class="primary">Swaps Approved</button>
  </div>
  <SwapRequestList v-if="requestsVisible" />
  <UserItems v-if="itemsVisible" />
  <SwapsList v-if="swapsVisible" />
  <MessageInbox v-if="messagesVisible" />

</div>
</template>

<script setup>
import Profile from '../components/Profile.vue';
import SwapsList from '../components/SwapsList.vue';
import UserItems from '../components/UserItems.vue';
import MessageInbox from '../components/MessageInbox.vue';
import { ref } from 'vue';
import SwapRequestList from '../components/SwapRequestList.vue';

const itemsVisible = ref(false);
const swapsVisible = ref(false);
const messagesVisible = ref(false);
const requestsVisible = ref(false);

function toggleItems() {
  if (itemsVisible.value) {
    itemsVisible.value = false;
  } else {
    itemsVisible.value = true;
    swapsVisible.value = false;
    messagesVisible.value = false;
    requestsVisible.value = false;
  }
}

function toggleSwaps() {
  if (swapsVisible.value) {
    swapsVisible.value = false;
  } else {
    swapsVisible.value = true;
    itemsVisible.value = false;
    messagesVisible.value = false;
    requestsVisible.value = false;
  }
}

function toggleMessages() {
  if (messagesVisible.value) {
    messagesVisible.value = false;
  } else {
    messagesVisible.value = true;
    itemsVisible.value = false;
    swapsVisible.value = false;
    requestsVisible.value = false;
  }
}

function toggleRequests() {
  if (requestsVisible.value) {
    requestsVisible.value = false;
  } else {
    requestsVisible.value = true;
    messagesVisible.value = false;
    itemsVisible.value = false;
    swapsVisible.value = false;
  }
}
</script>

<style scoped>
.button-group {
  margin-top: 30px;
}
</style>
