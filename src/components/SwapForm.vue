<template>
  <div v-show="!submitted" class="swap-form-box">
    <h2 class="title">Ready to swap with {{ username }}?</h2>
    <h3 class="subtitle">
      Complete the form below to submit your swap request
    </h3>
    <p class="text">
      Hi <em>{{ username }}</em
      >, I'd like your item. Here's what I can swap:
    </p>
    <label htmlFor="swapForm">Choose which item you want to offer: </label>
    <select class="dropdown" name="swapForm" v-model="selectedItem">
      <option v-for="item in userItems">{{ item.item_name }}</option>
    </select>
    <button class="primary swap-btn" @click="createNewSwap(selectedItem)">Request swap</button>
    <p v-if="acceptDonation">
      Alternatively, make a donation to our charity of the week, Refuge, and
      send {{ username }} a message to let them know.
    </p>
    <p v-if="acceptDonation">Donation requested: £{{ donationAmount }}</p>
    <a
      v-if="acceptDonation"
      href="//widgets.justgiving.com/Button/Redirect?p=eyJUZXh0IjoiUmVmdWdlIiwiSWQiOiI1YWJkODc0YS01M2YyLTQxOGItOWRmZi1jZWQxZWMzMDE0YTAiLCJDaGFyaXR5SWQiOjExMTk0LCJTaXplIjoicyIsIlJlZmVyZW5jZSI6ImFsaWNlUmVmdWdlIiwiVHlwZSI6IkNoYXJpdHlEb25hdGUifQ=="
      ><img
        src="//widgets.justgiving.com/Button?p=eyJUZXh0IjoiUmVmdWdlIiwiSWQiOiI1YWJkODc0YS01M2YyLTQxOGItOWRmZi1jZWQxZWMzMDE0YTAiLCJDaGFyaXR5SWQiOjExMTk0LCJTaXplIjoicyIsIlJlZmVyZW5jZSI6ImFsaWNlUmVmdWdlIiwiVHlwZSI6IkNoYXJpdHlEb25hdGUifQ=="
    /></a>
  </div>

  <p v-show="submitted">
    Success! {{ username }} will now review your request and approve it if
    they're happy to go ahead
  </p>
</template>

<script>
import { isStaticArgOf } from "@vue/compiler-core";
import { onMounted, ref } from "vue";
import { useStore } from "../store";
import { supabase } from "../supabase";

export default {
  name: "SwapForm",
  props: [
    "username",
    "userId",
    "itemId",
    "itemName",
    "acceptDonation",
    "donationAmount",
  ],

  setup(props) {
    const store = useStore();
    const loggedInUser = store.user.id;
    const recipientUser = props.userId;
    const requestedItemId = props.itemId;
    const userItems = ref([]);
    const loading = ref(false);
    const selectedItemId = ref("");
    const submitted = ref(false);
    const swapOneData = ref([]);
    const swapTwoData = ref([]);

    async function getUserItems() {
      try {
        loading.value = true;

        const { data, error } = await supabase
          .from("items")
          .select("item_name, id")
          .eq("owner_id", loggedInUser);

        if (error) throw error;

        if (data) {
          userItems.value = data;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function createNewSwap(selectedItem) {
      loading.value = true;

      const selectedItemInfo = userItems.value.filter((item) => {
        return item.item_name === selectedItem;
      });
      selectedItemId.value = selectedItemInfo[0].id;
      const swapOne = {
        user_to: recipientUser,
        item_id: selectedItemId.value,
        approved: true,
      };
      const swapTwo = {
        user_to: loggedInUser,
        item_id: requestedItemId,
      };

      try {
        const { data, error } = await supabase
          .from("swaps")
          .insert(swapOne)
          .select();

        if (error) throw error;

        if (data) {
          swapOneData.value = data;
        }
      } catch (error) {
        alert(error.message);
      }

      try {
        const { data, error } = await supabase
          .from("swaps")
          .insert(swapTwo)
          .select();

        if (error) throw error;

        if (data) {
          swapTwoData.value = data;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        createSwapPair();
      }
    }
    async function createSwapPair() {
      try {
        loading.value = true;

        const swapPair = {
          swap1: swapOneData.value[0].swap_id,
          swap2: swapTwoData.value[0].swap_id,
        };

        const { data, error } = await supabase.from("trades").insert(swapPair);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
        submitted.value = true;
      }
    }

    onMounted(() => {
      getUserItems();
    });
    return {
      recipientUser,
      loggedInUser,
      getUserItems,
      userItems,
      requestedItemId,
      createNewSwap,
      selectedItemId,
      submitted,
    };
  },
};
</script>
<style scoped>
.title {
  margin-bottom: 5px;
}

.subtitle {
  margin-bottom: 20px;
}

.text {
  margin-bottom: 20px;
}

.swap-form-box {
  margin-top: 20px;
  padding: 40px;
  background-color: #e9f1f7;
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}

.swap-form-box > select,
button {
  width: 225px;
}

.dropdown {
  padding: 6px 20px;
  width: 100%;
  margin: 8px 8px;
  border: 1px solid #f4f4f4;
  text-align: center;
  border-radius: 10px;
}

.swap-btn {
  margin-left: 5px;
}
</style>
