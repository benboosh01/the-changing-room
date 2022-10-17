<template>
  <div class="user-items-wrapper">
    <h1>{{ loggedInUser === userId ? "Your" : username }} Items</h1>
    <button @click="toggleUpload">Add New Item</button>
    <UploadItem
      v-if="upLoadVisible && loggedInUser === userId"
      @toggleUpload="toggleUpload"
    />
    <ul>
      <li v-for="item in userItems" :key="item.id">
        <h3>{{ item.item_name }}</h3>
        <ItemImage v-if="item" :url="item.item_preview_url" />
        <p>{{ item.condition }}</p>
        <p>{{ item.description }}</p>
        <button @click="clickEditRemove(item.id)">Edit/remove listing</button>
        <EditRemoveItem
          @clickEditRemove="clickEditRemove"
          v-if="
            editRemoveClicked &&
            item.id === chosenItem &&
            loggedInUser === userId
          "
          :id="chosenItem"
        />
        <button @click="selectItem(item.id)">View item details</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { supabase } from "../supabase";
import { onMounted, ref } from "vue";
import { useStore } from "../store";
import ItemImage from "./ItemImage.vue";
import UploadItem from "./UploadItem.vue";
import EditRemoveItem from "./EditRemoveItem.vue";
import router from "../router";

export default {
  components: { ItemImage, UploadItem, EditRemoveItem },

  setup() {
    const store = useStore();
    const loading = ref(false);
    const username = ref("");
    const userId = ref("");
    const userItems = ref([]);
    const loggedInUser = store.user.id;
    const upLoadVisible = ref(false);
    const editRemoveClicked = ref(false);
    const chosenItem = ref("");

    async function getUser() {
      try {
        loading.value = true;
        username.value = store.user.username;
        userId.value = store.user.id;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function getUserItems() {
      try {
        loading.value = true;

        const { data: items, error } = await supabase
          .from("items")
          .select("*")
          .eq("owner_id", userId.value);

        if (error) throw error;

        if (items) {
          userItems.value = items;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    function toggleUpload() {
      console.log(upLoadVisible.value);
      if (upLoadVisible.value) {
        upLoadVisible.value = false;
      } else {
        upLoadVisible.value = true;
      }
      console.log(upLoadVisible.value);
    }

    function selectItem(id) {
      router.push({ name: "singleItem", params: { id: id } });
    }

    function clickEditRemove(id) {
      if (editRemoveClicked.value) {
        editRemoveClicked.value = false;
        getUserItems();
      } else {
        chosenItem.value = id;
        editRemoveClicked.value = true;
      }
    }

    onMounted(() => {
      getUser();
      getUserItems();
    });

    return {
      loading,
      username,
      userId,
      userItems,
      loggedInUser,
      upLoadVisible,
      toggleUpload,
      clickEditRemove,
      editRemoveClicked,
      chosenItem,
      selectItem,
    };
  },
};
</script>

<style scoped>
.user-items-wrapper {
  border: 1px solid black;
  padding: 10px;
  margin-bottom: 20px;
}
</style>
