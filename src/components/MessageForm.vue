<script>
import { ref } from "vue";
import { store } from "../store";
import { supabase } from "../supabase";

export default {
  setup() {
    const messageBody = ref("");
    const user = ref(store.user);

    async function handleMessage() {
      try {
        const data = {
          user_from_id: user.value.id,
          user_to_id: user.value.id, // TODO: user_to_id should be dynamic, and the recipients id
          text: messageBody.value,
        };
        const { error } = await supabase.from("messages").insert(data);
        alert(error ? "Message failed to send" : "Succesfully sent message");
      } catch (error) {
        alert(error);
      } finally {
        messageBody.value = "";
      }
    }

    return {
      messageBody,
      user,
      handleMessage,
    };
  },
};
</script>

<template>
  <!-- Replace to_user with the recipients username -->
  <h2>Send a message to {{ user.username }}</h2>
  <form @submit.prevent="handleMessage">
    <label for="message-body" />
    <textarea
      class="message-box"
      name="message-body"
      type="text"
      v-model="messageBody"
      placeholder="Message body"
      required
    />
    <input type="submit" />
  </form>
</template>

<style>
.message-box {
  background-color: var(--custom-bg-color);
  border: var(--custom-border);
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 15px;
  width: 100%;
  height: 150px;
  resize: none;
}
</style>
