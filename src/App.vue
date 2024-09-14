<template>
  <div class="flex items-center justify-center w-full h-screen">
    <div ref="container" class="w-full h-full" @click="handleClick"></div>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding } from "@vueuse/core";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { ref, onMounted } from "vue";

// 引用容器的 DOM 节点
const container = ref<HTMLDivElement | null>(null);

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 2;

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  // alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 设置环境光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // 环境光
scene.add(ambientLight);

// 设置点光源
const pointLight = new THREE.PointLight(0xffffff, 100); // 点光源
pointLight.position.set(0, 4, 4);
scene.add(pointLight);

const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 100, 100), new THREE.MeshPhongMaterial({ shininess: 0 }));
mesh.translateX(2.5);
scene.add(mesh);

// 加载 GTLF 模型
const gltfLoader = new GLTFLoader();
gltfLoader.load("/scene.gltf", (gltf) => {
  const mesh = gltf.scene.children[0].children[0].children[1].children[0] as THREE.Mesh;
  mesh.rotateX(-Math.PI / 2);

  // 获取几何体
  const geometry = mesh.geometry;

  // 确保几何体已经有面索引
  if (!geometry.index) {
    throw new Error("没有索引");
  }

  // 为每个面创建一个组
  const faceCount = geometry.index.count / 3;
  for (let i = 0; i < faceCount; i++) {
    geometry.addGroup(i * 3, 3, 10); // 使用10种不同的材质
  }

  // 创建11种不同颜色的基础材质
  const materials = Array.from({ length: 11 }).map(
    (_v, i) =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(i / 10, i / 10, i / 10),
      })
  );
  mesh.material = materials;

  mesh.userData.isFace = true;

  mesh.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 156 * 0x10000 + 39 * 0x100 + 176 })
    )
  );
  scene.add(mesh);
});

const raycaster = new THREE.Raycaster();

const { width, height } = useElementBounding(container);

const handleClick = (event: MouseEvent) => {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / width.value) * 2 - 1;
  mouse.y = -(event.clientY / height.value) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersect = raycaster.intersectObjects(scene.children).find((v) => v.object.userData.isFace);
  if (!intersect) return;
  const { object, faceIndex } = intersect as THREE.Intersection<THREE.Mesh>;
  if (faceIndex === undefined) return;
  if (!object.userData.isFace) return;
  object.geometry.groups[faceIndex].materialIndex = 1;
};

onMounted(() => {
  if (container.value) {
    container.value.appendChild(renderer.domElement);
  }

  // 渲染循环
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  // 调整窗口大小
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
</script>

<style scoped>
/* 确保容器全屏 */
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
