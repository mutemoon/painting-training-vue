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



export class Point extends THREE.Vector2 {
  angleX;
  angleY;

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


  constructor({
    angleX,
    angleY,
    x,
    y,
    paperX,
    paperY,
  }) {
    super()
    if (angleX !== undefined && angleY !== undefined) {
      [this.angleX, this.angleY] = [angleX, angleY]
    } else if (x !== undefined && y !== undefined) {
      [this.x, this.y] = [x, y]
    } else if (paperX !== undefined && paperY !== undefined) {
      [this.paperX, this.paperY] = [paperX, paperY]
    }
  }

  perpendicularLine() {
    return new Line({
      A: this.x,
      B: this.y,
      C: 1
    })
  }

  perpendicularPoint() {
    return this.perpendicularLine().verticalPoint
  }

  vanishingLine() {
    return new Line({
      verticalPoint: this
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
}


export class Line {
  _pointA;
  _pointB;
  startWithA;
  endWithB;
  line;

  get A() {
    return this.pointA.y - this.pointB.y
  }

  get B() {
    return this.pointA.x - this.pointB.x
  }

  get C() {
    return (this.pointA.y * (this.pointB.x - this.pointA.x)) - (this.pointA.x * (this.pointB.y - this.pointA.y))
  }

  get verticalPoint() {
    let {
      A,
      B,
      C
    } = this
    return new Point({
      x: -(A * C) / (A * A + B * B),
      y: -(B * C) / (A * A + B * B)
    })
  }

  set verticalPoint(point) {
    let [A, B, C] = [point.paperX, point.paperY, -Math.pow(point.paperLength(), 2)]
    this.pointA = new Point({
      paperX: (-B * (store.getters.height / 2) - C) / A,
      paperY: store.getters.height / 2
    })
    this.pointB = new Point({
      paperX: (B * (store.getters.height / 2) - C) / A,
      paperY: -store.getters.height / 2
    })
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

  constructor({
    verticalPoint,
    pointA,
    pointB,
    startWithA = false,
    endWithB = false,
    A,
    B,
    C,
    color = 0x0,
    hidden = false,
  }) {
    [this.startWithA, this.endWithB] = [startWithA, endWithB];
    this.line = new LineObject({
      color,
      hidden
    })
    if (verticalPoint !== undefined) {
      this.verticalPoint = verticalPoint;
    } else if (A !== undefined && B !== undefined && C !== undefined) {
      this.pointA = new Point({paperX: (-B * (store.getters.height / 2) - C) / A, paperY: store.getters.height / 2});
      console.log(this.PointA);
      this.pointB = new Point({paperX: (B * (store.getters.height / 2) - C) / A, paperY: -store.getters.height / 2});
    } else if (pointA !== undefined && pointB !== undefined) {
      [this.pointA, this.pointB] = [pointA, pointB];
    }
  }

  update() {
    let {
      start,
      end
    } = this.calculateWhereToShow()
    if (this.line) {
      this.line.start = start
      this.line.end = end
      // console.log(start, end);
    }
  }

  calculateWhereToShow() {
    let {
      pointA: start,
      pointB: end
    } = this
    if (!start || !end) {
      return {}
    }

    let [pointAtTop, pointAtBottom] = [this.pointByPaperY(store.getters.height / 2), this.pointByPaperY(-store.getters.height / 2)]
    if (!this.startWithA && !this.endWithB) {
      start = pointAtTop
      end = pointAtBottom
    } else if (this.startWithA && !this.endWithB) {
      end = this.pointA.fartherPoint(pointAtTop, pointAtBottom)
    }
    return {
      start,
      end
    }
  }

  intersection(line) {

    let {A: A1, B: B1, C: C1} = this
    let {A: A2, B: B2, C: C2} = line
    console.log(A1, A2, B1, B2, C1, C2);
    let x = (B1 * C2 - B2 * C1) / (A1 * B2 - A2 * B1)
    return this.pointByX(x)
  }

  pointByPaperX(paperX) {
    return new Point({
      paperX,
      paperY: (-this.A * paperX - this.C) / this.B
    })
  }

  pointByPaperY(paperY) {
    return new Point({
      paperX: (-this.B * paperY - this.C) / this.A,
      paperY,
    })
  }

  pointByX(x) {
    return new Point({
      x,
      y: (-this.A * x - this.C) / this.B
    })
  }

  pointByY(y) {
    return new Point({
      x: (-this.B * y - this.C) / this.A,
      y,
    })
  }
}

export class LineObject {
  color;
  _start;
  _end;
  obj;
  hidden;

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

  constructor({
    start = undefined,
    end = undefined,
    color = 0x0,
    hidden = false,
  }) {
    this.color = color
    let material = new THREE.LineBasicMaterial({
      color
    })
    let geometry = new THREE.BufferGeometry();
    geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(6), 3);
    this.obj = new THREE.Line(geometry, material);
    store.getters.scene.add(this.obj);
    this.hidden = hidden
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
    }
  }

  toLogic() {
    return new LogicLine(this.start.toLogicPoint(), this.end.toLogicPoint(), this.color)
  }
}

export class LogicLine extends LineObject {
  constructor(...arg) {
    super(...arg)
  }

  update() {
    if (this.obj) {
      let array;
      if (this._start && this._end) {
        array = new Float32Array([
          ...this._start.toPaperPoint().toArray(),
          0,
          ...this._end.toPaperPoint().toArray(),
          0,
        ]);
      } else {
        array = new Float32Array(6)
      }
      this.obj.geometry.attributes.position.array = array;
      this.obj.geometry.attributes.position.needsUpdate = true;
    }
  }
}

// 传入射线起始点、要经过的视图上的点，返回要经过整个视图的射线
export class RayLine extends LogicLine {
  constructor(start, over, color = 0x0) {
    super(color = color)
    this.start = start
    let v = over.sub(start)
    this.end = v.multiplyScalar(1 + (new THREE.Vector2(store.getters.width, store.getters.height).length() / v.length())).add(start)
  }
}
