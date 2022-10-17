<template>
  <Modal v-show="showModal" @close-modal="showModal = false">
    <UserReviews />
  </Modal>
  <div class="profile-card">
    <div class="profile-info">
      <p class="user-name">{{ username }}</p>
      <p class="user-location">{{ location }}</p>

      <button class="primary" @click="showModal = true">
        See all your reviews
      </button>

      <button class="primary" @click="onClick()" v-show="!clicked">
        Update details
      </button>
      <form v-show="clicked" @submit.prevent="onSubmit">
        <label htmlFor="name">Name</label>
        <input v-model="username" />
        <label htmlFor="location">Location</label>
        <input v-model="location" />
        <label htmlFor="avatar">Profile picture</label>
        <input type="file" v-on:change="setFiles" />
        <br />
        <button>Submit</button>
      </form>
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

const store = useStore();
const loading = ref(true);
const userId = ref("");
const username = ref("");
const location = ref("");
const avatar_url = ref("");
const avatarFile = ref("");
const image = ref("");
let clicked = ref(false);

function setFiles(event) {
  avatarFile.value = event.target.files[0];
}

function onClick() {
  clicked.value = true;
}

async function onSubmit() {
  try {
    loading.value = true;
    console.log(avatar_url.value);

    const { data, error1 } = await supabase.storage
      .from("avatars")
      .remove([avatar_url.value]);

    avatar_url.value = avatar_url.value + new Date().getTime();

    console.log(avatar_url.value);

    const { image, error2 } = await supabase.storage
      .from("avatars")
      .upload(avatar_url.value, avatarFile.value, { upsert: true });

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
    clicked.value = false;
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

onMounted(() => {
  getUser();
  getProfile();
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
  border: 1px solid black;
  padding: 10px;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-evenly;
}

.user-name {
  font-size: 30px;
  margin-bottom: 0;
}

.user-location {
  margin-top: 0;
}

.profile-image {
  border: 2px solid #03bfcb;
  padding: 5px;
}

/* TODO - move to main.css */
button.primary {
  border: 3px solid #333333;
  text-transform: uppercase;
  background: #f1f1f1;
  padding: 15px 20px;
  margin: 5px;
}
</style>
