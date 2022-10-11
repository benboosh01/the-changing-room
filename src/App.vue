<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <Title />
    <Profile/>
  </div>
</template>

<script>
import Title from './components/Title.vue'
import Profile from './components/Profile.vue';
export default {
  components: {
    Title,
    Profile
},
}
</script>
