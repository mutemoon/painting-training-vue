
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
  