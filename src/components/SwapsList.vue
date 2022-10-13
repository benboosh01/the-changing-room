<template>
  <h1>Swaps List</h1>
  <h2>Items Sent:</h2>
  <ul>
    <li v-for="item in userSent" :key="item.id">
      <h3>{{ item.items.item_name }}</h3>
      <p>Sent to: {{ item.users.username }}</p>
      <!-- <ItemImage v-if="item" :url="item.item_preview_url" /> -->
      <button value="item.users.id" @click="contactUser">
        Contact {{ item.users.username }}
      </button>
      <button value="item.users.id" @click="leaveReview">Leave Review</button>
    </li>
  </ul>
  <h2>Items Recieved:</h2>
  <ul>
    <li v-for="item in userRecieved" :key="item.id">
      <h3>{{ item.items.item_name }}</h3>
      <p>Received from: {{ item.items.owner_username }}</p>
      <!-- <ItemImage v-if="item" :url="item.item_preview_url" /> -->
      <button value="item.items.owner_id" @click="contactUser">
        Contact {{ item.items.owner_username }}
      </button>
      <button value="item.items.owner_id" @click="leaveReview">
        Leave Review
      </button>
    </li>
  </ul>
</template>

<script>
import { supabase } from '../supabase';
import { onMounted, ref } from 'vue';
import { store } from '../store';
import ItemImage from './ItemImage.vue';
import router from '../router';

export default {
  components: { ItemImage },

  setup() {
    const loggedInUser = ref('');
    const loading = ref(false);
    const userSent = ref([]);
    const userRecieved = ref([]);
    const swapUser = ref('');

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

    async function getSent() {
      try {
        loading.value = true;

        const { data: sent, error } = await supabase
          .from('swaps')
          .select(
            `item_id, users (username, id), items!inner(item_name, item_preview_url)`
          )
          .eq('items.owner_id', loggedInUser.value);

        if (error) throw error;
        if (sent) {
          userSent.value = sent;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function getReceived() {
      try {
        loading.value = true;

        const { data: recieved, error } = await supabase
          .from('swaps')
          .select(
            `item_id, items (owner_id, owner_username, item_name, item_preview_url)`
          )
          .eq('user_to', loggedInUser.value);

        console.log(recieved);

        if (error) throw error;
        if (recieved) {
          userRecieved.value = recieved;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    function leaveReview(event) {
      swapUser.value = event.target.value;
      router.push({ path: '/review', params: { user_id: swapUser } });
    }

    function contactUser(event) {
      swapUser.value = event.target.value;
      router.push({ path: '/contact', params: { user_id: swapUser } });
    }

    onMounted(() => {
      getUser();
      getSent();
      getReceived();
    });

    return {
      loggedInUser,
      userSent,
      userRecieved,
      swapUser,
      getUser,
      getSent,
      getReceived,
      leaveReview,
      contactUser,
    };
  },
};
</script>
