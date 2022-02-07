const THREE = require("three");
import ThreeObject from "./ThreeObject"

export default class LineObject extends ThreeObject {
  color;
  _start;
  _end;
  _hidden;
  obj;

  get start() {
    return this._start
  }

  set start(v) {
    this._start = v
    this.update()
  }

  get end() {
    return this._end
  }

  set end(v) {
    this._end = v
    this.update()
  }

  get hidden() {
    return this._hidden
  }

  set hidden(v) {
    this._hidden = v
    this.update()
  }

  constructor({
    start = undefined,
    end = undefined,
    color = 0x0,
    hidden = false,
  }) {
    super()
    this.color = color
    this.hidden = hidden;
    let material = new THREE.LineBasicMaterial({
      color
    })
    let geometry = new THREE.BufferGeometry();
    geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(6), 3);
    this.obj = new THREE.Line(geometry, material);
    this.obj.source = this
    store.getters.scene.add(this.obj);
    [this.start, this.end] = [start, end];
  }

  update() {
    if (this.obj && !this.hidden) {
      let array;
      if (this.start && this.end) {
        array = new Float32Array([
          ...this.start.toPaperArray(),
          0,
          ...this.end.toPaperArray(),
          0,
        ]);
      } else {
        array = new Float32Array(6)
      }
      this.obj.geometry.attributes.position.array = array;
      this.obj.geometry.attributes.position.needsUpdate = true;

      if (this.color) {
        this.obj.material.color = new THREE.Color(this.color)
        this.obj.material.needsUpdate = true
      }
    }
  }
}
