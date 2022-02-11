<template>
  <transition name="slide-fade">
    <v-card
      class="canvas-container"
      @mousedown="handleDown"
      @mousemove="handleMove"
    ></v-card>
  </transition>
</template>

<script>
import * as THREE from "@/assets/libs/three";
import store from "@/store";
import * as utils from "../utils";

const STATE = {
  drawingA: Symbol("drawingA"),
  drawingB: Symbol("drawingB"),
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

  props: ["immediately"],

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
      this.state = STATE.drawingA;

      this.lineA?.destroy();
      this.lineB?.destroy();
      this.clearAnswer();

      this.lineA = new utils.Line({ startWithA: true, endWithB: true });
      this.lineB = new utils.Line({ startWithA: true, endWithB: true });

      this.lineA.pointA = this.plane.path[0];
      this.lineB.pointA = this.plane.path[2];
    },

    next() {
      this.$emit("beforeNext");
      this.destroy();
      this.state = STATE.drawingA;
      this.auxCircle = new utils.Circle({
        centre: new utils.Point({ x: 0, y: 0 }),
        r: 1,
      });
      this.auxCenter = new utils.Point({ x: 0, y: 0, hidden: false });

      // 随机两个垂直的消失点
      this.pointA = utils.Point.random();
      this.pointB = this.pointA.perpendicularLine().randomPoint();

      this.planeVanishingLine = new utils.Line({
        pointA: this.pointA,
        pointB: this.pointB,
        startWithA: true,
        endWithB: true,
      });

      this.plane = utils.Plane.randomPlaneInView(this.pointA, this.pointB);

      this.answerVp = this.planeVanishingLine.angulationPointToPointInLine(this.plane.vpA, new Line({pointA: this.plane.path[0], pointB: this.plane.path[2], hidden: true}).intersection(this.planeVanishingLine), Math.random() * 90);

      this.lineA = new utils.Line({
        pointA: this.plane.path[0],
        pointB: this.plane.path[1],
        startWithA: true,
        endWithB: true,
        color: 0xff0000,
      });

      this.lineB = new utils.Line({
        pointA: this.plane.path[0],
        pointB: this.plane.path[3],
        startWithA: true,
        endWithB: true,
        color: 0x00ff00,
      });

      // this.line1 = new utils.Line({
      //   pointA: this.plane.path[0],
      //   pointB: this.plane.path[1],
      //   startWithA: true,
      //   endWithB: true,
      // });

      this.lineA = new utils.Line({ startWithA: true, endWithB: true });
      this.lineB = new utils.Line({ startWithA: true, endWithB: true });

      this.lineA.pointA = this.plane.path[0];
      this.lineB.pointA = this.plane.path[2];
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
        case STATE.drawingA:
          this.lineA.pointB = point;
          this.state = STATE.drawingB;
          break;
        case STATE.drawingB:
          this.lineB.pointB = point;
          this.state = STATE.done;
          break;
      }
    },

    handleMove({ offsetX, offsetY }) {
      let point = new utils.Point({
        paperX: offsetX - store.getters.width / 2,
        paperY: -offsetY + store.getters.height / 2,
      });
      switch (this.state) {
        case STATE.drawingA:
          this.lineA.pointB = point;
          break;
        case STATE.drawingB:
          this.lineB.pointB = point;
          break;
      }
    },

    clearAnswer() {
      this.answerLineA?.destroy();
      this.answerLineB?.destroy();
      this.answerVp?.destroy();
    },

    showAnswer() {
      if (this.state == STATE.done) {
        this.answerLineA = new utils.Line({
          pointA: this.answerVp,
          pointB: this.lineA.pointA,
          startWithA: true,
          color: utils.Color.answer1,
        });

        this.answerLineB = new utils.Line({
          pointA: this.answerVp,
          pointB: this.lineB.pointA,
          startWithA: true,
          color: utils.Color.answer1,
        });

        this.state = STATE.showAnswer;
        this.$emit("score", this.score());
      }
    },

    score() {
      return (
        100 *
          (Math.max(45 - this.lineA.inclinationToLine(this.answerLineA), 0) / 90) +
        100 *
          (Math.max(45 - this.lineB.inclinationToLine(this.answerLineB), 0) / 90)
      ).toFixed(2);
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
        case STATE.showAnswer:
          this.clearAnswer();
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
