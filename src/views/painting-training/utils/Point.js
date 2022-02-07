const THREE = require("three");
import store from "@/store";
import Line from "./Line"
import PointObject from "./PointObject";

export default class Point extends THREE.Vector2 {
  _angleX;
  _angleY;
  _hidden;

  get angleX() {
    return this._angleX
  }

  set angleX(v) {
    this._angleX = v
    this.update()
  }

  get angleY() {
    return this._angleY
  }

  set angleY(v) {
    this._angleY = v
    this.update()
  }

  get angleO() {
    return Math.atan(this.length()) * 180 / Math.PI
  }

  get x() {
    return Math.tan(this.angleX / 180 * Math.PI)
  }

  set x(v) {
    this.angleX = Math.atan(v) / Math.PI * 180
  }

  get y() {
    return Math.tan(this.angleY / 180 * Math.PI)
  }

  set y(v) {
    this.angleY = Math.atan(v) / Math.PI * 180
  }

  get paperX() {
    return this.x * store.getters.scale
  }

  set paperX(v) {
    this.x = v / store.getters.scale
  }

  get paperY() {
    return this.y * store.getters.scale
  }

  set paperY(v) {
    this.y = v / store.getters.scale
  }

  get hidden() {
    return this._hidden
  }

  set hidden(v) {
    this._hidden = v
    this.update()
  }

  constructor({
    angleX,
    angleY,
    x,
    y,
    paperX,
    paperY,
    color = 0x0,
    hidden = true,
    size = 3
  }) {
    super()
    this.point = new PointObject({ color, hidden, size })
    if (angleX !== undefined && angleY !== undefined) {
      [this.angleX, this.angleY] = [angleX, angleY]
    } else if (x !== undefined && y !== undefined) {
      [this.x, this.y] = [x, y]
    } else if (paperX !== undefined && paperY !== undefined) {
      [this.paperX, this.paperY] = [paperX, paperY]
    }
    this.hidden = hidden
  }

  update() {
    if (this.point && this.paperX !== undefined && this.paperY !== undefined) {
      this.point.point = this
      this.point.color = this.color
      this.point.hidden = this.hidden
    }
  }

  perpendicularLine() {
    return new Line({
      A: this.x,
      B: this.y,
      C: 1,
      hidden: true,
    })
  }

  perpendicularPoint() {
    return this.perpendicularLine().verticalPoint
  }

  vanishingLine() {
    return new Line({
      verticalPoint: this,
      hidden: true,
    })
  }

  closerPoint(...points) {
    return points.sort((a, b) => this.distanceTo(a) - this.distanceTo(b))[0]
  }

  fartherPoint(...points) {
    return points.sort((a, b) => this.distanceTo(b) - this.distanceTo(a))[0]
  }

  paperLength() {
    return Math.sqrt(this.paperX ** 2 + this.paperY ** 2)
  }

  toPaperArray() {
    return [this.paperX, this.paperY]
  }

  static randomWithConstraint(constraint) {
    return new Point({
      angleX: (Math.random() - 0.5) * (constraint / 90) * 180,
      angleY: (Math.random() - 0.5) * (constraint / 90) * 180
    })
  }

  static random() {
    return Point.randomWithConstraint(90)
  }

  clone() {
    return new Point({ angleX: this.angleX, angleY: this.angleY, color: this.color, hidden: this.hidden, size: this.size })
  }

  toPaperVector() {
    return new THREE.Vector2(this.paperX, this.paperY)
  }

  destroy() {
    this.point?.destroy()
    this.point = null
  }
}
