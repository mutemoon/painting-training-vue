import store from "@/store";
import ThreeObject from "./ThreeObject"
const THREE = require("three");

export default class PlaneObject extends ThreeObject {
  _path;
  _color;
  obj;

  get path() {
    return this._path
  }

  set path(v) {
    this._path = v
    this.update()
  }

  get color() {
    return this._color
  }

  set color(v) {
    this._color = v
    this.update()
  }

  constructor({ path, color = 0x0 }) {
    super()
    let geometry = new THREE.BufferGeometry();
    let material = new THREE.LineBasicMaterial({ color });
    this.obj = new THREE.Line(geometry, material);
    this.obj.source = this
    store.getters.scene.add(this.obj);
    this.path = path
    this.color = color
  }

  update() {
    if (this.path) {
      let points = new THREE.Path(this.path.map((v, i) => (i > 0 ? v.clone() : v).toPaperVector())).getPoints();
      this.obj.geometry.setFromPoints(points);
    } else {
      this.obj.geometry.setFromPoints([])
    }

    if (this.color) {
      this.obj.material.color = new THREE.Color(this.color);
      this.obj.material.needsUpdate = true;
    }
  }
}
