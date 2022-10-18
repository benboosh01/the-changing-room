<template>
  <div>
    <h3>Item Offered:</h3>
    <p v-if="offerData">{{ offerData.items.item_name }}</p>
    <!-- <ItemImage v-if="offerData" :url="offerData.items.item_preview_url" /> -->
    <p v-if="offerData">{{ offerData.items.description }}</p>
    <button @click="approveSwap">Approve Swap</button>
  </div>
</template>
<script>
import { supabase } from '../supabase';
import { onMounted, ref } from 'vue';
import ItemImage from './ItemImage.vue';

export default {
  components: { ItemImage },
  props: ['swapId'],
  emits: ['toggleVisible', 'updateRequests'],
  setup(props, context) {
    const loading = ref(false);
    const swapData = ref();
    const offerData = ref();
    const requestedItem = ref();

    async function getSwapPair() {
      try {
        loading.value = true;
        const { data, error } = await supabase
          .from('trades')
          .select()
          .eq('swap2', props.swapId);

        if (error) throw error;

        if (data) {
          swapData.value = data[0];
        }
      } catch (error) {
        alert(error.message);
      } finally {
        getOfferDetails();
        getRequestedItem();
        loading.value = false;
      }
    }
    async function getOfferDetails() {
      try {
        loading.value = true;
        const { data, error } = await supabase
          .from('swaps')
          .select(
            `item_id, items (owner_id, owner_username, item_name, item_preview_url, description)`
          )
          .eq('swap_id', swapData.value.swap1);

        if (error) throw error;

        if (data) {
          offerData.value = data[0];
        }
      } catch (error) {
        alert(error.message);
      }
    }
    async function getRequestedItem() {
      try {
        loading.value = true;
        const { data, error } = await supabase
          .from('swaps')
          .select(
            `item_id, items (owner_id, owner_username, item_name, item_preview_url), approved`
          )
          .eq('swap_id', swapData.value.swap2);

        if (error) throw error;

        if (data) {
          requestedItem.value = data[0];
        }
      } catch (error) {
        alert(error.message);
      }
    }
    async function approveSwap() {
      try {
        loading.value = true;
        const { data, error } = await supabase
          .from('swaps')
          .update({ approved: 'true' })
          .eq('swap_id', swapData.value.swap2);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        updateTrade();
      }
    }
    async function updateTrade() {
      try {
        loading.value = true;
        const { data, error } = await supabase
          .from('trades')
          .update({ accepted: 'true' })
          .eq('id', swapData.value.id);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        toggleVisible();
        updateRequests();
      }
    }

    function toggleVisible() {
      context.emit('toggleVisible');
    }

    function updateRequests() {
      context.emit('updateRequests', swapData.value.swap2);
      loading.value = false;
    }

    onMounted(() => {
      getSwapPair();
    });

    return {
      offerData,
      requestedItem,
      approveSwap,
    };
  },
};
</script>
