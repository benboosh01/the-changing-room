<template>
  <div class="item-title">
    <div v-if="loading">Loading details...</div>
    <h1>{{ itemName }}</h1>
    <h2>{{ itemCategory }}</h2>
  </div>
  <div class="item-view">
    <ItemImage v-if="itemImage" :url="itemImage" />
    <div class="item-details">
      <p>Condition: {{ itemCondition }}</p>
      <p>Posted by: {{ itemOwner }}</p>
    </div>
    <p style="margin: 10px">{{ itemDescription }}</p>
  </div>
  <div class="item-buttons">
    <button
      v-show="!messageClicked && itemOwnerId !== loggedInUser"
      @click="onMessageClick"
    >
      Message {{ itemOwner }}
    </button>

    <button
      v-show="!swapClicked && itemOwnerId !== loggedInUser"
      @click="onSwapClick"
      :disabled="swapApproved"
    >
      {{ swapApproved ? 'Pending swap' : 'Start a swap' }}
    </button>
    <div v-show="messageClicked && id">
      <MessageForm
        :username="itemOwner"
        :userId="itemOwnerId"
        @onMessageClick="onMessageClick"
      />
    </div>
    <div v-if="swapClicked && id">
      <SwapForm :username="itemOwner" :userId="itemOwnerId" :itemId="id" />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';
import ItemImage from './ItemImage.vue';
import MessageForm from './MessageForm.vue';
import SwapForm from './SwapForm.vue';
import { useStore } from '../store';

const route = useRoute();
const id = route.params.id;
const loading = ref(true);
const itemName = ref('');
const itemDescription = ref('');
const itemCondition = ref('');
const itemCategory = ref('');
const itemOwnerId = ref('');
const itemOwner = ref('');
const itemImage = ref('');
const messageClicked = ref(false);
const swapClicked = ref(false);
const store = useStore();
const loggedInUser = store.user.id;
const swapApproved = ref(false);

async function getItemById() {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*, categories (category_name)')
      .eq('id', id);

    itemName.value = data[0].item_name;
    itemDescription.value = data[0].description;
    itemCondition.value = data[0].condition;
    itemCategory.value = data[0].categories.category_name;
    itemOwner.value = data[0].owner_username;
    itemOwnerId.value = data[0].owner_id;
    itemImage.value = data[0].item_preview_url;

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
    console.log(itemOwnerId.value);
    console.log(loggedInUser);
  }
}
function onMessageClick() {
  if (messageClicked.value) {
    messageClicked.value = false;
  } else {
    messageClicked.value = true;
  }
}
function onSwapClick() {
  if (swapClicked.value) {
    swapClicked.value = false;
  } else {
    swapClicked.value = true;
  }
}

async function getApprovedSwaps() {
  try {
    loading.value = true;
    const { data, error } = await supabase
      .from('swaps')
      .select()
      .eq('item_id', id)
      .eq('approved', 'true');

    if (error) throw error;

    if (data) {
      console.log(data);
      if (data.length > 0) {
        swapApproved.value = true;
      }
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getItemById();
  getApprovedSwaps();
});
</script>

<style scoped>
.item-details {
  margin-top: 5px;
}
.item-details * {
  font-size: 12px;
  display: inline;
  margin: 10px;
  padding: 5px;
  border-radius: 30px;
  color: whitesmoke;
  background-color: rgb(82, 82, 82);
}
.item-view {
  width: 40%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  border-radius: 10px;
}

.item-buttons {
  display: flex;
  justify-content: center;
  margin-top: 1em;
}

.item-buttons * {
  margin: 1em;
}

.item-title {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-title h1 {
  text-decoration: underline;
}
</style>
