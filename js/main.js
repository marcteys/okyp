/*
      | |               
  ___ | | ___   _ _ __  
 / _ \| |/ / | | | '_ \ 
| (_) |   <| |_| | |_) |
 \___/|_|\_\\__, | .__/ 
             __/ | |    
            |___/|_|    

Leap Motion mesh builder



interaction : points fermés pour zoomer/rotationner, etc

deux doigts pour modéliser


exemple rotation : voxel paint
exemple ;isc control transform

d
*/



if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer;

var cameraControls;
var lastControlsIndex = -1,
  controlsIndex = -1,
  index = -1;

var cross;

var clock, geometry, material, mesh, controller, hands = [];

var SCENE_SIZE = 1000;

init();
animate();

function init() {

  ///////////////////////////////////////////////////////////////////////////////////////
  //        BASE SETTINGS
  ///////////////////////////////////////////////////////////////////////////////////////


  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = SCENE_SIZE * 2;
  camera.position.y = 1000;

  scene = new THREE.Scene();

  camera.lookAt(scene.position);


  //Leap Controls
  cameraControls = new THREE.LeapCameraControls(camera);

  cameraControls.rotateEnabled = true;
  cameraControls.rotateSpeed = 3;
  cameraControls.rotateHands = 1;
  cameraControls.rotateFingers = [3, 3];

  cameraControls.zoomEnabled = true;
  cameraControls.zoomSpeed = 6;
  cameraControls.zoomHands = 1;
  cameraControls.zoomFingers = [4, 5];
  cameraControls.zoomMin = 50;
  cameraControls.zoomMax = 2000;

  cameraControls.panEnabled = true;
  cameraControls.panSpeed = 2;
  cameraControls.panHands = 2;
  cameraControls.panFingers = [6, 12];
  cameraControls.panRightHanded = false; // for left-handed person


  // Mouse Controls
  controls = new THREE.TrackballControls(camera);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [65, 83, 68];
  controls.addEventListener('change', render);



  ///////////////////////////////////////////////////////////////////////////////////////
  //        BASE SETTINGS
  ///////////////////////////////////////////////////////////////////////////////////////

  /*
  var whiteLine = new THREE.LineBasicMaterial({
        color: 0x0000ff,
        linewidth: 10
    });
  whiteLine.linewidth = 10;


    var geometry2 = new THREE.Geometry();
    geometry2.vertices.push(new THREE.Vector3(-100, 0, 0));
    geometry2.vertices.push(new THREE.Vector3(0, 100, 0));
    geometry2.vertices.push(new THREE.Vector3(100, 0, 0));

    var line = new THREE.Line(geometry2, material);

scene.add(line);
*/


  // travail sur les mains 
  // 



  ///////////////////////////////////////////////////////////////////////////////////////
  //        MATERIALS
  ///////////////////////////////////////////////////////////////////////////////////////


  var matBlue = new THREE.MeshPhongMaterial({
    color: 0x025D8C,
    side: THREE.DoubleSide
  });

  var matOrange = new THREE.MeshPhongMaterial({
    color: 0xCC3300,
    side: THREE.DoubleSide
  });

  var matRed = new THREE.MeshPhongMaterial({
    color: 0xC6010A,
    side: THREE.DoubleSide
  });



  var origin = new THREE.Vector3(0, 0, 0);

  coords1 = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 175, 0x888888);
  coords2 = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, 175, 0x888888);
  coords3 = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, 175, 0x888888);
  scene.add(coords1);
  scene.add(coords2);
  scene.add(coords3);



  ///////////////////////////////////////////////////////////////////////////////////////
  //        SCENE
  ///////////////////////////////////////////////////////////////////////////////////////

  var sphermesh = new THREE.Mesh(new THREE.SphereGeometry(150, 32, 32), matRed);;
  var sphermesh2 = new THREE.Mesh(new THREE.SphereGeometry(150, 32, 32), matBlue);;
  sphermesh2.position.x = 450;
  sphermesh.position.x = -450;
  scene.add(sphermesh);
  scene.add(sphermesh2);

  var geom = new THREE.Geometry();
  var v1 = new THREE.Vector3(0, 0, 0);
  var v2 = new THREE.Vector3(0, 500, 0);
  var v3 = new THREE.Vector3(0, 500, 500);

  geom.vertices.push(v1);
  geom.vertices.push(v2);
  geom.vertices.push(v3);

  geom.faces.push(new THREE.Face3(0, 1, 2));
  geom.computeFaceNormals();

  var object = new THREE.Mesh(geom, matBlue);

  object.position.z = -100; //move a bit back - size of 500 is a bit big
  object.rotation.y = -Math.PI * .5; //triangle is pointing in depth, rotate it -90 degrees on Y

  scene.add(object);



  var geom2 = new THREE.Geometry();
  var v1 = new THREE.Vector3(0, 500, 0);
  var v2 = new THREE.Vector3(0, 500, 500);
  var v3 = new THREE.Vector3(-300, 700, 600);

  geom2.vertices.push(v1);
  geom2.vertices.push(v2);
  geom2.vertices.push(v3);

  geom2.faces.push(new THREE.Face3(0, 1, 2));
  geom2.computeFaceNormals();

  var object2 = new THREE.Mesh(geom2, matBlue);

  object2.position.z = -100; //move a bit back - size of 500 is a bit big
  object2.rotation.y = -Math.PI * .5; //triangle is pointing in depth, rotate it -90 degrees on Y

  scene.add(object2);




  ///////////////////////////////////////////////////////////////////////////////////////
  //        SCENE UTILS
  ///////////////////////////////////////////////////////////////////////////////////////
  

  addGrid(1000, 100, 0x000000, 0.2);


  addLights();






  ///////////////////////////////////////////////////////////////////////////////////////
  //        LEAP
  ///////////////////////////////////////////////////////////////////////////////////////


  geometry = new THREE.SphereGeometry(SCENE_SIZE / 30, 8, 8);

  handMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
  });

  fingerMaterial = new THREE.MeshBasicMaterial({
    color: 0x00FFFF,
    side: THREE.DoubleSide
  });




