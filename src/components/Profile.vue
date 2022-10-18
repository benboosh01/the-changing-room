<template>
  <Modal v-show="showModal" @close-modal="showModal = false">
     <UserReviews />
  </Modal>

  <div class="update-profile-box" @click="onClick()" v-show="clicked" >
    <h2 class="update-profile-title">Update profile details</h2>
  <form @submit.prevent="onSubmit" class="update-profile-form">
    <label htmlFor="name">username</label>
    <input id="username" v-model="username" required/>
    <label htmlFor="location">location</label>
    <input v-model="location" required/>
    <label htmlFor="avatar">profile picture</label>
    <input
      id="avatar"
      type="file"
      v-on:change="setFiles"
      placeholder="Upload image file"
      required
      />
    <br />
    <button class="primary submit">Submit</button>
  </form>
  </div>  

  <div class="profile-card">
    <div class="profile-info">
      <p class="user-name">{{ username }}</p>
      <p>Rating:{{profileUserRating}}</p>
      <p class="user-location">
        <i class="fa-sharp fa-solid fa-location-dot"></i>
        {{ location }}
      </p>

      <button
        @click="(showModal = true)"
        class="primary"
      >
        See all your reviews
      </button>


      <button @click="onClick()" v-show="!clicked" class="primary">
        Update profile details
      </button>
    </div>
    <div class="profile-image-wrapper">
      <img
        :src="image"
        alt="profile-image"
        class="profile-image"
        style="width: 200px; height: 200px; border-radius: 50%"
      />
    </div>
  </div>
</template>

<script setup>
import { supabase } from "../supabase";
import { useStore } from "../store";
import { ref, onMounted } from "vue";
import Modal from "./Modal.vue";
import UserReviews from "./UserReviews.vue";
import {getUserRatings} from '../utils/utilFuncs'

const store = useStore();
const loading = ref(true);
const userId = ref("");
const username = ref("");
const location = ref("");
const avatar_url = ref("");
const avatarFile = ref("");
const image = ref("");
const clicked = ref(false)
const userRatings = ref([])
const profileUserRating = ref('')

function setFiles(event) {
  avatarFile.value = event.target.files[0];
}

function onClick() {
  clicked.value = true;
}

async function onSubmit() {
  try {
    loading.value = true;

    if (avatarFile.value) {
      const { data, error1 } = await supabase.storage
        .from("avatars")
        .remove([avatar_url.value]);

      avatar_url.value = avatar_url.value + new Date().getTime();

      const { image, error2 } = await supabase.storage
        .from("avatars")
        .upload(avatar_url.value, avatarFile.value, { upsert: true });
    }

    const updatedDetails = {
      username: username.value,
      avatar_url: avatar_url.value,
      location: location.value,
    };

    const { error } = await supabase
      .from("users")
      .update(updatedDetails)
      .eq("id", userId.value);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    getProfile();
    loading.value = false;
    alert("details updated");
  }
}

async function getUser() {
  try {
    loading.value = true;

    if (!store.user.id) throw error;
    userId.value = store.user.id;
  } catch (error) {
    alert("Please log in or register");
  } finally {
    loading.value = false;
  }
}

async function getProfile() {
  try {
    loading.value = true;
    let user = await supabase
      .from("users")
      .select(`username, location, avatar_url`)
      .eq("id", userId.value)
      .single();
    if (user.error && user.status !== 406) throw error;
    if (user.data) {
      username.value = user.data.username;
      location.value = user.data.location;
      avatar_url.value = user.data.avatar_url;
    }
    const { data, error } = await supabase.storage
      .from("avatars")
      .getPublicUrl(avatar_url.value);
    image.value = data.publicURL;
  } catch (error) {
    alert("Please log in or register");
  } finally {
    loading.value = false;
  }
}

async function getUserReviewScore() {
  try {
    getUserRatings().then((data, error)=> {
      userRatings.value = data.filter((user) => {
        return user.id === userId.value 
    })
    console.log(userRatings.value)
      profileUserRating.value = userRatings.value[0].ave_review_score
      if (error) throw error;
   })
   
   
  } catch (error) {
    alert(error.message)
  }
}

onMounted(() => {
  getUser();
  getProfile();
  getUserReviewScore()
});
</script>

<script>
export default {
  components: { Modal },
  data() {
    return {
      showModal: false
    };
  },
};
</script>

<style scoped>
.profile-card {
  border: 1px solid black;
  padding: 10px;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-evenly;
}

.user-name {
  font-size: 30px;
  margin: 5px;
}

.user-location {
  margin-top: 0;
  margin-bottom: 10px;
}

.profile-image {
  border: 2px solid #03bfcb;
  padding: 5px;
}

i {
  margin: 5px;
}

.update-profile-box {
  padding: 40px;
  background-color: #E9F1F7;
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0,.6);
  border-radius: 10px;
}

.update-profile-title {
  margin: 0 0 30px;
  padding: 0;
  text-align: center;
}

.update-profile-form > #username,
.update-profile-form > #location,
.update-profile-form > #avatar
 {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.update-profile-form > label {
  font-size: 16px;
  pointer-events: none;
  transition: .5s;
}

.update-profile-box #username:focus ~ label,
.update-profile-box #username:valid ~ label,
.update-profile-box #location:focus ~ label,
.update-profile-box #location:focus ~ label
  {
  top: -20px;
  left: 0;
  color: red;
  font-size: 12px;
}

.submit {
  width: 100%;
}
</style>
