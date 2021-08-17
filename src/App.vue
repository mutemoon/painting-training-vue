<template>
  <div>
    <painting-traning></painting-traning>
  </div>
</template>

<script>
import PaintingTraning from "./views/painting-training/PaintingTraning";

export default {
  name: "App",
  data() {
    return {
      user: {
        uid: 0,
      },
    };
  },
  components: { PaintingTraning },
};
</script>

<style>
@import url("/assets/css/base.css");

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
