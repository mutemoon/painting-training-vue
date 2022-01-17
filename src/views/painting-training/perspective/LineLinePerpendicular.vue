<template>
  <v-card class="canvas_container"></v-card>
</template>

<script>
const THREE = require("three");
import store from "@/store";
import * as utils from "../utils"

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

      this.camera = new THREE.OrthographicCamera(
        ...[width / -2, width / 2, height / 2, height / -2],
        1,
        1000
      );
      this.renderer.setSize(width, height);
      this.reset()
    },

    reset() {
      this.destroy()
      // 随机一个点
      console.log(utils.random_logit_point);

      // 随机两条线

      // 确定距点圈和心点
    },

    update(time) {
      let [width, height] = [this.$el.offsetWidth, this.$el.offsetHeight];
      this.renderer.setSize(width, height);
      [
        this.camera.left,
        this.camera.right,
        this.camera.top,
        this.camera.bottom,
      ] = [width / 2, width / -2, height / 2, height / -2];
      this.camera.updateProjectionMatrix();
      this.renderer.render(this.scene, this.camera);
    },

    destroy() {},
  },
};
</script>

<style>
</style>
