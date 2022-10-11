<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <Title />
    <Registration />
  </div>
</template>

<script>
import Title from './components/Title.vue'
import Registration from './components/Registration.vue'

export default {
  components: {
    Title,
    Registration
  },
}
</script>
