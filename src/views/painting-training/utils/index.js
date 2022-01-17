export default function random_logit_point() {
  var angle_x = (Math.random() - 0.5) * Math.PI;
  var angle_y = (Math.random() - 0.5) * Math.PI;
  return new THREE.Vector2(Math.tan(angle_x), Math.tan(angle_y));
}
