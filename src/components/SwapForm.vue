<template>
  <main v-show="!submitted">
    <h3>
      Ready to swap with {{ username }}? Complete the from below to submit your
      swap request
    </h3>
    <p>Hi {{ username }}, I'd like your item. Here's what I can swap:</p>
    <label htmlFor="swapForm">Choose which item you want to offer</label>
    <select name="swapForm" v-model="selectedItem">
      <option v-for="item in userItems">{{ item.item_name }}</option>
    </select>
    <button @click="createNewSwap(selectedItem)">Request swap</button>
  </main>

  <p v-show="submitted">
    Success! {{ username }} will now review your request and approve it if
    they're happy to go ahead
  </p>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useStore } from '../store';
import { supabase } from '../supabase';

export default {
  name: 'SwapForm',
  props: ['username', 'userId', 'itemId', 'itemName'],
  setup(props) {
    const store = useStore();
    const loggedInUser = store.user.id;
    const recipientUser = props.userId;
    const requestedItemId = props.itemId;
    const userItems = ref([]);
    const loading = ref(false);
    const selectedItemId = ref('');
    const submitted = ref(false);
    const swapOneData = ref([]);
    const swapTwoData = ref([]);

    async function getUserItems() {
      try {
        loading.value = true;

        const { data, error } = await supabase
          .from('items')
          .select('item_name, id')
          .eq('owner_id', loggedInUser);

        if (data) {
          userItems.value = data;
        }
        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function createNewSwap(selectedItem) {
      loading.value = true;

      const selectedItemInfo = userItems.value.filter((item) => {
        return item.item_name === selectedItem;
      });
      selectedItemId.value = selectedItemInfo[0].id;
      const swapOne = {
        user_to: recipientUser,
        item_id: selectedItemId.value,
        approved: true,
      };
      const swapTwo = {
        user_to: loggedInUser,
        item_id: requestedItemId,
      };

      try {
        const { data, error } = await supabase
          .from('swaps')
          .insert(swapOne)
          .select();

        if (error) throw error;

        if (data) {
          swapOneData.value = data;
        }
      } catch (error) {
        alert(error.message);
      }

      try {
        const { data, error } = await supabase
          .from('swaps')
          .insert(swapTwo)
          .select();

        if (error) throw error;

        if (data) {
          swapTwoData.value = data;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        createSwapPair();
      }
      // try {
      //   const { error } = await supabase.from('swaps').insert(swapOne);
      //   const { error2 } = await supabase.from('swaps').insert(swapTwo);
      //   if (error || error2) throw error;
      // } catch (error) {
      //   alert(error.message);
      // } finally {
      //   loading.value = false;
      //   submitted.value = true;
      // }
    }
    async function createSwapPair() {
      try {
        loading.value = true;

        const swapPair = {
          swap1: swapOneData.value[0].swap_id,
          swap2: swapTwoData.value[0].swap_id,
        };

        const { data, error } = await supabase.from('trades').insert(swapPair);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
        submitted.value = true;
      }
    }

    onMounted(() => {
      getUserItems();
    });
    return {
      recipientUser,
      loggedInUser,
      getUserItems,
      userItems,
      requestedItemId,
      createNewSwap,
      selectedItemId,
      submitted,
    };
  },
};
</script>
