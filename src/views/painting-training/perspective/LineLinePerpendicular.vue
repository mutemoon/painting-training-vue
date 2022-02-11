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
  waitC: Symbol("waitC"),
  drawingC: Symbol("drawingC"),
  waitD: Symbol("waitD"),
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
      this.state = STATE.waitC;

      this.lineC?.destroy();
      this.lineD?.destroy();
      this.clearAnswer()

      this.lineC = new utils.Line({ startWithA: true, endWithB: true });
      this.lineD = new utils.Line({ startWithA: true, endWithB: true });
    },

    next() {
      this.$emit("beforeNext");
      this.destroy();
      this.state = STATE.waitC;
      this.auxCircle = new utils.Circle({
        centre: new utils.Point({ x: 0, y: 0 }),
        r: 1,
      });
      this.auxCenter = new utils.Point({ x: 0, y: 0, hidden: false });

      // 随机一个消失点
      this.pointA = utils.Point.random();

      // 随机两条线
      this.lineA = new utils.Line({
        pointA: this.pointA,
        pointB: utils.Point.randomWithConstraint(45),
        startWithA: true,
        color: utils.Color.question1,
      });
      this.lineB = new utils.Line({
        pointA: this.pointA,
        pointB: utils.Point.randomWithConstraint(45),
        startWithA: true,
        color: utils.Color.question1,
      });

      this.lineC = new utils.Line({ startWithA: true, endWithB: true });
      this.lineD = new utils.Line({ startWithA: true, endWithB: true });
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
        case STATE.waitC:
          this.lineC.pointA = point;
          this.state = STATE.drawingC;
          break;
        case STATE.drawingC:
          this.lineC.pointB = point;
          this.state = STATE.waitD;
          break;
        case STATE.waitD:
          this.lineD.pointA = point;
          this.state = STATE.drawingD;
          break;
        case STATE.drawingD:
          this.lineD.pointB = point;
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
        case STATE.drawingC:
          this.lineC.pointB = point;
          break;
        case STATE.drawingD:
          this.lineD.pointB = point;
          break;
      }
    },

    clearAnswer() {
      this.answer1?.destroy();
      this.answer2?.destroy();
      this.answer3?.destroy();
    },

    showAnswer() {
      if (this.state == STATE.done) {
        this.answer1 = this.pointA.perpendicularLine();
        this.answer1.color = utils.Color.answer2
        this.answer1.hidden = false
        let intersection = this.lineC.intersection(this.answer1);
        let remotePoint = intersection.fartherPoint(
          this.lineD.pointA,
          this.lineD.pointB
        );
        this.answer2 = new utils.Line({
          pointA: intersection,
          pointB: remotePoint,
          startWithA: true,
          color: utils.Color.answer1,
        });
        this.answer3 = new utils.Line({
          pointA: this.pointA,
          pointB: this.pointA.perpendicularPoint(),
          startWithA: true,
          endWithB: true,
          color: utils.Color.answer3,
        });
        this.state = STATE.showAnswer;
        this.$emit("score", this.score());
      }
    },

    score() {
      return (
        100 *
        (Math.max(45 - this.lineD.inclinationToLine(this.answer2), 0) / 45)
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
