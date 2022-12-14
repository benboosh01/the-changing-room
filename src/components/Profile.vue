<template>
  <Modal v-show="showModal" @close-modal="showModal = false">
    <template v-slot:modal-body>
      <UserReviews />
    </template>
  </Modal>

  <div class="update-profile-box" v-if="clicked">
    <h2 class="update-profile-title">Update profile details</h2>
    <form @submit.prevent="onSubmit" class="update-profile-form">
      <label htmlFor="name">username</label>
      <input id="username" v-model="username" required />
      <label htmlFor="location">location</label>
      <input v-model="location" required />
      <label htmlFor="avatar">profile picture</label>
      <input
        id="avatar"
        type="file"
        v-on:change="setFiles"
        placeholder="Upload image file"
      />
      <br />
      <button class="primary submit">Submit</button>
    </form>
    <button class="primary submit" @click="onClick">Cancel</button>
  </div>

  <div class="profile-card">
    <div class="profile-info">
      <p class="user-name">{{ username }}</p>

      <p>
        Rating: {{ profileUserRating
        }}<i class="fa-sharp fa-solid fa-star" style="color: #fec42d"></i>
      </p>

      <p class="user-location">
        <i class="fa-sharp fa-solid fa-location-dot"></i>
        {{ location }}
      </p>

      <button @click="showModal = true" class="primary profile-btns">
        See all your reviews
      </button>

      <button @click="onClick" v-if="!clicked" class="primary profile-btns">
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
import { supabase } from '../supabase';
import { useStore } from '../store';
import { ref, onMounted } from 'vue';
import Modal from './Modal.vue';
import UserReviews from './UserReviews.vue';
import { getUserRatings } from '../utils/utilFuncs';

const store = useStore();
const loading = ref(true);
const userId = ref('');
const username = ref('');
const location = ref('');
const avatar_url = ref('');
const avatarFile = ref('');
const image = ref('');
const clicked = ref(false);
const userRatings = ref([]);
const profileUserRating = ref('');

function setFiles(event) {
  avatarFile.value = event.target.files[0];
}

function onClick() {
  if (clicked.value) {
    clicked.value = false;
  } else {
    clicked.value = true;
  }
}

async function onSubmit() {
  try {
    loading.value = true;

    if (avatarFile.value) {
      const { data, error1 } = await supabase.storage
        .from('avatars')
        .remove([avatar_url.value]);

      avatar_url.value = avatar_url.value + new Date().getTime();

      const { image, error2 } = await supabase.storage
        .from('avatars')
        .upload(avatar_url.value, avatarFile.value, { upsert: true });
    }

    const updatedDetails = {
      username: username.value,
      avatar_url: avatar_url.value,
      location: location.value,
    };

    const { error } = await supabase
      .from('users')
      .update(updatedDetails)
      .eq('id', userId.value);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    getProfile();
    loading.value = false;
    alert('details updated');
  }
}

async function getUser() {
  try {
    loading.value = true;

    if (!store.user.id) throw error;
    userId.value = store.user.id;
  } catch (error) {
    alert('Please log in or register');
  } finally {
    loading.value = false;
  }
}

async function getProfile() {
  try {
    loading.value = true;
    let user = await supabase
      .from('users')
      .select(`username, location, avatar_url`)
      .eq('id', userId.value)
      .single();
    if (user.error && user.status !== 406) throw error;
    if (user.data) {
      username.value = user.data.username;
      location.value = user.data.location;
      avatar_url.value = user.data.avatar_url;
    }
    const { data, error } = await supabase.storage
      .from('avatars')
      .getPublicUrl(avatar_url.value);
    image.value = data.publicURL;
  } catch (error) {
    alert('Please log in or register');
  } finally {
    loading.value = false;
  }
}

async function getUserReviewScore() {
  try {
    getUserRatings().then((data, error) => {
      userRatings.value = data.filter((user) => {
        return user.id === userId.value;
      });

      profileUserRating.value = userRatings.value[0].ave_review_score;
      profileUserRating.value = Math.round(profileUserRating.value * 10) / 10;

      if (error) throw error;
    });
  } catch (error) {
    alert(error.message);
  }
}

onMounted(() => {
  getUser();
  getProfile();
  getUserReviewScore();
});
</script>

<script>
export default {
  components: { Modal },
  data() {
    return {
      showModal: false,
    };
  },
};
</script>

<style scoped>
.profile-card {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
}

.profile-info {
  width: 50%;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.profile-image-wrapper {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  border: 3px solid #f7797d;
  padding: 5px;
}

i {
  margin: 5px;
}

.update-profile-box {
  padding: 40px;
  background-color: #e9f1f7;
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}

.update-profile-title {
  margin: 0 0 30px;
  padding: 0;
  text-align: center;
}

.update-profile-form > #username,
.update-profile-form > #location,
.update-profile-form > #avatar {
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
  transition: 0.5s;
}

.update-profile-box #username:focus ~ label,
.update-profile-box #username:valid ~ label,
.update-profile-box #location:focus ~ label,
.update-profile-box #location:focus ~ label {
  top: -20px;
  left: 0;
  color: red;
  font-size: 12px;
}

.submit {
  width: 100%;
}

.profile-btns {
  width: 225px;
  background-color: white;
}
</style>
