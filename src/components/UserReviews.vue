<template>
  <h1>Reviews for Specific User</h1>
  <ul>
    <li v-for="review in userReviews" :key="review.id">
      <p>{{ review.comments }}</p>
      <p>{{ review.rating }}</p>
    </li>
  </ul>
</template>

<script>
import { supabase } from "../supabase";
import { onMounted, ref } from "vue";

export default {
  setup() {
    const loading = ref(false);
    const userId = ref("");
    const userReviews = ref([]);

    async function getReviewsForUser() {
      try {
        loading.value = true;
        // todo - user id is hardcoded for now until login is complete
        userId.value = "c205d247-4a22-46ad-8458-45d6d1964d0e";

        const { data: reviews, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("user_id", userId.value);

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
