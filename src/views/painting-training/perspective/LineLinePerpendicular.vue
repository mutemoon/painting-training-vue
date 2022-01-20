<template>
  <v-card
    class="canvas_container"
    @mousedown="handleDown"
    @mousemove="handleMove"
  ></v-card>
</template>

<script>
const THREE = require("three");
import store from "@/store";
import * as utils from "../utils";

const STATE = {
  waitC: Symbol("waitC"),
  drawingC: Symbol("drawingC"),
  waitD: Symbol("waitD"),
  drawingD: Symbol("drawingD"),
  done: Symbol("done"),
};

export default {
  data() {
    return {
      scene: null,
      renderer: null,
      camera: null,
      state: STATE.waitC,
    };
  },

  prop: ["immediately"],

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

      this.camera.position.set(0, 0, -1);
      this.camera.lookAt(0, 0, 0);

      this.scene.add(this.camera);
      this.renderer.setSize(width, height);
      this.reset();

      this.$on("reset", this.reset);
      this.$on("undo", this.undo);
      this.$on("redo", this.redo);
    },

    reset() {
      this.destroy();
      this.state = STATE.waitC;
      this.lineCStart = null;
      this.lineCEnd = null;
      this.lineDStart = null;
      this.lineDEnd = null;

      // 随机一个消失点
      this.pointA = utils.VanishingPoint.random();

      // 随机两条线
      this.lineA = new utils.RayLine(
        this.pointA,
        utils.VanishingPoint.randomWithConstraint(45)
      );
      this.lineB = new utils.RayLine(
        this.pointA,
        utils.VanishingPoint.randomWithConstraint(45)
      );

      this.lineC = new utils.Line()
      this.lineD = new utils.Line()
    },

    update(time) {
      let [width, height] = [this.$el.offsetWidth, this.$el.offsetHeight];
      this.renderer.setSize(width, height);
      [
        this.camera.left,
        this.camera.right,
        this.camera.top,
        this.camera.bottom,
      ] = [width / 2, -width / 2, height / 2, height / -2];
      this.camera.updateProjectionMatrix();
      this.renderer.render(this.scene, this.camera);
    },

    destroy() {
      utils.removeObjects(scene, [...scene.children]);
    },

    addToScene(obj) {
      this.scene.add(obj);
    },

    removeFromScene(obj) {
      this.scene.remove(obj);
    },

    handleDown({ offsetX, offsetY }) {
      let point = new THREE.Vector2(
        offsetX - store.getters.width / 2,
        -offsetY + store.getters.height / 2
      );

      switch (this.state) {
        case STATE.waitC:
          this.lineC.start = point;
          this.state = STATE.drawingC;
          break;
        case STATE.drawingC:
          this.lineC.end = point;
          this.state = STATE.waitD;
          break;
        case STATE.waitD:
          this.lineD.start = point;
          this.state = STATE.drawingD;
          break;
        case STATE.drawingD:
          this.lineD.end = point;
          this.state = STATE.done;
          break;
      }
    },

    handleMove({ offsetX, offsetY }) {
      let point = new THREE.Vector2(
        offsetX - store.getters.width / 2,
        -offsetY + store.getters.height / 2
      );

      switch (this.state) {
        case STATE.drawingC:
          this.lineC.end = point;
          break;
        case STATE.drawingD:
          this.lineD.end = point;
          break;
      }
    },

    showAnswer() {
      if (this.state == STATE.done) {
        let remotePoint = this.pointA.distanceTo(this.lineDStart) > this.pointA.distanceTo(this.lineDEnd) ? this.lineDStart : this.lineDEnd
        this.lineC.toLogic()
        this.remotePoint

        this.lineAnswer = this.pointA.perpendicularLine()
      }
    },

    undo() {
      switch (this.state) {
        case STATE.drawingC:
          this.lineC.start = null;
          this.state = STATE.waitC;
          break;
        case STATE.waitD:
          this.lineC.end = null;
          this.state = STATE.drawingC;
          break;
        case STATE.drawingD:
          this.lineD.start = null;
          this.state = STATE.waitD;
          break;
        case STATE.done:
          this.lineD.end = null;
          this.state = STATE.drawingD;
          break;
      }
    },

    redo() {
      switch (this.state) {
        case STATE.drawingC:
          this.lineCStart = null;
          this.state = STATE.waitC;
          break;
        case STATE.waitD:
          this.lineCEnd = null;
          this.state = STATE.drawingC;
          break;
        case STATE.drawingD:
          this.lineDStart = null;
          this.state = STATE.waitD;
          break;
        case STATE.done:
          this.lineDEnd = null;
          this.state = STATE.drawingD;
          break;
      }
    },
  },
  watch: {
    state: function (newState, oldState) {
      if (newState === STATE.done && this.immediately) {
        this.showAnswer();
      }
    }
  },
};
</script>

<style>
</style>
