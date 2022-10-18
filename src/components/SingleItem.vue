<template>
  <div v-if="loading">Loading details...</div>
  <h1>{{ itemName }}</h1>
  <h2>{{ itemCategory }}</h2>
  <h3>Condition: {{ itemCondition }}</h3>
  <ItemImage v-if="itemImage" :url="itemImage" />
  <p>Posted by: {{ itemOwner }}</p>
  <p>{{ itemDescription }}</p>

  <button v-show="!messageClicked && itemOwnerId !== loggedInUser" @click="onMessageClick">
    Message {{ itemOwner }}
  </button>

  <button v-show="!swapClicked && itemOwnerId !== loggedInUser" @click="onSwapClick">Start a swap</button>

  <div v-if="swapClicked && id">
    <SwapForm :username="itemOwner" :userId="itemOwnerId" :itemId="id" />
  </div>

  <div v-show="messageClicked && id">
    <MessageForm
      :username="itemOwner"
      :userId="itemOwnerId"
      @onMessageClick="onMessageClick"
    />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';
import ItemImage from './ItemImage.vue';
import MessageForm from './MessageForm.vue';
import SwapForm from './SwapForm.vue';
import {useStore} from '../store'

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
const store = useStore()
const loggedInUser = store.user.id

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
    console.log(itemOwnerId.value)
    console.log(loggedInUser)
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

onMounted(() => {
  getItemById();
});
</script>
