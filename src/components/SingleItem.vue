<template>
  <div class="single-item-wrapper">
    <ItemImage v-if="itemImage" :url="itemImage" />
    <div class="item-details">
      <div v-if="loading">Loading details...</div>
      <h2>{{ itemName }}</h2>
      <p>Category: {{ itemCategory }}</p>
      <p>Condition: {{ itemCondition }}</p>
      <p>Posted by: {{ itemOwner }}</p>
      <div class="description-p">
        <p style="margin: 10px">{{ itemDescription }}</p>
      </div>

      <button
        v-show="
          !messageClicked && itemOwnerId !== loggedInUser && store.user.id
        "
        @click="onMessageClick"
        class="item-btn"
      >
        Message {{ itemOwner }}
      </button>
      <div v-show="messageClicked && id">
        <MessageForm
          :username="itemOwner"
          :userId="itemOwnerId"
          @onMessageClick="onMessageClick"
        />
      </div>
      <button
        v-show="!swapClicked && itemOwnerId !== loggedInUser && store.user.id"
        @click="onSwapClick"
        :disabled="swapApproved"
        class="item-btn"
      >
        {{ swapApproved ? 'Pending swap' : 'Start a swap' }}
      </button>

      <div v-if="swapClicked && id">
        <SwapForm
          :username="itemOwner"
          :userId="itemOwnerId"
          :itemId="id"
          :acceptDonation="acceptDonation"
          :donationAmount="donationAmount"
        />
      </div>
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
const acceptDonation = ref(false);
const donationAmount = ref('');

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
    acceptDonation.value = data[0].accept_donation;
    donationAmount.value = data[0].donation_amount;

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
.single-item-wrapper {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  padding: 20px 0;
}

.item-details {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 5px;
}

.item-btn {
  display: flex;
  justify-content: center;
  width: 225px;
}
.description-p {
  border: 1px solid black;
  width: 260px;
  height: 125px;
  display: flex;
  align-content: center;
  align-items: center;
  margin: 10px 0;
}
.description-p > p {
  width: 100%;
  text-align: center;
}
</style>
