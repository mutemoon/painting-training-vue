import store from "@/store";


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