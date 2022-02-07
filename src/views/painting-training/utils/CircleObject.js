const THREE = require("three");
import store from "@/store";
import ThreeObject from "./ThreeObject"

export default class CircleObject extends ThreeObject {
  _centre;
  _r;
  _color;
  source;

  get centre() {
    return this._centre
  }

  set centre(v) {
    this._centre = v
    this.update()
  }

  get r() {
    return this._r
  }

  set r(v) {
    this._r = v
    this.update()
  }

  get color() {
    return this._color
  }

  set color(v) {
    this._color = v
    this.update()
  }

  constructor({
    centre,
    r,
    color = 0xc3c3c3
  }) {
    super()
    let curvePoints = new THREE.EllipseCurve(
      0, 0, // ax, aY
      0, 0, // xRadius, yRadius
      0, 2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    ).getPoints(50);
    let geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    let material = new THREE.LineDashedMaterial({ color });
    this.obj = new THREE.LineLoop(geometry, material);
    this.obj.source = this
    store.getters.scene.add(this.obj)
    if (centre !== undefined && r !== undefined)
      [this.centre, this.r] = [centre, r];
    this.color = color;
  }

  update() {
    if (this.centre !== undefined && this.r !== undefined) {
      let curvePoints = new THREE.EllipseCurve(
        this.centre.paperX, this.centre.paperY, // ax, aY
        this.r * store.getters.scale, this.r * store.getters.scale, // xRadius, yRadius
        0, 2 * Math.PI, // aStartAngle, aEndAngle
        false, // aClockwise
        0 // aRotation
      ).getPoints(50);
      this.obj.geometry.setFromPoints(curvePoints);
    } else {
      this.obj.geometry.setFromPoints([])
    }

    if (this.color) {
      this.obj.material.color = new THREE.Color(this.color)
      this.obj.material.needsUpdate = true;
    }
  }
}

