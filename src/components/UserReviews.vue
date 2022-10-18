<template>
  <div class="user-reviews-wrapper">
    <ul class="user-reviews-list">
      <li
        class="user-review-item"
        v-for="review in userReviews"
        :key="review.id"
      >
      <div class="review-image-wrapper">
        <img 
          :src="review.items.item_preview_url"
          alt="item-image"
          style="width: 200px; height: 200px; border-radius: 50%" 
        />
      </div>
      <div class="user-review-body">
        <p>{{ review.rating }} stars</p>
        <p>{{ review.comments }}</p>
        <p>{{ review.created_at }}</p>
        <p>{{ review.users.username }}</p>
      </div>
 


      </li>
    </ul>
  </div>
</template>

<script>
import { supabase } from "../supabase";
import { onMounted, ref } from "vue";
import { useStore } from "../store";

export default {
  setup() {
    const store = useStore();
    const loading = ref(false);
    const userReviews = ref([]);
    const user = store.user;

    async function getReviewsForUser() {
      try {
        loading.value = true;

        const { data: reviews, error } = await supabase
          .from("reviews")
          .select(
            `
            comments, rating, created_at, 
            users!reviews_reviewer_id_fkey (username),
            items!reviews_item_id_fkey (item_preview_url)
            `
          )
          .eq("reviewee_id", user.id);

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
      userReviews
    };
  },
};
</script>

<style scoped>
.user-reviews-wrapper * {
  color: black;
}

.user-reviews-list {
  list-style: none;
  padding: 0;
}

.user-review-item {
	background: rgba(255, 255, 255, 0.90);
	border-radius: 5px;
	overflow: hidden;
	margin: 5em auto;
  padding: 10px;
  display: flex;
}

.review-image-wrapper {
  margin-right: 5px;
}

.user-review-body > p {
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
