<template>
  <div v-if="userReviews" class="user-reviews-wrapper ">
    <ul class="user-reviews-list">
      <li
        class="user-review-item"
        v-for="review in userReviews"
        :key="review.id"
      >
        <div class="user-review-body">
          <p>{{ review.rating }}<i class="fa-sharp fa-solid fa-star"></i></p>
          <div class="star-rating">
          <!-- <label v-for="rating in ratings"> -->
            <!-- <i class="fa-sharp fa-solid fa-star"></i> -->
          <!-- </label> -->
         </div>
  

        <div class="user">
          <div>
          <img
            :src="review.users.avatar_url"
            alt="reviewer-image"
            style="width: 50px; height: 50px; border-radius: 50%;"
          />
          </div>
          <div class="user-info">
            <h5>{{ review.users.username }}</h5>
            <small>{{ review.created_at }}</small>
          </div>
         </div>
         </div>

      </li>
    </ul>
  </div>

  <div v-if="!userReviews">
    No reviews yet
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
            users!reviews_reviewer_id_fkey (username, avatar_url),
            items!reviews_item_id_fkey (item_preview_url)
            `
          )
          .eq("reviewee_id", user.id);

        if (reviews) {
          console.log("reviews", reviews);
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
      userReviews,
    };
  },
};
</script>

<style scoped>
.user-reviews-list {
  list-style: none;
  padding: 0;
}

.user-review-item {
  /* background: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  overflow: hidden;
  margin: 5em auto;
  padding: 10px; */
  /* display: flex; */
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* .review-image-wrapper {
   margin-right: 5px; 
} */

.user-review-body {
  /* margin-top: 3px;
  margin-bottom: 3px; */
  display: flex;
  flex-direction: column;
}


.user {
  display: flex;
  margin-top: auto;
}

.user-info {
  margin-left: 10px;
}

.user-info h5 {
  margin: 0;
}
</style>
