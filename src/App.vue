<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <TheNavigation />
    <Title />
    <UploadItem />
    <router-view></router-view>
  </div>
</template>

<script>
import Title from './components/Title.vue'
import TheNavigation from './components/TheNavigation.vue'
import UploadItem from './components/UploadItem.vue'

export default {
  components: {
    Title,
    TheNavigation,
    UploadItem
},
}
</script>
