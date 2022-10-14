<script>
import { ref } from 'vue';
import { store } from '../store';
import { supabase } from '../supabase';

export default {
  name: 'MessageForm',
  props: ['username', 'userId'],
  emits: ['toggleVisible'],
  setup(props, context) {
    const messageBody = ref('');

    async function handleMessage() {
      const data = {
        user_from_id: store.user.id,
        user_to_id: props.userId, // TODO: user_to_id should be dynamic, and be the recipients id
        text: messageBody.value,
      };
      const { error } = await supabase.from('messages').insert(data);
      if (error) {
        alert('Message failed to send');
      } else {
        alert('Succesfully sent message');
        messageBody.value = '';
        toggleVisible();
      }
    }

    function toggleVisible() {
      context.emit('toggleVisible');
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
  <h2>Send a message to {{ username }}</h2>
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
