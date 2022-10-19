<template>
  <section>
    <li class="message" v-for="item in messages.messages" :key="item.message">
      <p>From: {{ item.from }}</p>
      <p>{{ item.message }}</p>
      <p>
        {{ item.created_at.toDateString() }}
        {{ item.created_at.toLocaleTimeString() }}
      </p>
    </li>
  </section>
</template>

<script>
export default {
  props: ["messages"],
};
</script>

<style scoped>
.message {
  padding: 15px;
  background-color: var(--custom-bg-color);
  border: var(--custom-border);
  border-radius: 5px;
  margin: 10px;
}
</style>
