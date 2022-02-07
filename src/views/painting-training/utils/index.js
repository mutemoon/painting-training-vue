const THREE = require("three");
import store from "@/store";
import PointObject from "./PointObject"
import LineObject from "./LineObject"
import CircleObject from "./CircleObject";
import Point from "./Point"
import Line from "./Line"
import Circle from "./Circle";
import Color from "./Color"
import Plane from "./Plane"
import PlaneObject from "./PlaneObject"


function removeObjects(scene, objs) {
  objs.forEach(v => scene.remove(v))
}

export {
  removeObjects,
  PointObject,
  LineObject,
  CircleObject,
  PlaneObject,
  Point,
  Line,
  Circle,
  Plane,
  Color,
}

window.Point = Point
window.Line = Line
window.Circle = Circle;
window.Plane = Plane;
window.PointObject = PointObject
window.LineObject = LineObject
window.CircleObject = CircleObject;
window.PlaneObject = PlaneObject;
window.THREE = THREE
