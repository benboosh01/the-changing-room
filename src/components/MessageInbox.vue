<template>
  <section style="text-align: center">
    <h2>My messages</h2>
    <li v-for="item in messages">
      From: {{ item.from_username }}
      <p>{{ item.messages[item.messages.length - 1] }}</p>
      <button>View full chat</button>
    </li>
  </section>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useStore } from '../store';
import { supabase } from '../supabase';

export default {
  setup() {
    const store = useStore();
    const loading = ref(false);
    const messages = ref([]);
    async function getUserMessages() {
      try {
        loading.value = true;
        const { data: items, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_to_id', store.user.id);
        if (error) throw error;
        messages.value.push(...groupMessages(items));
        messages.value.map(
          async (item) =>
            (item.from_username = await getUsernameFromUUID(item.from))
        );
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function getUsernameFromUUID(uuid) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('username')
          .eq('id', uuid);
        if (error) throw error;
        return data[0].username;
      } catch (error) {
        alert(error);
      }
    }

    /**
     * Groups a list of messages by property 'user_from_id'
     *
     * @param {array} messages
     * @returns {array}
     */
    function groupMessages(messages) {
      const groups = [];
      messages.forEach((message) => {
        const user_from_id = message.user_from_id;
        const text = message.text;
        let changed = false;
        groups.forEach((group) => {
          if (group['from'] === user_from_id) {
            group.messages.push(text);
            changed = true;
            return;
          }
        });
        if (!changed) {
          groups.push({ from: user_from_id, messages: [text] });
        }
      });
      return groups;
    }

    onMounted(() => {
      getUserMessages();
    });

    return {
      loading,
      messages,
      store,
    };
  },
};
</script>

<style scoped>
li {
  list-style-type: none;
  margin: 15px;
  background-color: var(--custom-bg-color);
  border: var(--custom-border);
  border-radius: 5px;
  padding: 15px;
}
</style>
