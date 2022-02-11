import * as THREE from "@/assets/libs/three";
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

export function findFacesInOneEdge(points, targetIndex) {
  let targetFaceIndexs = [targetIndex]
  let resultFaceIndexs = [targetIndex]
  function findSurroundFacesInOneEdge(points, targetIndex) {
    let surroundFaceIndexs = []

    function isFaceToFace(faceIndex1, faceIndex2) {
      if (faceIndex1 * 3 * 3 > points.length || faceIndex2 * 3 * 3 > points.length) {
        console.log("123123", points, faceIndex1 * 3 * 3, faceIndex2 * 3 * 3);
      }
      let face1 = [
        new THREE.Vector3(...points.slice(faceIndex1 * 3 * 3 + 0, faceIndex1 * 3 * 3 + 3)),
        new THREE.Vector3(...points.slice(faceIndex1 * 3 * 3 + 3, faceIndex1 * 3 * 3 + 6)),
        new THREE.Vector3(...points.slice(faceIndex1 * 3 * 3 + 6, faceIndex1 * 3 * 3 + 9))
      ]
      let face2 = [
        new THREE.Vector3(...points.slice(faceIndex2 * 3 * 3 + 0, faceIndex2 * 3 * 3 + 3)),
        new THREE.Vector3(...points.slice(faceIndex2 * 3 * 3 + 3, faceIndex2 * 3 * 3 + 6)),
        new THREE.Vector3(...points.slice(faceIndex2 * 3 * 3 + 6, faceIndex2 * 3 * 3 + 9))
      ]

      let result = 0
      for (let p1 of face1) {
        if (face2.some(p2 => p1.equals(p2))) {
          result += 1
        }
      }
      return result == 2 && new THREE.Plane().setFromCoplanarPoints(...face1).normal.angleTo(new THREE.Plane().setFromCoplanarPoints(...face2).normal) < (Math.PI / 180)
    }

    for (let faceIndex = 0; faceIndex < points.length / 9; faceIndex += 1) {
      if (resultFaceIndexs.indexOf(faceIndex) < 0) {

        if (isFaceToFace(faceIndex, targetIndex)) {
          // if (point.normal.angleTo(targetIndex.normal) < 0.00001) {
          surroundFaceIndexs.push(faceIndex)
          // }
        }
      }
    }

    return surroundFaceIndexs
  }

  while (targetFaceIndexs.length > 0) {
    resultFaceIndexs = resultFaceIndexs.concat(findSurroundFacesInOneEdge(points, targetFaceIndexs.pop()))
  }
  return resultFaceIndexs
}

export function createBoxAndSphereGeometry(boxNum, sphereNum) {
  let geometrys = []
  for (let i = 0; i < boxNum; i++) {
    geometrys.push(new THREE.BoxGeometry(Math.random() * 3, Math.random() * 3, Math.random() * 3).toNonIndexed())
  }

  for (let i = 0; i < sphereNum; i++) {
    geometrys.push(new THREE.SphereGeometry(Math.random() * 3, Math.random() * 5, Math.random() * 7).toNonIndexed())
  }

  let objs = geometrys.map(v => {
    v.translate(Math.random() * 3 - 1.5, Math.random() * 3 - 1.5, Math.random() * 3 - 1.5)
    v.clearGroups()
    for (let i = 0; i < v.attributes.position.count; i += 3) {
      v.addGroup(i, 3, 10)
    }
    let mesh = new THREE.Mesh(v, Array.from({ length: 11 }).map((v, i) => new THREE.MeshBasicMaterial({ color: new THREE.Color(i / 10, i / 10, i / 10) })))
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(v), new THREE.LineBasicMaterial({ color: 156 * 0x10000 + 39 * 0x100 + 176 })))
    store.getters.scene.add(mesh)
    return mesh
  })

  return objs
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
