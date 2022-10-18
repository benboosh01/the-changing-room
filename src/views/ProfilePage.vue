<template>
  <Profile />
  <button @click="toggleItems">Items</button>
  <button @click="toggleSwaps">Swaps Approved</button>
  <button @click="toggleMessages">Messages</button>
  <button @click="toggleRequests">Swap Requests</button>
  <SwapRequestList v-if="requestsVisible" />
  <UserItems v-if="itemsVisible" />
  <SwapsList v-if="swapsVisible" />
  <MessageInbox v-if="messagesVisible" />
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
