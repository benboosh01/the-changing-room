<template>
    <div id="test" class="hero">

        <div class="hero-text">
          <h1 class="title">The Changing Room</h1>
          <h2 class="subtitle">Come and swap with us.</h2>
        </div>
    </div>
</template>


<style scoped>
.hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../assets/hero-image-clothes.jpg");
  height: 50vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  /* position: relative; */
}

.hero-text {
  text-align: center;
  /* position: absolute; */
  /* top: 50%; */
  /* left: 50%; */
  /* transform: translate(-50%, -50%); */
}

.title {
  /* padding: 30px;   */
  color: #fff;
  font-size: 60px;
  font-size: 5rem;
} 

.subtitle {
  color: #fff;
}
</style>