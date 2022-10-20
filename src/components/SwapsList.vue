<template>
  <div class="swaps-list-wrapper">
    <h2>Swaps Approved:</h2>
    <ul class="swaps-list">
      <li
        v-for="item in userSent"
        :key="item.items.id"
        :value="item.item_id"
        class="approved-swap-card"
      >
        <h3>{{ item.items.item_name }}</h3>
        <p>Sending to: {{ item.users.username }}</p>
        <ItemImage v-if="item" :url="item.items.item_preview_url" />
        <button :value="item.item_id" @click="contactUser">
          Contact {{ item.users.username }}
        </button>
        <button
          :value="item.item_id"
          @click="leaveReview"
          v-if="checkReviews(loggedInUser, item.item_id)"
        >
          Leave Review
        </button>
        <ReviewForm
          v-if="reviewVisible && item.item_id === itemId"
          :username="item.users.username"
          :itemId="itemId"
          @toggleVisible="toggleVisible"
          @updateReviews="updateReviews"
        />
        <MessageForm
          v-if="messageVisible && item.item_id === itemId"
          :username="item.users.username"
          :userId="item.users.id"
          @toggleVisible="toggleVisible"
        />
      </li>
    </ul>
    <ul class="swaps-list">
      <li
        v-for="item in userRecieved"
        :key="item.id"
        class="approved-swap-card"
      >
        <h3>{{ item.items.item_name }}</h3>
        <p>Recieving from: {{ item.items.owner_username }}</p>
        <ItemImage v-if="item" :url="item.items.item_preview_url" />
        <button @click="contactUser" :value="item.item_id">
          Contact {{ item.items.owner_username }}
        </button>
        <button
          :value="item.item_id"
          @click="leaveReview"
          v-if="checkReviews(loggedInUser, item.item_id)"
        >
          Leave Review
        </button>
        <ReviewForm
          v-if="reviewVisible && item.item_id === itemId"
          :username="item.items.owner_username"
          :itemId="itemId"
          @toggleVisible="toggleVisible"
          @updateReviews="updateReviews"
        />
        <MessageForm
          v-if="messageVisible && item.item_id === itemId"
          :username="item.items.owner_username"
          :userId="item.items.owner_id"
          @toggleVisible="toggleVisible"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { supabase } from '../supabase';
import { onMounted, ref } from 'vue';
import { useStore } from '../store';
import ItemImage from './ItemImage.vue';
import ReviewForm from './ReviewForm.vue';
import MessageForm from './MessageForm.vue';

export default {
  name: 'SwapsList',
  components: { ItemImage, ReviewForm, MessageForm },

  setup() {
    const store = useStore();
    const loggedInUser = ref('');
    const loading = ref(false);
    const userSent = ref([]);
    const userRecieved = ref([]);
    const swapUser = ref('');
    const itemId = ref('');
    const reviewsList = ref([]);
    const disabled = ref(false);
    const reviewVisible = ref(false);
    const messageVisible = ref(false);

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
          .eq('items.owner_id', loggedInUser.value)
          .eq('approved', 'true');

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
          .eq('user_to', loggedInUser.value)
          .eq('approved', 'true');

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

    async function getReviews() {
      try {
        loading.value = true;

        const { data: reviews, error } = await supabase
          .from('reviews')
          .select();

        if (error) throw error;

        if (reviews) {
          reviewsList.value = reviews;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    function leaveReview(event) {
      itemId.value = event.target.value;
      reviewVisible.value = true;
    }

    function contactUser(event) {
      itemId.value = event.target.value;
      messageVisible.value = true;
    }

    function toggleVisible() {
      reviewVisible.value = false;
      messageVisible.value = false;
    }

    function checkReviews(userId, itemId) {
      let show = true;
      reviewsList.value.forEach((review) => {
        if (userId === review.reviewer_id && itemId === review.item_id) {
          show = false;
        }
      });
      return show;
    }

    function updateReviews(data) {
      reviewsList.value.push(data);
    }

    onMounted(() => {
      getUser();
      getSent();
      getReceived();
      getReviews();
    });

    return {
      loggedInUser,
      userSent,
      userRecieved,
      swapUser,
      messageVisible,
      reviewVisible,
      itemId,
      reviewsList,
      disabled,
      leaveReview,
      contactUser,
      checkReviews,
      toggleVisible,
      updateReviews,
    };
  },
};
</script>

<style scoped>
.swaps-list-wrapper {
  border: 1px solid black;
  padding: 10px;
  margin: 20px 0;
  text-align: center;
  background-color: #f4f4f4;
}

.swaps-list {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
}

.approved-swap-card {
  text-align: center;
  border: 1px solid black;
  margin: 10px 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-wrap: wrap;
  background-color: white;
}
</style>
