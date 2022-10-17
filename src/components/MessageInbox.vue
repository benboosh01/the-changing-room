<template>
  <section style="text-align: center">
    <h2>My messages</h2>
    <li v-for="item in messages" :key="item.from + store.user.id">
      From: {{ item.from_username }}
      <button @click="showChat" :value="item.from + store.user.id">
        {{ userClicked(item) ? "Hide " : "Show " }}chat
      </button>
      <IndividualMessageBox v-if="userClicked(item)" :messages="item" />
      <MessageForm
        v-if="userClicked(item)"
        :username="item.from_username"
        :userId="item.from"
      />
    </li>
  </section>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "../store";
import { supabase } from "../supabase";
import IndividualMessageBox from "./IndividualMessageBox.vue";
import MessageForm from "./MessageForm.vue";

export default {
  setup() {
    const store = useStore();
    const loading = ref(false);
    const messages = ref([]);
    const show = ref(false);
    const itemId = ref("");

    function showChat(event) {
      itemId.value = event.target.value;
      show.value = !show.value;
    }

    function userClicked(item) {
      return show.value && itemId.value === item.from + store.user.id;
    }

    async function getUserMessages() {
      try {
        loading.value = true;
        const { data: items, error } = await supabase
          .from("messages")
          .select("*")
          .eq("user_to_id", store.user.id);
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
          .from("users")
          .select("username")
          .eq("id", uuid)
          .single();
        if (error) throw error;
        return data.username;
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
        const messageObj = {
          message: message.text,
          created_at: new Date(message.timestamp),
        };
        let changed = false;
        groups.forEach((group) => {
          if (group["from"] === user_from_id) {
            group.messages.push(messageObj);
            changed = true;
            return;
          }
        });
        if (!changed) {
          groups.push({
            from: user_from_id,
            messages: [messageObj],
          });
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
      show,
      showChat,
      userClicked,
      itemId,
    };
  },
  components: { IndividualMessageBox, MessageForm },
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
