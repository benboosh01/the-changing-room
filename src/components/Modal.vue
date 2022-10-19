<template>
  <div class="modal-overlay">
    <div class="dialog" @click="$emit('close-modal')">
      <span class="dialog__close" @click="$emit('close-modal')">&#x2715;
      </span>

      <h2 class="dialog__title">All reviews for {{ username }}</h2>

      <!-- <p class="dialog__content">
         content
      </p> -->
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
/* bg-color: #f1f1f1; */
/* $text-color: #333333; */
/* $highlight-color: #E74C3C; */
/* 
@import url('https://fonts.googleapis.com/css?family=Cairo|Slabo+27px');  */


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

/* .dialog__trigger, .dialog__action {
  border: 3px solid #333333;
  background: #f1f1f1;;
  padding: 15px 20px;
  font-size: 1.1rem;
  text-transform: uppercase;
  display: block;
  transition: all 150ms ease-out;
  transform: translateY(0px);
  /* &:hover, &:focus {
    outline: 0;
    transform: translateY(-5px);
    transition: all 100ms ease-in;
    box-shadow: 0 5px 10px rgba($text-color,0.4);
  }
  &:active {
    transform: translateY(-3px);
  } */
/* } */

.dialog {
  background: #f1f1f1;
  width: 70%;
  position: absolute;
  left: calc(50% - 35%);
  top: 0;
  bottom: 0;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(#333333, 0.5);
  border: 3px solid #333333;
  /* TODO FIX BELOW and active state */
  /* visibility: hidden; */
  /* opacity: 0; */
  /* transition: all 180ms ease-in;
  @media (max-width: 600px) {
    width: 90%;
    left: calc(50% - 45%); // half of the container width - 90%
  } */
}

/* .dialog--active {
    top: 10%;
    visibility: visible;
    opacity: 1;
    transition: all 250ms ease-out;
  } */

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
