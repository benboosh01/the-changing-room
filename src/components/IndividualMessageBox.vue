<template>
  <section>
    <li class="message" v-for="item in messages.messages" :key="item.message">
      <p>{{ item.from }}</p>
      <hr />
      <p>{{ item.message }}</p>
      <p class="msg-date">
        {{ item.created_at.toDateString() }}
        {{ item.created_at.toLocaleTimeString() }}
      </p>
    </li>
  </section>
</template>

<script>
export default {
  props: ['messages'],
};
</script>

<style scoped>
.message {
  padding: 15px;
  background-color: var(--custom-bg-color);
  border: var(--custom-border);
  border-radius: 10px;
  margin: 10px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.msg-date {
  font-size: 0.7em;
}
</style>
