<template>
  <transition name="slide-fade">
    <v-card
      class="canvas-container"
      @mousedown="handleDown"
      @mousemove="handleMove"
      @="console.log(1111)"
    ></v-card>
  </transition>
</template>

<script>
import * as THREE from "@/assets/libs/three";
import store from "@/store";
import * as utils from "../utils";

const STATE = {
  drawingB: Symbol("drawingC"),
  done: Symbol("done"),
  showAnswer: Symbol("showAnswer"),
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
    this.$nextTick(() => {
      this.next();
    });
  },

  methods: {
    init() {
      let { scene, renderer } = store.getters;

      document
        .querySelector(".canvas-container")
        .appendChild(renderer.domElement);
      this.camera = new THREE.OrthographicCamera(...[0, 0, 0, 0], 1, 1000);

      this.camera.position.set(0, 0, -1);
      this.camera.lookAt(0, 0, 0);

      scene.add(this.camera);
      this.$on("next", this.next);
      this.$on("reset", this.reset);
      this.$on("undo", this.undo);
      this.$on("redo", this.redo);
      this.$on("show-answer", this.showAnswer);
    },

    reset() {
      this.$emit("beforeReset");
      this.state = STATE.drawingB;

      this.lineC?.destroy();
      this.clearAnswer()

      this.pointB = new utils.Point({hidden: false, color: 0x9c27b0, size: 5})
      this.pointB.copy(this.lineA.pointB)
    },

    next (){
      this.destroy();
      this.state = STATE.drawingB;

      // 随机一个消失点
      this.pointA = utils.Point.random();

      // 随机两条线
      this.lineA = utils.Line.createOverViewRandomLineSegmentByVanishingPoint(this.pointA);
      this.lineB = utils.Line.createOverViewRandomLineByVanishingPoint(this.pointA)

      this.pointB = new utils.Point({hidden: false, color: 0x9c27b0, size: 5})
      this.pointB.copy(this.lineA.pointB)
    },

    clearAnswer() {
      this.pointB?.destroy()
      this.answerPoint?.destroy()
    },

    update(time) {
      let { width, height, scene, renderer } = store.getters;
      [
        this.camera.left,
        this.camera.right,
        this.camera.top,
        this.camera.bottom,
      ] = [width / 2, -width / 2, height / 2, height / -2];
      this.camera.updateProjectionMatrix();
      renderer.render(scene, this.camera);
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
      let point = new utils.Point({
        paperX: offsetX - store.getters.width / 2,
        paperY: -offsetY + store.getters.height / 2,
      });

      switch (this.state) {
        case STATE.drawingB:
          this.pointB.copy(this.lineA.closestPointAtLineSegment(point))
          this.state = STATE.done
          break
      }
    },

    handleMove({ offsetX, offsetY }) {
      let point = new utils.Point({
        paperX: offsetX - store.getters.width / 2,
        paperY: -offsetY + store.getters.height / 2,
      });

      switch (this.state) {
        case STATE.drawingB:
          this.pointB.copy(this.lineA.closestPointAtLineSegment(point))
          break;
      }
    },

    showAnswer() {
      if (this.state == STATE.done) {
        let pointADistanceToVp = this.lineA.pointA.distanceTo(this.pointA)
        let pointBDistanceToVp = this.lineA.pointB.distanceTo(this.pointA)

        this.answerPoint = new Point({color: utils.Color.answer2, size: 5, hidden:false})
        this.answerPoint.copy(this.lineA.pointB.clone().sub(this.lineA.pointA).multiplyScalar(pointADistanceToVp / (pointADistanceToVp + pointBDistanceToVp)).add(this.lineA.pointA))
      }
    },

    undo() {
      switch (this.state) {
        case STATE.drawingC:
          this.lineC.pointA = null;
          this.lineC.pointB = null;
          this.state = STATE.waitC;
          break;
        case STATE.waitD:
          this.lineC.pointB = null;
          this.state = STATE.drawingC;
          break;
        case STATE.drawingD:
          this.lineD.pointA = null;
          this.lineD.pointB = null;
          this.state = STATE.waitD;
          break;
        case STATE.done:
          this.lineD.pointB = null;
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
    },
  },
};
</script>

<style>
</style>
