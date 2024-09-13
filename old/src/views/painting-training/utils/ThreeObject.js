export default class ThreeObject {
  // obj;

  constructor() {}

  destroy() {
    this.obj.source = null
    this.obj?.parent?.remove(this.obj)
    this.obj = null
  }
}
