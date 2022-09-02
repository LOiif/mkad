<template>
  <div class="loader-container">
    <div class="loader"></div>
  </div>
</template>

<script>
export default {
  name: 'AppLoader',
};
</script>

<style scoped lang="scss">
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(255, 255, 255, 0.8);
}

.loader {
  width: 60px;
  height: 60px;

  background-image: url("../assets/loader.svg");
}
</style>
