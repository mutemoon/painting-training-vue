const THREE = require("three");
import store from "@/store";
import LineObject from "./LineObject"
import Point from "./Point"
import Line from "./Line"
import Color from "./Color"

function removeObjects(scene, objs) {
  objs.forEach(v => scene.remove(v))
}

export {
  removeObjects,
  LineObject,
  Point,
  Line,
  Color
}

window.Point = Point
window.Line = Line
window.LineObject = LineObject