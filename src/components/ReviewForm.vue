<template>
  <div class="review-form-box">
    <h2 class="review-form-title">Review</h2>
    <form @submit.prevent="submitReview">
      <div>
        <!-- <label for="reviewee-user">Username:</label> -->
        <input id="reviewee-user" type="input" v-model="username" disabled />
      </div>
      <select class="dropdown" v-model="reviewScore" required>
        <option disabled value="">Select review rating</option>
        <option value="1">1 star</option>
        <option value="2">2 stars</option>
        <option value="3">3 stars</option>
        <option value="4">4 stars</option>
        <option value="5">5 stars</option>
      </select>
      <br />

      <textarea
        type="text"
        class="comment-box"
        v-model="reviewComment"
        placeholder="Enter review comments"
        required
      />

      <input
        type="submit"
        class="button block primary"
        :value="disable ? 'Review Submitted' : 'Submit Review'"
        :disabled="disable"
      />
    </form>
  </div>
</template>

<script>
import { supabase } from "../supabase";
import { ref } from "vue";
import { useStore } from "../store";

export default {
  name: "ReviewForm",
  props: ["username", "itemId", "revieweeId"],
  emits: ["toggleVisible", "updateReviews"],
  setup(props, context) {
    const store = useStore();
    const loading = ref(false);
    const revieweeUsername = ref("");
    const revieweeId = ref("");
    const reviewScore = ref("");
    const reviewComment = ref("");
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
          reviewee_id: props.revieweeId,
        };
        updateReviews(data);
        const { error } = await supabase.from("reviews").insert(data);
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
      context.emit("toggleVisible");
    }

    function updateReviews(data) {
      context.emit("updateReviews", data);
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

<style scoped>
.dropdown {
  padding: 6px 20px;
  width: 100%;
  margin: 8px 0;
  border: 1px solid #f4f4f4;
  text-align: center;
  margin-bottom: 15px;
  border-radius: 10px;
}

.review-form-box {
  margin-top: 20px;
  padding: 40px;
  background-color: #e9f1f7;
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  width: 100vh;
}

.comment-box {
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 15px;
  width: 100%;
  height: 150px;
  resize: none;
  border: 1px solid #f4f4f4;
}

.review-form-title {
  padding: 0;
  text-align: center;
}

input[type="text"] {
  padding: 6px 20px;
  width: 100%;
  margin: 8px 0;
  border: 1px solid #f4f4f4;
  text-align: center;
}
input[type="submit"] {
  display: flex;
  justify-content: center;
  margin: auto;
}
</style>
