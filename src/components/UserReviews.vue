<template>
  <h1>Reviews for Specific User</h1>
  <ul>
    <li v-for="review in userReviews" :key="review.id">
      <!-- <p>{{ review.comments }}</p> -->
      <!-- <p>{{ review.rating }}</p> -->
    </li>
  </ul>
</template>

<script>
import { supabase } from "../supabase";
import { onMounted, ref } from "vue";
import { store } from "../store";

export default {
  setup() {
    const loading = ref(false);
    const userId = ref("");
    const userReviews = ref([]);

    async function getUser() {
      try {
        loading.value = true;
        // hardcoded atm as login not complete
        userId.value = '81c92b70-566e-420f-91ea-1d45edb247ec';
        // userId.value = store.user.id;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function getReviewsForUser() {
      try {
        loading.value = true;

        const { data: reviews, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("reviewee_id", userId.value);

        if (reviews) {
          userReviews.value = reviews;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    onMounted(() => {
      getUser();
      getReviewsForUser();
    });

    return {
      loading,
      userId,
      userReviews,
    };
  },
};
</script>
