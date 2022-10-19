<template>
  <div v-if="userReviews" class="user-reviews-wrapper ">
    <ul class="user-reviews-list">
      <li
        class="user-review-item"
        v-for="review in userReviews"
        :key="review.id"
      >
        <div class="user-review-body">
          <p>Rating: {{ review.rating }}
            <i class="fa-sharp fa-solid fa-star" style="color: #fec42d">
            </i></p>
          <p class="comments">"{{ review.comments }}"</p>
       
        <div class="user">
          <div>
            <UserImage :url="review.users.avatar_url" />
          </div>
          <div class="user-info">
            <h5>{{ review.users.username }}</h5>
            <small>{{ new Date(review.created_at).toLocaleString() }}</small>
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
import UserImage from "./UserImage.vue";

export default {
  setup() {
    const store = useStore();
    const loading = ref(false);
    const userReviews = ref([]);
    const reviewDate = ref();
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
      reviewDate
    };
  },
  components: { UserImage }
};
</script>

<style scoped>
.user-reviews-list {
  list-style: none;
  padding: 0;
}

.user-review-item {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  overflow: hidden;
}

.user-review-body {
  display: flex;
  flex-direction: column;
}

.comments {
  font-size: 20px;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 8px;
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
