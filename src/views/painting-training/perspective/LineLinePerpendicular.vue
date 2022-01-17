<template>
  <v-card class="canvas_container"></v-card>
</template>

<script>
const THREE = require("three");
import store from "@/store";

export default {
  data() {
    return {
      scene: null,
      renderer: null,
      camera: null,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.scene = store.getters.scene;
      this.renderer = store.getters.renderer;
      this.renderer.setAnimationLoop(this.update.bind(this));
      document
        .querySelector(".canvas_container")
        .appendChild(this.renderer.domElement);
      let [width, height] = [this.$el.offsetWidth, this.$el.offsetHeight];
      console.log(width, height)
      this.camera = new THREE.OrthographicCamera(
        ...[width / -2, width / 2, height / 2, height / -2],
        1,
        1000
      );
      this.renderer.setSize(width, height);
    },

    start() {},

    update(time) {
      let [width, height] = [this.$el.offsetWidth, this.$el.offsetHeight];
      this.renderer.setSize(width, height-10);
      [
        this.camera.left,
        this.camera.right,
        this.camera.top,
        this.camera.bottom,
      ] = [width / 2, width / -2, height / 2, height / -2];
      this.camera.updateProjectionMatrix();
      // console.log(width, height)
      this.renderer.render(this.scene, this.camera);
    },

    destroy() {},
  },
};
</script>

<style>
</style>
