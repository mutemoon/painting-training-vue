const THREE = require("three");
import store from "@/store";

THREE.Vector2.prototype.toPaperPoint = function () {
  return new THREE.Vector2(this.x, this.y).multiplyScalar(store.getters.height / 2);
}

export function random_logic_point() {
  let angle_x = (Math.random() - 0.5) * Math.PI;
  let angle_y = (Math.random() - 0.5) * Math.PI;
  return new THREE.Vector2(Math.tan(angle_x), Math.tan(angle_y));
}

export function random_constraint_logic_point (constraint) {
  let angle_x = (Math.random() - 0.5) * (constraint / 90) * Math.PI;
  let angle_y = (Math.random() - 0.5) * (constraint / 90) * Math.PI;
  return new THREE.Vector2(Math.tan(angle_x), Math.tan(angle_y));
}

export function Line (start, end, color=0x0) {
  let ma = new THREE.LineBasicMaterial({
      color: color,
  })
  let line = new THREE.BufferGeometry();
  line.attributes.position = new THREE.BufferAttribute(new Float32Array([
      start.x, start.y, 0,
      end.x, end.y, 0,
  ]), 3);
  return new THREE.Line(line, ma);
}

export function showObjects(scene, objs) {
  objs.forEach(v=>scene.add(v))
}

export function removeObjects(scene, objs) {
  objs.forEach(v=>scene.remove(v))
}

// 传入射线起始点、要经过的视图上的点，返回要经过整个视图的射线
export function RayLine(start, over, color=0x0) {
  let v1 = over.sub(start)
  let v2 = v1.multiplyScalar(1 + (Math.sqrt(Math.pow(store.getters.width, 2) + Math.pow(store.getters.height, 2)) / v1.length()))
  return new Line(start, v2.add(start), color)
}