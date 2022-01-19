const THREE = require("three");
import store from "@/store";

THREE.Vector2.prototype.toPaperPoint = function () {
  return new THREE.Vector2(this.x, this.y).multiplyScalar(store.getters.height / 2);
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


export function Line(start, end, color = 0x0) {
  let ma = new THREE.LineBasicMaterial({
    color: color,
  })
  let line = new THREE.BufferGeometry();
  line.attributes.position = new THREE.BufferAttribute(new Float32Array([
    start.x, start.y, 0,
    end.x, end.y, 0,
  ]), 3);
  return new THREE.Line(line, ma);
}

export function showObjects(scene, objs) {
  objs.forEach(v => scene.add(v))
}

export function removeObjects(scene, objs) {
  objs.forEach(v => scene.remove(v))
}

// 传入射线起始点、要经过的视图上的点，返回要经过整个视图的射线
export function RayLine(start, over, color = 0x0) {
  let v1 = over.sub(start)
  let v2 = v1.multiplyScalar(1 + (Math.sqrt(Math.pow(store.getters.width, 2) + Math.pow(store.getters.height, 2)) / v1.length()))
  return new Line(start, v2.add(start), color)
}

class VanishingPoint extends THREE.Vector2 {
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
    this.angleX = Math.atan(v)
  }

  get y() {
    return Math.tan(this.angleY / 180 * Math.PI)
  }

  set y(v) {
    this.angleY = Math.atan(v)
  }

  constructor({
    angleX,
    angleY,
    x,
    y
  }) {
    super()
    if (angleX && angleY) {
      this.angleX = angleX
      this.angleY = angleY
    } else if (x && y) {
      this.x = x
      this.y = y
    }
  }

  perpendicularLine() {
    return new VanishingLine({A: this.x, B: this.y, C: 1})
  }

  perpendicularPoint() {
    return this.perpendicularLine().verticalPoint()
  }

  vanishingLine() {
    return new VanishingLine({
      verticalPoint: this
    })
  }
}

class VanishingLine {
  A;
  B;
  C;

  get verticalPoint() {
    let {A, B, C} = this
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
    A,
    B,
    C,
    color=0x0
  }) {
    if (verticalPoint) {
      this.verticalPoint = verticalPoint
    } else if (A && B && C) {
      [this.A, this.B, this.C] = [A, B, C]
    } else if (pointA && pointB) {
      this.A = (pointB.y - pointA.y)
      this.B = -(pointB.x - pointA.x)
      this.C = (pointA.y * (pointB.x - pointA.x)) - (pointA.x * (pointB.y - pointA.y))
    }
  }

  get lineObj(){
    
  }
}

let x = new VanishingPoint({
  x: 89.9999,
  y: 89.9999
})
console.log(x, x.length());
