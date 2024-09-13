<template>
  <div class="flex items-center justify-center w-full h-screen">
    <div ref="container" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { ref, onMounted } from "vue";

// 引用容器的 DOM 节点
const container = ref<HTMLDivElement | null>(null);

onMounted(() => {
  // 创建场景
  const scene = new THREE.Scene();

  // 创建相机
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (container.value) {
    container.value.appendChild(renderer.domElement);
  }

  // 添加轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);

  // 设置环境光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 环境光
  scene.add(ambientLight);

  // 设置点光源
  const pointLight = new THREE.PointLight(0xffffff, 1); // 点光源
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // 创建材质
  const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff }); // 白色材质

  // 加载 OBJ 模型
  const objLoader = new OBJLoader();
  objLoader.load("/head.obj", (object) => {
    object.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = whiteMaterial; // 给模型应用白色材质
      }
    });
    scene.add(object);
  });

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
