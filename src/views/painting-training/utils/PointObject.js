import * as THREE from "@/assets/libs/three";
import store from "@/store";
import ThreeObject from "./ThreeObject"

export default class PointObject extends ThreeObject {
  _point;
  _color;
  _hidden;
  obj;

  get point() {
    return this._point;
  }

  set point(v) {
    this._point = v;
    this.update();
  }

  get color() {
    return this._color;
  }

  set color(v) {
    this._hidden = v;
    this.update();
  }

  get hidden() {
    return this._hidden;
  }

  set hidden(v) {
    this._hidden = v;
    this.update();
  }

  constructor({ point, color = 0x0, hidden = true, size = 3 }) {
    super()
    let geometry = new THREE.BufferGeometry().setFromPoints([]);
    let material = new THREE.PointsMaterial({ color, size })
    this.obj = new THREE.Points(geometry, material);
    this.obj.source = this
    store.getters.scene.add(this.obj);
    if (point)
      this.point = point;
    this.color = color;
    this.hidden = hidden;
  }

  update() {
    if (this.point && !this.hidden) {
      this.obj.geometry.setFromPoints([new THREE.Vector2(this.point.paperX, this.point.paperY)])
    } else {
      this.obj.geometry.setFromPoints([])
    }

    if (this.color) {
      this.obj.material.color = new THREE.Color(this.color)
      this.obj.material.needsUpdate = true
    }
  }
}
