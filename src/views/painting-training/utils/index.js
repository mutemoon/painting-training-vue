const THREE = require("three");
import store from "@/store";

THREE.Vector2.prototype.toPaperPoint = function () {
  return new THREE.Vector2(this.x, this.y).multiplyScalar(store.getters.scale);
}

THREE.Vector2.prototype.toLogicPoint = function () {
  return new THREE.Vector2(this.x, this.y).divideScalar(store.getters.scale);
}

export function random_logic_point() {
  let angle_x = (Math.random() - 0.5) * Math.PI;
  let angle_y = (Math.random() - 0.5) * Math.PI;
  return new THREE.Vector2(Math.tan(angle_x), Math.tan(angle_y));
}

// 根据逻辑上消失点生成垂直于该点的逻辑上消失线
export function perpendicular_logic_point(point) {

  // return new VanishingPoint()
}

export function random_constraint_logic_point(constraint) {
  let angle_x = (Math.random() - 0.5) * (constraint / 90) * Math.PI;
  let angle_y = (Math.random() - 0.5) * (constraint / 90) * Math.PI;
  return new THREE.Vector2(Math.tan(angle_x), Math.tan(angle_y));
}

export function showObjects(scene, objs) {
  objs.forEach(v => scene.add(v))
}

export function removeObjects(scene, objs) {
  objs.forEach(v => scene.remove(v))
}