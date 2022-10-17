<template></template>
<script>
import { supabase } from '../supabase';
import { onMounted, ref } from 'vue';

export default {
  props: ['swapId'],

  setup(props) {
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
        console.log(swapData.value);
        getOfferDetails();
        getRequestedItem();
        loading.value = false;
      }
    }
    async function getOfferDetails() {
      try {
        const { data, error } = await supabase
          .from('swaps')
          .select(
            `item_id, items (owner_id, owner_username, item_name, item_preview_url)`
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
        const { data, error } = await supabase
          .from('swaps')
          .select(
            `item_id, items (owner_id, owner_username, item_name, item_preview_url)`
          )
          .eq('swap_id', swapData.value.swap2);

        if (error) throw error;

        if (data) {
          requestedItem.value = data[0];
        }
      } catch (error) {
        alert(error.message);
      } finally {
        console.log(offerData.value);
        console.log(requestedItem.value);
      }
    }
    onMounted(() => {
      getSwapPair();
    });
  },
};
</script>