//Adding hands in the scene

  for (var i = 0; i < 2; i++) {


    var hand = new THREE.Mesh(new THREE.RingGeometry(140, 160, 40, 90, 100, Math.PI * 2), handMaterial);


    hand.fingers = [];

    if (hands.length < 2)

      for (var j = 0; j < 5; j++) {

        if (i == 0) var finger = new THREE.Mesh(geometry, fingerMaterial);
        if (i == 1) var finger = new THREE.Mesh(geometry, handMaterial);
        finger.position.x = SCENE_SIZE * 1000;
        scene.add(finger);
        hand.fingers.push(finger);

      }
    scene.add(hand);
    hands.push(hand);
  }



/*

desired rotation

THREE.Euler {_x: 0, _y: 0, _z: 0, _order: "XYZ", _quaternion: THREE.Quaternion…}
_order: "XYZ"
_quaternion: THREE.Quaternion
_x: 0
_y: 0
_z: 0




 */


console.log("1  " + hands[0].rotation.x);
var vect = new THREE.Vector3( 5, -9, 2 );
//hands[0].rotation.setFromAxisAngle(vect, Math.PI / 2);
console.log("2 " + hands[0].rotation.constructor.toString());
  //Adding "stabilized" result a less reactive interaction





  Leap.loop(function(frame) {
    for (var i = 0; i < 2; i++) {
      if (frame.hands[i]) {


        hands[i].position = leapToScene(frame.hands[i].palmPosition);

        if (hands.length == 2) {
          if (hands[0].position.x < hands[1].position.x) {
            console.log('gauche');

            hands[0].material.color.setHex(0xff0000);

          } else if (hands[1].position.x < hands[0].position.x) {
            hands[0].material.color.setHex(0xffff00);
                      console.log('droite');

          }

        }

        //   hands[i].rotation.applyEuler(leapToScene(frame.hands[i].palmNormal));

        for (var j = 0; j < 5; j++) {
          if (frame.hands[i].fingers[j]) {
            hands[i].fingers[j].position = leapToScene(frame.hands[i].fingers[j].tipPosition);
          } else {
            hands[i].fingers[j].position.x = SCENE_SIZE * 1000;
          }
        }
      } else {
        hands[i].position.x = SCENE_SIZE * 1000;
      }


    }



    if (index == -1) {
      cameraControls.update(frame);
    } else {
      objectsControls[index].update(frame);
    };

    // custom modifications (here: show coordinate system always on target and light movement)
    coords1.position = cameraControls.target;
    coords2.position = cameraControls.target;
    coords3.position = cameraControls.target;

  });






  ///////////////////////////////////////////////////////////////////////////////////////
  //        RENDER
  ///////////////////////////////////////////////////////////////////////////////////////

  renderer = new THREE.WebGLRenderer({
    antialias: false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild(stats.domElement);

  //

  window.addEventListener('resize', onWindowResize, false);




}


function leapToScene(leapPosition) {
  var x = (leapPosition[0] / 300) * SCENE_SIZE
  var y = (((leapPosition[1]) - 200) / 300) * SCENE_SIZE
  var z = (leapPosition[2] / 300) * SCENE_SIZE
  var toReturn = new THREE.Vector3(x, y, z)
  return toReturn
}



function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();

  render();

}

function animate() {

  requestAnimationFrame(animate);
  controls.update();
  // 
  changeControlsIndex;
  render();
}

function render() {

  renderer.render(scene, camera);
  stats.update();

}

function changeControlsIndex() {
  if (lastControlsIndex == controlsIndex) {
    if (index != controlsIndex && controlsIndex > -2) {
      // new object or camera to control
      if (controlsIndex > -2) {
        if (index > -1) objects[index].material.color.setHex(0xefefef);
        index = controlsIndex;
        if (index > -1) objects[index].material.color.setHex(0xff0000);
      }
    };
  };
  lastControlsIndex = controlsIndex;
};



function addGrid(size, step, color, opacity) {

  //     var size = 1000, step = 100;

  var geometry = new THREE.Geometry();

  for (var i = -size; i <= size; i += step) {

    geometry.vertices.push(new THREE.Vector3(-size, 0, i));
    geometry.vertices.push(new THREE.Vector3(size, 0, i));

    geometry.vertices.push(new THREE.Vector3(i, 0, -size));
    geometry.vertices.push(new THREE.Vector3(i, 0, size));

  }

  var material = new THREE.LineBasicMaterial({
    color: color,
    opacity: opacity
  });

  var line = new THREE.Line(geometry, material);
  line.type = THREE.LinePieces;
  scene.add(line);

  plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial());
  plane.rotation.x = -Math.PI / 2;
  plane.visible = false;
  scene.add(plane);


}



function addLights() {

  // nice hipster effect var ambientLight = new THREE.AmbientLight(0x000044);
  var ambientLight = new THREE.AmbientLight(0x222233);
  scene.add(ambientLight);


  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight);

  //

  dirLight = new THREE.DirectionalLight(0xffffff, .8);
  dirLight.color.setHSL(.8, 1, 0.95);
  dirLight.position.set(-1, 1.75, 1);
  scene.add(dirLight);

}