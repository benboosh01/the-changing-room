import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useStore = defineStore('store', {
  state: () => {
    return {
      user: useStorage('user', {}),
    };
  },
});
