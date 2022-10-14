<template>
  <h1>Review</h1>
  <form @submit.prevent="submitReview">
    <div>
      <label for="reviewee-user">Username:</label>
      <input id="reviewee-user" type="input" v-model="username" disabled />
    </div>
    <select v-model="reviewScore" required>
      <option disabled value="">Select review score</option>
      <option value="1">*</option>
      <option value="2">**</option>
      <option value="3">***</option>
      <option value="4">****</option>
      <option value="5">*****</option>
    </select>
    <label for="comments">Comments</label>
    <input v-model="reviewComment" placeholder="Enter review comments" />
    <input
      type="submit"
      class="button block primary"
      :value="disable ? 'Review Submitted' : 'Submit Review'"
      :disabled="disable"
    />
  </form>
</template>

<script>
import { supabase } from '../supabase';
import { ref } from 'vue';
import { store } from '../store';

export default {
  name: 'ReviewForm',
  props: ['username', 'itemId'],
  emits: ['toggleVisible', 'updateReviews'],
  setup(props, context) {
    const loading = ref(false);
    const revieweeUsername = ref('');
    const revieweeId = ref('');
    const reviewScore = ref('');
    const reviewComment = ref('');
    const loggedInUser = store.user.id;
    const disable = ref(false);

    async function submitReview() {
      try {
        loading.value = true;
        const data = {
          reviewer_id: loggedInUser,
          comments: reviewComment.value,
          rating: reviewScore.value,
          item_id: props.itemId,
          reviewee_id: loggedInUser,
        };
        updateReviews(data);
        const { error } = await supabase.from('reviews').insert(data);
        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
        disable.value = true;
        toggleVisible();
      }
    }

    function toggleVisible() {
      context.emit('toggleVisible');
    }

    function updateReviews(data) {
      context.emit('updateReviews', data);
    }

    return {
      loading,
      revieweeUsername,
      revieweeId,
      reviewScore,
      reviewComment,
      loggedInUser,
      disable,
      submitReview,
    };
  },
};
</script>
