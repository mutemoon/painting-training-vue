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



export class VanishingPoint extends THREE.Vector2 {
  angleX;
  angleY;
  angleO;

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
    if (angleX && angleY) {
      this.angleX = angleX
      this.angleY = angleY
    } else if (x && y) {
      this.x = x
      this.y = y
    } else if (paperX && paperY) {
      this.paperX, this.paperY = paperX, paperY
    }
  }

  perpendicularLine() {
    return new VanishingLine({
      A: this.x,
      B: this.y,
      C: 1
    })
  }

  perpendicularPoint() {
    return this.perpendicularLine().verticalPoint
  }

  vanishingLine() {
    return new VanishingLine({
      verticalPoint: this
    })
  }

  closerPoint(...points) {
    return points.sort((a, b) => this.distanceTo(a) - this.distanceTo(b))[0]
  }

  fartherPoint(...points) {
    return points.sort((a, b) => this.distanceTo(b) - this.distanceTo(a))[0]
  }

  static randomWithConstraint(constraint) {
    return new VanishingPoint({
      angleX: (Math.random() - 0.5) * (constraint / 90) * 180,
      angleY: (Math.random() - 0.5) * (constraint / 90) * 180
    })
  }

  static random() {
    return VanishingPoint.randomWithConstraint(90)
  }
}


export class VanishingLine {
  _start;
  _end;

  _controllA;
  _controllB;
  line;

  get A() {
    this.calculateWhereToShow()
    return this.get
  }

  set A(v) {

    this._A = v
    this.update()
  }

  get B() {
    return (this.pointB.y - this.pointA.y)
  }

  set B(v) {
    this._B = v
    this.update()
  }

  get C() {
    return this._C
  }

  set C(v) {
    this._C = v
    this.update()
  }

  get verticalPoint() {
    let {
      A,
      B,
      C
    } = this
    return new VanishingPoint({
      x: -(A * C) / (A * A + B * B),
      y: -(B * C) / (A * A + B * B)
    })
  }

  set verticalPoint(point) {
    this.A = point.x
    this.B = point.y
    this.C = -Math.pow(point.length(), 2)
  }

  constructor({
    verticalPoint,
    pointA,
    pointB,
    startWithA=true,
    endWithB=true,
    A,
    B,
    C,
    color = 0x0
  }) {
    this.line = new LineObject(color = color)
    if (verticalPoint) {
      this.verticalPoint = verticalPoint
    } else if (A && B && C) {
      [this.A, this.B, this.C] = [A, B, C]
    } else if (pointA && pointB) {
      this.A = (pointB.y - pointA.y)
      this.B = -(pointB.x - pointA.x)
      this.C = (pointA.y * (pointB.x - pointA.x)) - (pointA.x * (pointB.y - pointA.y))
    } else {
      [this.pointA, this.pointB, this.startWithA, this.endWithB] = [pointA, pointB, startWithA, endWithB]
    }
  }

  update() {
    let {start, end} = this.calculateWhereToShow()
    if (start && end && this.line) {
      this.line.start = start.toPaperPoint()
      this.line.end = end.toPaperPoint()
    }
  }

  calculateWhereToShow() {
    let [pointAtTop, pointAtBottom] = [this.at({
      y: store.getters.height / 2
    }), this.at({
      y: -store.getters.height / 2
    })]

    let {
      pointA: start,
      pointB: end
    } = this
    if (!this.startWithA && !this.startWithB) {
      start = pointAtTop
      end = pointAtBottom
    } else if (this.startWithA && !this.startWithB) {
      end = this.controllB.closerPoint([pointAtTop, pointAtBottom])
    }

    return {
      start,
      end
    }
  }

  intersection(line) {
    // this.
  }

  calcX(y) {
    return (-this.B * y - this.C) / this.A
  }

  calcY(x) {
    return (-this.A * x - this.C) / this.B
  }

  at({
    x,
    y
  }) {
    if (x) {
      return VanishingPoint({
        x,
        y: this.calcY(x)
      })
    } else if (y) {
      return VanishingPoint({
        x: this.calcX(y),
        y
      })
    }
  }
}

export class LineObject {
  color;
  _start;
  _end;
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

  constructor(start = null, end = null, color = 0x0) {
    this.color = color
    let material = new THREE.LineBasicMaterial({
      color
    })
    let geometry = new THREE.BufferGeometry();
    geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(6), 3);
    this.obj = new THREE.Line(geometry, material);
    store.getters.scene.add(this.obj)

    [this.start, this.end] = [start, end]
  }

  update() {
    if (this.obj) {
      let array;
      if (this._start && this._end) {
        array = new Float32Array([
          ...this._start.toArray(),
          0,
          ...this._end.toArray(),
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

export class LogicLine extends Line {
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
