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
  waitA: Symbol("waitA"),
  drawingB: Symbol("drawingB"),
  drawingC: Symbol("drawingC"),
  drawingD: Symbol("drawingD"),
  done: Symbol("done"),
  showAnswer: Symbol("showAnswer"),
};

export default {
  data() {
    return {
      scene: null,
      renderer: null,
      camera: null,
      state: STATE.waitA,
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
      this.state = STATE.waitA;

      this.lineA?.destroy();
      this.lineB?.destroy();
      this.lineC?.destroy();
      this.lineD?.destroy();
      this.clearAnswer();

      this.lineA = new utils.Line({ startWithA: true, endWithB: true });
      this.lineB = new utils.Line({ startWithA: true, endWithB: true });
      this.lineC = new utils.Line({ startWithA: true, endWithB: true });
      this.lineD = new utils.Line({ startWithA: true, endWithB: true });
      this.answerAngle = Math.random() * 90;
    },

    next() {
      this.$emit("beforeNext");
      this.destroy();
      this.state = STATE.waitA;
      this.auxCircle = new utils.Circle({
        centre: new utils.Point({ x: 0, y: 0 }),
        r: 1,
      });
      this.auxCenter = new utils.Point({ x: 0, y: 0, hidden: false });

      // 随机两个垂直的消失点
      this.pointA = utils.Point.random();
      this.pointB = this.pointA.perpendicularLine().randomPoint();
      new utils.Line({
        pointA: this.pointA,
        pointB: this.pointB,
        startWithA: true,
        endWithB: true,
      });
      this.plane = utils.Plane.randomPlaneInView(this.pointA, this.pointB);

      this.lineA = new utils.Line({ startWithA: true, endWithB: true });
      this.lineB = new utils.Line({ startWithA: true, endWithB: true });
      this.lineC = new utils.Line({ startWithA: true, endWithB: true });
      this.lineD = new utils.Line({ startWithA: true, endWithB: true });
      this.answerAngle = Math.random() * 90;
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
        case STATE.waitA:
          this.lineA.pointA = point;
          this.state = STATE.drawingB;
          break;
        case STATE.drawingB:
          this.lineA.pointB = point;
          this.lineB.pointA = point;
          this.state = STATE.drawingC;
          break;
        case STATE.drawingC:
          this.lineB.pointB = point;
          this.lineC.pointA = point;
          this.state = STATE.drawingD;
          break;
        case STATE.drawingD:
          this.lineC.pointB = point;
          this.lineD.pointA = point;
          this.lineD.pointB = this.lineA.pointA;
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
        case STATE.drawingB:
          this.lineA.pointB = point;
          break;
        case STATE.drawingC:
          this.lineB.pointB = point;
          break;
        case STATE.drawingD:
          this.lineC.pointB = point;
          break;
      }
    },

    clearAnswer() {
      this.answerVpA?.destroy();
      this.answerVpB?.destroy();
      this.answerLine1?.destroy();
      this.answerLine2?.destroy();
      this.answerLine3?.destroy();
      this.answerLine4?.destroy();
      this.answerPlane?.destroy();
    },

    showAnswer() {
      if (this.state == STATE.done) {
        window.v = this
        let o = new utils.Point({x:0, y:0})
        this.answerLine1 = new utils.Line({pointA: o, pointB: this.plane.perpendicularPoint(), hidden: true}).angulationPointToPointInLine(this.plane.perpendicularPoint(), o, this.answerAngle).perpendicularLine()
        this.answerVpA = this.lineA.intersection(this.answerLine1);
        this.answerVpB = this.answerVpA
          .perpendicularLine()
          .intersection(this.answerLine1);
        this.answerLine2 = new utils.Line({
          pointA: this.answerVpA,
          pointB: this.answerVpB,
          startWithA: true,
          endWithB: true,
          color: utils.Color.answer2,
        });

        this.answerLine3 = new utils.Line({
          pointA: this.answerVpA,
          pointB: this.lineB.pointA,
          startWithA: true,
          endWithB: true,
          color: utils.Color.answer3,
        });
        this.answerLine4 = new utils.Line({
          pointA: this.answerVpB,
          pointB: this.lineD.pointA,
          startWithA: true,
          endWithB: true,
          color: utils.Color.answer3,
        });

        this.answerPlane = new utils.Plane({
          vpA: this.answerVpA,
          vpB: this.answerVpB,
          controllA: this.lineB.pointA,
          controllB: this.lineD.pointA,
          color: utils.Color.answer1,
        });
        this.state = STATE.showAnswer;
        // this.$emit("score", this.score());
      }
    },

    score() {
      return (
        100 *
          (Math.max(45 - this.lineC.inclinationToLine(this.answer2), 0) / 90) +
        100 *
          (Math.max(45 - this.lineD.inclinationToLine(this.answer3), 0) / 90)
      ).toFixed(2);
    },

    undo() {
      switch (this.state) {
        case STATE.drawingB:
          this.lineA.pointA = null;
          this.lineA.pointB = null;
          this.lineB.pointA = null;
          this.state = STATE.waitA;
          break;
        case STATE.drawingC:
          this.lineA.pointB = null;
          this.lineB.pointA = null;
          this.lineB.pointB = null;
          this.lineC.pointA = null;
          this.state = STATE.drawingB;
          break;
        case STATE.drawingD:
          this.lineB.pointB = null;
          this.lineC.pointA = null;
          this.lineC.pointB = null;
          this.lineD.pointA = null;
          this.state = STATE.drawingC;
          break;
        case STATE.done:
          this.lineC.pointB = null;
          this.lineD.pointA = null;
          this.lineD.pointB = null;
          this.state = STATE.drawingD;
          break;
        case STATE.showAnswer:
          this.lineC.pointB = null;
          this.lineD.pointA = null;
          this.lineD.pointB = null;
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
