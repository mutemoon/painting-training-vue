<template>
  <v-card
    class="canvas-container"
    @mousedown="handleDown"
    @mousemove="handleMove"
  >
    <v-card class="subcanvas-container"> </v-card>
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      :close-on-click="false"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item
          class="menu-item"
          v-for="(v, i) in lightness"
          :key="i"
          :style="`background-color: rgb(${i * 25.5}, ${i * 25.5}, ${
            i * 25.5
          })`"
          @click="handleClick(i)"
        >
        </v-list-item>
      </v-list> </v-menu
  ></v-card>
</template>

<script>
import * as THREE from "@/assets/libs/three";
import store from "@/store";
import * as utils from "../utils";

const STATE = {
  waitC: Symbol("waitC"),
  drawingC: Symbol("drawingC"),
  done: Symbol("done"),
  showAnswer: Symbol("showAnswer"),
};

export default {
  data() {
    return {
      showMenu: false,
      showAnswer: false,
      x: 0,
      y: 0,
      lightness: Array(11),
    };
  },

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
      this.camera = new THREE.PerspectiveCamera(90, 0, 0.001, 10000);
      this.camera.position.set(0, 0, -5);
      this.camera.lookAt(0, 0, 0);

      this.subscene = new THREE.Scene();

      this.lightDirection = new THREE.Vector3();
      this.light = new THREE.DirectionalLight(0xffffff);
      this.arrow = new THREE.ArrowHelper(
        this.lightDirection.normalize(),
        new THREE.Vector3(0, 0, 0),
        3,
        0x9c27b0
      );
      this.subscene.add(this.light);
      this.subscene.add(this.arrow);
      this.subscene.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(1, 100, 100),
          new THREE.MeshPhongMaterial({ shininess: 0 })
        )
      );

      this.subcamera = new THREE.PerspectiveCamera(90, 1, 0.001, 10000);
      this.subcamera.position.set(0, 0, -5);
      this.subcamera.lookAt(0, 0, 0);
      this.subrenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      document
        .querySelector(".subcanvas-container")
        .appendChild(this.subrenderer.domElement);
      this.subrenderer.setSize(200, 200);

      this.raycaster = new THREE.Raycaster();
      scene.add(this.camera);
      this.$on("next", this.next);
      this.$on("reset", this.reset);
      this.$on("undo", this.undo);
      this.$on("redo", this.redo);
      this.$on("show-answer", this.showAndHideAnswer);
    },

    next() {
      this.$emit("beforeNext");
      this.destroy();
      this.showAnswer = false;
      this.state = STATE.waitC;
      this.objs = utils.createBoxAndSphereGeometry(3, 2);
      this.lightDirection = new THREE.Vector3(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      this.arrow.setDirection(this.lightDirection.normalize());
      this.light.position.copy(this.lightDirection);
    },
    update(time) {
      let { width, height, scene, renderer } = store.getters;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      renderer.render(scene, this.camera);
      this.subrenderer.render(this.subscene, this.subcamera);
    },
    destroy() {
      utils.removeObjects(scene, [...scene.children]);
    },
    handleDown({ offsetX, offsetY, clientX, clientY }) {
      let { width, height } = store.getters;
      let point = new utils.Point({
        paperX: offsetX - width / 2,
        paperY: -offsetY + height / 2,
      });

      this.raycaster.setFromCamera(
        new THREE.Vector2(
          (offsetX / width) * 2 - 1,
          -(offsetY / height) * 2 + 1
        ),
        this.camera
      );
      let intersects = this.raycaster.intersectObjects(this.objs, false);
      console.log(intersects);
      if (intersects.length > 0) {
        let { object, face, faceIndex } = intersects[0];
        this.selected_obj = object;
        this.faceIndex = faceIndex;
        // this.selected_faces = utils.findFacesInOneEdge(
        //   object.geometry.faces,
        //   face
        // );
        [this.x, this.y] = [clientX, clientY];

        console.log(object.geometry.attributes);
        this.showMenu = true;
      } else {
        this.showMenu = false;
      }
    },
    handleMove() {},
    handleClick(i) {
      this.selected_obj.geometry.groups[this.faceIndex].materialIndex = i;
      let sameEdgeFaceIndexs = utils.findFacesInOneEdge(
        this.selected_obj.geometry.attributes.position.array,
        this.faceIndex
      );
      sameEdgeFaceIndexs.forEach((v) => {
        this.selected_obj.geometry.groups[v].materialIndex = i;
        this.selected_obj.geometry.groups[v].answerIndex = i;
      });
    },
    showAndHideAnswer() {
      this.showAnswer = !this.showAnswer;
      this.objs.forEach((obj) => {
        obj.geometry.groups.forEach((face) => {
          // if (face.answerIndex) {
          if (this.showAnswer) {
            let points = obj.geometry.attributes.position.array;
            let plane = new THREE.Plane().setFromCoplanarPoints(
              new THREE.Vector3(
                ...points.slice(face.start * 3, face.start * 3 + 3)
              ),
              new THREE.Vector3(
                ...points.slice(face.start * 3 + 3, face.start * 3 + 6)
              ),
              new THREE.Vector3(
                ...points.slice(face.start * 3 + 6, face.start * 3 + 9)
              )
            );
            face.materialIndex = Math.round(
              Math.max(
                Math.cos(plane.normal.angleTo(this.lightDirection)) * 10,
                0
              )
            );
          } else {
            if (face.answerIndex) {
              face.materialIndex = face.answerIndex;
            } else {
              face.materialIndex = 10;
            }
          }
          // console.log(face.materialIndex);
          // }
        });
      });
    },
  },
};
</script>

<style>
.menu-item {
  border: 1px solid rgba(0, 0, 0, 0);
}

.menu-item:hover {
  border: 1px solid rgb(156, 39, 176);
}
</style>
