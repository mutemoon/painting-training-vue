<template>
  <div class="double-lines-parallel"></div>
</template>

<script>
import { mapActions } from "vuex";
const THREE = require("three");
import store from "@/store";

export default {
  data() {
    return {};
  },
  mounted() {
    const scene = store.getters.scene;

    // let camera, renderer;
    // let geometry, material, mesh;
    // let width, height;
    // [width, height] = [this.$el.offsetWidth, this.$el.offsetHeight];
    // camera = new THREE.OrthographicCamera(
    //   ...[width / -2, width / 2, height / 2, height / -2], 
    //   1,
    //   1000
    // );
    // camera.position.set(0, 0, -1);
    // camera.lookAt(0, 0, 0);
    // window.camera = camera;

    // geometry = new THREE.BoxGeometry(0, 0, 0);
    // material = new THREE.MeshNormalMaterial();

    // mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);
    // scene.add(camera);
    // renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // renderer.setAnimationLoop(animation.bind(this));
    // document
    //   .querySelector(".double-lines-parallel")
    //   .appendChild(renderer.domElement);

    // var dir = new THREE.Vector3(0, 1, 0);

    // //normalize the direction vector (convert to vector of length 1)
    // dir.normalize();

    // var origin = new THREE.Vector3(0, 0, 0);
    // var length = 100000;
    // var hex = 0x000000;

    // var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    // scene.add(arrowHelper);
    // function animation(time) {
    //   [width, height] = [this.$el.offsetWidth, this.$el.offsetHeight];
    //   renderer.setSize(width, height);
    //   [camera.left, camera.right, camera.top, camera.bottom] = [
    //     width / 2,
    //     width / -2,
    //     height / 2,
    //     height / -2,
    //   ];
    //   camera.updateProjectionMatrix();
    //   mesh.rotation.x = time / 2000;
    //   mesh.rotation.y = time / 1000;

    //   renderer.render(scene, camera);
    // }
    // console.log(store.getters.scene);
  },
  methods: {
    ...mapActions(["setScene"]),
  },
};
</script>

<style scoped>
.double-lines-parallel {
  width: 100%;
  height: 100%;
  border-radius: 1em;
  box-shadow: 0px 0px 5px #aaaaaa;
}
</style>
