import store from "@/store";
import Point from "./Point"

export default class Line {
  _pointA;
  _pointB;
  _hidden;
  _color;
  startWithA;
  endWithB;
  line;

  get A() {
    return this.pointB.y - this.pointA.y
  }

  get B() {
    return this.pointA.x - this.pointB.x
  }

  get C() {
    return (this.pointA.y * (this.pointB.x - this.pointA.x)) - (this.pointA.x * (this.pointB.y - this.pointA.y))
  }

  get verticalPoint() {
    let { A, B, C } = this
    return new Point({ x: -(A * C) / (A * A + B * B), y: -(B * C) / (A * A + B * B) })
  }

  set verticalPoint(point) {
    let [A, B, C] = [point.x, point.y, -(point.x ** 2 + point.y ** 2)]
    this.pointA = new Point({ x: (-B * store.getters.top - C) / A, y: store.getters.top })
    this.pointB = new Point({ x: (-B * store.getters.bottom - C) / A, y: store.getters.bottom })
    this.update()
  }

  get pointA() {
    return this._pointA
  }

  set pointA(v) {
    this._pointA = v
    this.update()
  }

  get pointB() {
    return this._pointB
  }

  set pointB(v) {
    this._pointB = v
    this.update()
  }

  get hidden() {
    return this._hidden
  }

  set hidden(v) {
    this._hidden = v
    this.line.hidden = v
  }

  get color() {
    return this._color
  }

  set color(v) {
    this._color = v
    this.update()
  }

  constructor({ verticalPoint, pointA, pointB, startWithA = false, endWithB = false, A, B, C, color = 0x0, hidden = false }) {
    [this.startWithA, this.endWithB] = [startWithA, endWithB];
    this.line = new LineObject({ color, hidden })
    if (verticalPoint !== undefined) {
      this.verticalPoint = verticalPoint;
    } else if (A !== undefined && B !== undefined && C !== undefined) {
      this.pointA = new Point({ x: (-B * store.getters.top - C) / A, y: store.getters.top });
      this.pointB = new Point({ x: (-B * store.getters.bottom - C) / A, y: store.getters.bottom });
    } else if (pointA !== undefined && pointB !== undefined) {
      [this.pointA, this.pointB] = [pointA.clone(), pointB.clone()];
    }
    this.hidden = hidden;
    this.color = color;
  }

  update() {
    let { start, end } = this.calculateWhereToShow()
    if (this.line) {
      [this.line.start, this.line.end] = [start, end];
      this.line.color = this.color;
    }
  }

  perpendicularPoint() {
    return this.verticalPoint.perpendicularPoint()
  }

  calculateWhereToShow() {
    let [start, end] = [this.pointA?.clone(), this.pointB?.clone()]

    if (!start || !end)
      return {}

    let [pointAtTop, pointAtBottom] = [this.pointByY(store.getters.top), this.pointByY(store.getters.bottom)]
    if (!this.startWithA && !this.endWithB)
      [start, end] = [pointAtTop, pointAtBottom]
    else if (this.startWithA && !this.endWithB) {
      let v1 = pointAtTop.clone().sub(pointAtBottom)
      let v2 = end.sub(start)
      if (v1.dot(v2) > 0) {
        end = pointAtTop
      } else {
        end = pointAtBottom
      }
    }
    return { start, end }
  }

  intersection(line) {
    let { A: A1, B: B1, C: C1 } = this
    let { A: A2, B: B2, C: C2 } = line
    let x = (B1 * C2 - B2 * C1) / (A1 * B2 - A2 * B1)
    return this.pointByX(x)
  }

  pointsSameSide(...points) {
    return points.reduce((preV, v) => preV * (this.A * v.x + this.B * v.y + this.C), 1) > 0
  }

  pointByPaperX(paperX) {
    return new Point({ paperX, paperY: (-this.A * paperX - this.C) / this.B })
  }

  pointByPaperY(paperY) {
    return new Point({ paperX: (-this.B * paperY - this.C) / this.A, paperY })
  }

  pointByX(x) {
    return new Point({ x, y: (-this.A * x - this.C) / this.B })
  }

  pointByY(y) {
    return new Point({ x: (-this.B * y - this.C) / this.A, y })
  }

  angulationPointToPointInLine(point, directionPoint, angle) {
    let distanceToO = this.verticalPoint.length()
    let k = - this.B / this.A
    let x = Math.sqrt(1 / (1 + k ** 2))
    let distancePoint = new Point({ x, y: k * x })
    if (distanceToO > 0) {
      distancePoint = this.verticalPoint.clone().multiplyScalar(- ((1 / Math.cos(this.verticalPoint.angleO / 180 * Math.PI) - distanceToO) / distanceToO))
    }
    return this.intersection(new Line({ pointA: distancePoint, pointB: point, hidden: true }).angulationLineByPoint(distancePoint, directionPoint, angle))
  }

  angulationLineByPoint(point, directionPoint, angle) {
    let k = - this.A / this.B
    let tan = Math.tan(angle / 180 * Math.PI)
    let k1 = (k - tan) / (1 + k * tan)
    let k2 = (k + tan) / (1 - k * tan)
    let b1 = point.y - point.x * k1
    let b2 = point.y - point.x * k2
    let line1 = new Line({ A: k1, B: -1, C: b1, startWithA: true, endWithB: true, hidden: true })
    let line2 = new Line({ A: k2, B: -1, C: b2, startWithA: true, endWithB: true, hidden: true })
    return line1.distanceTo(directionPoint) < line2.distanceTo(directionPoint) ? line1 : line2
  }

  distanceTo(point) {
    return Math.abs(this.A * point.x + this.B * point.y + this.C) / Math.sqrt(this.A ** 2 + this.B ** 2)
  }

  randomPoint() {
    return this.pointByX(Math.tan((Math.random() - 0.5) * Math.PI))
  }

  inclinationToLine(line) {
    let k1 = - this.A / this.B
    let k2 = - line.A / line.B
    return Math.atan(Math.abs((k1 - k2) / (1 + k1 * k2))) / Math.PI * 180
  }

  destroy() {
    this.line?.destroy()
    this.line = null
  }
}
