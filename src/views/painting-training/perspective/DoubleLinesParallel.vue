<template>
  <div class="double-lines-parallel"></div>
</template>

<script>
const THREE = require("three");

let camera, scene, renderer;
let geometry, material, mesh;
let width, height;

function init() {
  [width, height] = [this.$el.offsetWidth, this.$el.offsetHeight];
  camera = new THREE.OrthographicCamera(
    ...[width / -2, width / 2, height / 2, height / -2],
    1,
    1000
  );
  camera.position.set(0, 0, -1);
  camera.lookAt(0, 0, 0);
  window.camera = camera;
  scene = new THREE.Scene();

  geometry = new THREE.BoxGeometry(0, 0, 0);
  material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh(geometry, material);
  window.scene = scene;
  scene.add(mesh);
  scene.add(camera);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setAnimationLoop(animation.bind(this));
  document
    .querySelector(".double-lines-parallel")
    .appendChild(renderer.domElement);

  var dir = new THREE.Vector3(0, 1, 0);

  //normalize the direction vector (convert to vector of length 1)
  dir.normalize();

  var origin = new THREE.Vector3(0, 0, 0);
  var length = 100000;
  var hex = 0x000000;

  var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
  scene.add(arrowHelper);
}

function animation(time) {
  [width, height] = [this.$el.offsetWidth, this.$el.offsetHeight];
  renderer.setSize(width, height);
  [camera.left, camera.right, camera.top, camera.bottom] = [
    width / 2,
    width / -2,
    height / 2,
    height / -2,
  ];
  camera.updateProjectionMatrix();
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;

  renderer.render(scene, camera);
}
export default {
  data() {
    return {};
  },
  mounted() {
    init.call(this);
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
