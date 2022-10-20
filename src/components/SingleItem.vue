<template>
  <div class="single-item-wrapper">
    <ItemImage v-if="itemImage" :url="itemImage" />
    <div class="item-details">
      <div v-if="loading">Loading details...</div>
      
      <h1>{{ itemName }}</h1>

      <p><span>Category: </span>{{ itemCategory }}</p>
      <p><span>Condition: </span>{{ itemCondition }}</p>
      <p><span>Posted by: </span>{{ itemOwner }}</p>
      
      <div class="description-p">
        <p style="margin: 10px"><span>Description: </span> {{ itemDescription }}</p>
      </div>

      <button
        v-show="
          !messageClicked && itemOwnerId !== loggedInUser && store.user.id
        "
        @click="onMessageClick"
        class="item-btn primary"
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
        class="item-btn primary"
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
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #f4f4f4;
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0, 0.5);
  border-radius: 10px;
}

.item-details {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 5px;
}

.item-details > p {
   color: #b78681;
}

.item-btn {
  display: flex;
  justify-content: center;
  width: 225px;
}
.description-p {
  width: 260px;
  height: 125px;
  display: flex;
  align-content: center;
  align-items: center;
}
.description-p > p {
  width: 100%;
  text-align: center;
  color: #b78681;
  font-weight: 600;
  height: auto;
}

</style>
