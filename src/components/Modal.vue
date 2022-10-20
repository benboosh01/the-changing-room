<template>
  <div class="modal-overlay">
    <div class="dialog" @click="$emit('close-modal')">
      <span class="dialog__close" @click="$emit('close-modal')">&#x2715;
      </span>

      <h2 class="dialog__title">All reviews for {{ username }}</h2>

      <slot name="modal-body"></slot>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "../store";
const store = useStore();
const username = store.user.username;
</script>

<script>
export default {
  name: "Modal",
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.dialog {
  overflow-y: auto;
  background: #f1f1f1;
  width: 70%;
  position: absolute;
  left: calc(50% - 35%);
  top: 0;
  bottom: 0;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(#333333, 0.5);
  border: 3px solid #333333;
}



.dialog__close {
  font-size: 2rem;
  line-height: 2rem;
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
  padding: 15px;
  transition: color 150ms ease;
}

.dialog .dialog__close:hover {
  color: #e74c3c;
}

.dialog__title {
  font-size: 2rem;
  font-family: "Slabo 27px", serif;
  font-weight: 100;
  margin: 0;
  padding: 0 0 15px 0;
  border-bottom: 2px solid #333333;
}

.dialog__content {
  font-size: 1.1rem;
  line-height: 2rem;
}

.dialog__action {
  margin: 0;
  font-size: 1rem;
}
</style>
