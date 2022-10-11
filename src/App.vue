<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <Title />
    <router-link to="/home">Home</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import Title from './components/Title.vue'

export default {
  components: {
    Title,
},

}
</script>
