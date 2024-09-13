import store from "@/store";
import Line from "./Line"
import Point from "./Point"
import * as THREE from "@/assets/libs/three";

export default class Plane {
  _vpA;
  _vpB;
  _controllA;
  _controllB;
  _color;

  get vpA() {
    return this._vpA;
  }

  set vpA(v) {
    this._vpA = v;
    this.update()
  }

  get vpB() {
    return this._vpB;
  }

  set vpB(v) {
    this._vpB = v;
    this.update()
  }

  get controllA() {
    return this._controllA;
  }

  set controllA(v) {
    this._controllA = v;
    this.update();
  }

  get controllB() {
    return this._controllB;
  }

  set controllB(v) {
    this._controllB = v;
    this.update();
  }

  get color() {
    return this._color
  }

  set color(v) {
    this._color = v
    this.update()
  }

  get path() {
    if (this.vpA && this.vpB && this.controllA && this.controllB) {
      let controllAAndVpA = new Line({ pointA: this.vpA, pointB: this.controllA, hidden: true });
      let controllBAndVpA = new Line({ pointA: this.vpA, pointB: this.controllB, hidden: true });
      let controllAAndVpB = new Line({ pointA: this.vpB, pointB: this.controllA, hidden: true });
      let controllBAndVpB = new Line({ pointA: this.vpB, pointB: this.controllB, hidden: true });
      return [this.controllA, controllAAndVpA.intersection(controllBAndVpB), this.controllB, controllBAndVpA.intersection(controllAAndVpB), this.controllA]
    }
    else {
      return null
    }
  }

  constructor({ vpA, vpB, controllA, controllB, color = 0x0, hidden = false }) {
    this.plane = new PlaneObject({ color, hidden });
    if (vpA && vpB && controllA && controllB) {
      [this.vpA, this.vpB, this.controllA, this.controllB] = [vpA, vpB, controllA, controllB]
    }
    this.color = color
  }

  randomPlane() {

  }

  vanishingLine() {
    return new Line({pointA: this.vpA, pointB: this.vpB, hidden: true});
  }

  perpendicularPoint() {
    return this.vanishingLine().perpendicularPoint()
  }

  perpendicularLine() {
    return this.perpendicularPoint().vanishingLine()
  }

  update() {
    if (this.plane) {
      this.plane.path = this.path
      this.plane.color = this.color
    }
  }

  static randomPlaneInView(vpA, vpB) {
    let vanishingLine = new Line({ pointA: vpA, pointB: vpB, hidden: true })
    let controllA = Point.randomWithConstraint(30)
    let controllB = Point.randomWithConstraint(30)
    while (!vanishingLine.pointsSameSide(controllA, controllB)) {
      controllA = Point.randomWithConstraint(30)
      controllB = Point.randomWithConstraint(30)
    }
    return new Plane({ vpA, vpB, controllA, controllB })
  }

  destroy() {
    this.plane.destroy()
    this.plane = null
  }
}
