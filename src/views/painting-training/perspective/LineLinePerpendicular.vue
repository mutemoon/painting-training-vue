<template>
  <transition name="slide-fade">
    <v-card
      class="canvas_container"
      @mousedown="handleDown"
      @mousemove="handleMove"
      @="console.log(1111)"
    ></v-card>
  </transition>
</template>

<script>
const THREE = require("three");
import store from "@/store";
import * as utils from "../utils";
import colors from 'vuetify/lib/util/colors'

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
    this.$nextTick(() => {
      this.reset();
    });
  },

  methods: {
    init() {
      let { scene, renderer } = store.getters;

      document
        .querySelector(".canvas_container")
        .appendChild(renderer.domElement);
      this.camera = new THREE.OrthographicCamera(...[0, 0, 0, 0], 1, 1000);

      this.camera.position.set(0, 0, -1);
      this.camera.lookAt(0, 0, 0);

      scene.add(this.camera);
      this.$on("reset", this.reset);
      this.$on("undo", this.undo);
      this.$on("redo", this.redo);
      this.$on("show-answer", this.showAnswer);
    },

    reset() {
      this.destroy();
      this.state = STATE.waitC;

      // 随机一个消失点
      this.pointA = utils.Point.random();

      // 随机两条线
      this.lineA = new utils.Line({
        pointA: this.pointA,
        pointB: utils.Point.randomWithConstraint(45),
        startWithA: true,
      });
      this.lineB = new utils.Line({
        pointA: this.pointA,
        pointB: utils.Point.randomWithConstraint(45),
        startWithA: true,
      });

      // for (let i = 0; i < 100; i++) {
      //   new utils.Line({pointA: utils.Point.randomWithConstraint(45), pointB: utils.Point.randomWithConstraint(45), startWithA: true, endWithB: true, color: 0xff00ff})
      // }
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
      console.log(offsetX, offsetY);

      console.log(point);
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

    showAnswer() {
      if (this.state == STATE.done) {
        let intersection = this.lineC.intersection(this.pointA.perpendicularLine(false))
        let remotePoint = intersection.fartherPoint(this.lineD.pointA, this.lineD.pointB)
        this.lineAnswer = new utils.Line({pointA: intersection, pointB: remotePoint, startWithA: true, color: 0x9c27b0});
        // this.lineAnswer = new utils.Line({pointA: this.pointA, pointB: this.pointA.perpendicularPoint(), startWithA: true, endWithB: true});
        console.log(colors.purple, remotePoint, this.lineAnswer);
      }
    },

    undo() {
      switch (this.state) {
        case STATE.drawingC:
          this.lineC.pointA = null;
          this.state = STATE.waitC;
          break;
        case STATE.waitD:
          this.lineC.pointB = null;
          this.state = STATE.drawingC;
          break;
        case STATE.drawingD:
          this.lineD.pointA = null;
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
