const THREE = require("three");
import CircleObject from "./CircleObject";
import store from "@/store";


export default class Circle {
  _centre;
  _r;
  _color;

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
    this.circle = new CircleObject({
      centre: centre.clone(),
      r,
      color
    })
    if (centre && r) {
      [this.centre, this.r] = [centre.clone(), r];
    }
    this.color = color
  }

  update() {
    if (this.circle) {
      [this.circle.centre, this.circle.r] = [this.centre, this.r]
      this.circle.color = this.color
    }
  }

  destroy() {
    this.circle?.destroy()
    this.circle = null
  }
}
