<script>
import { ref } from "vue";
import { supabase } from "../supabase";

export default {
  setup() {
    const messageBody = ref("");
    const username = ref("");

    async function handleMessage() {
      try {
        const data = {
          user_from_id: "c205d247-4a22-46ad-8458-45d6d1964d0e", // TODO: from user should be dynamic
          user_to_id: "c205d247-4a22-46ad-8458-45d6d1964d0f", // TODO: to user should be dynamic
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
      username,
      handleMessage,
    };
  },
};
</script>

<template>
  <!-- Replace to_user with the recipients username -->
  <h2>Send a message to {{ to_user }}</h2>
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
