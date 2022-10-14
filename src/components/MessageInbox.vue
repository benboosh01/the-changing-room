<template>
  <section style="text-align: center">
    <h2>My messages</h2>
    <li v-for="item in messages">
      <p>From: {{ item.from_username }}</p>
      <p>{{ item.text }}</p>
      <button>View chat</button>
    </li>
  </section>
</template>

<script>
import { onMounted, ref } from "vue";
import { store } from "../store";
import { supabase } from "../supabase";

export default {
  setup() {
    const loading = ref(false);
    const messages = ref([]);
    async function getUserMessages() {
      try {
        loading.value = true;
        const { data: items, error } = await supabase
          .from("messages")
          .select("*")
          .eq(["user_from_id", "user_to_id"], store.user.id);
        if (error) throw error;
        messages.value.push(...items);
        messages.value.map(
          async (item) =>
            (item.from_username = await getUsernameFromUUID(item.user_from_id))
        );
      } catch (error) {
        alert(error);
      } finally {
        loading.value = false;
      }
    }

    async function getUsernameFromUUID(uuid) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("id", uuid);
        if (error) throw error;
        return data[0].username;
      } catch (error) {
        alert(error);
      }
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
