<script>
import { ref } from "vue";
import { useStore } from "../store";
import { supabase } from "../supabase";

export default {
  name: "MessageForm",
  props: ["username", "userId"],
  emits: ["toggleVisible", "onMessageClick"],
  setup(props, context) {
    const store = useStore();
    const messageBody = ref("");

    async function handleMessage() {
      const data = {
        user_from_id: store.user.id,
        user_to_id: props.userId, // TODO: user_to_id should be dynamic, and be the recipients id
        text: messageBody.value,
      };
      const { error } = await supabase.from("messages").insert(data);
      if (error) {
        alert("Message failed to send");
      } else {
        alert("Succesfully sent message");
        messageBody.value = "";
        toggleVisible();
      }
    }

    function toggleVisible() {
      context.emit("toggleVisible");
      context.emit("onMessageClick");
    }

    return {
      messageBody,
      store,
      handleMessage,
    };
  },
};
</script>

<template>
  <!-- Replace 'store.user.username' with the recipients username -->
  <div class="message-form-box">
    <h2 class="title">Send a message to {{ username }}</h2>
    <form @submit.prevent="handleMessage" class="msg-form">
      <label for="message-body" />
      <textarea
        class="message-box"
        name="message-body"
        type="text"
        v-model="messageBody"
        placeholder="Message body"
        required
      />
      <input type="submit" class="msg-form-btn" />
    </form>
  </div>
</template>

<style>
.message-form-box {
  margin-top: 20px;
  padding: 40px;
  background-color: #e9f1f7;
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}

.message-box {
  margin-bottom: 15px;
  padding: 15px;
  width: 100%;
  height: 150px;
  resize: none;
}

.msg-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  border: none;
  align-items: center;
}

.msg-form-btn {
  border: 3px solid #333333;
  text-transform: uppercase;
  background: #f1f1f1;
  padding: 5px 20px;
  margin: 5px;
  background: #f1f1f1;
}

.title {
  margin: 0 0 30px;
  padding: 0;
  text-align: center;
}
</style>
