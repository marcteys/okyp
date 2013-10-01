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

///metre en rouge les points actuels et en blanc(bleu ?) les points des autres tris


//amélioration : faire petit shcéma des mains pour voir quels doigts sont actifs ! (a mettre en couleur, vert ou rouge)


*/



if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer;
var cameraRight;

var cameraControls;
var lastControlsIndex = -1,
  controlsIndex = -1,
  index = -1;

var cross;

var clock, geometry, material, mesh, controller, hands = [];

var SCENE_SIZE = 1000;
var activeFinger = new THREE.Vector3( 0, 0, 0 );
var leftHandId, rightHandId;
init();
animate();


//ajout de nouveaux points
var activeTriangle;
var activeLine;
var countPoints = -1;

function init() {

  ///////////////////////////////////////////////////////////////////////////////////////
  //        BASE SETTINGS
  ///////////////////////////////////////////////////////////////////////////////////////

cameraRight= new THREE.OrthographicCamera( 0.5 * window.innerWidth / - 2, 0.5 * window.innerWidth / 2,  window.innerHeight / 2,  window.innerHeight / - 2, 1, 10000 );

cameraRight.position.y = 000;
cameraRight.position.x = 1600;
cameraRight.position.z = 00;
cameraRight.lookAt(new THREE.Vector3(0,0,0));
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
  cameraControls.zoomFingers = [5, 5];
  cameraControls.zoomMin = 50;
  cameraControls.zoomMax = 2000;

  cameraControls.panEnabled = false;
  cameraControls.panSpeed = 2;
  cameraControls.panHands = 2;
  cameraControls.panFingers = [10, 12];
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
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });

  var matOrange = new THREE.MeshPhongMaterial({
    color: 0xCC3300,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });

  var matRed = new THREE.MeshPhongMaterial({
    color: 0xC6010A,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });

  var matWhite = new THREE.MeshPhongMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
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
  sphermesh.position.x = -tempX;

  scene.add(sphermesh);
  // scene.add(sphermesh2);



  /*
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


*/

  ///////////////////////////////////////////////////////////////////////////////////////
  //        SCENE UTILS
  ///////////////////////////////////////////////////////////////////////////////////////


  addGrid(1000, 100, 0x000000, 0.2);


  addLights();



  ///////////////////////////////////////////////////////////////////////////////////////
  //        TRIANGLE CREATION  ** I can also create complex shape
  ///////////////////////////////////////////////////////////////////////////////////////

  //
  //
  //To do : Add a point on a tap or a double tap ?
  //


  var pointArray = new Array(); // a utilise si je veux sauvegarder
  var trianglesArray = new Array(); // "  var countTriangles;

  var pointA, pointB, pointC;

  var proxVal = 200;

  var sphereArray = new Array();
  /*

Working on : point proximity



 */



  var geom = new THREE.Geometry();

  geom.vertices.push(new THREE.Vector3(0, 0, 0));
  geom.vertices.push(new THREE.Vector3(0, 0, 0));
  geom.vertices.push(new THREE.Vector3(0, 0, 0));

  geom.faces.push(new THREE.Face3(0, 1, 2));
  geom.computeFaceNormals();
  activeTriangle = new THREE.Mesh(geom, matBlue);

  scene.add(activeTriangle);



  var geomLine = new THREE.Geometry();

  geomLine.vertices.push(new THREE.Vector3(0, 0, 0));
  geomLine.vertices.push(new THREE.Vector3(0, 0, 0));

  activeLine = new THREE.Line(geomLine, new THREE.LineBasicMaterial({
    color: 0x000000
  }));

  scene.add(activeLine);



  function createPoint() {



    var smallId; // change at each new point.

    countPoints++;

    switch (countPoints % 3) {
      case 0:
        pointA = activeFinger;
        pointArray.push(pointA);

        smallId = proximity(pointA, proxVal);
        if (smallId !== false) { // check if there is a value
          pointA = pointArray[smallId]; // change the value to the nearest
          // il doit y avoir un probleme la 
          pointArray[pointArray.length - 1] = pointA; // change the last id in the array
          sphereArray.push(' ');

          sphereArray[smallId].material = matRed;
        } else {
          console.log('new point');
          createSphere(pointA); // else create a new sphere
        }
        activeLine.geometry.vertices[0] = pointA;

        break;

      case 1:
        pointB = activeFinger;
        pointArray.push(pointB);

        smallId = proximity(pointB, proxVal);
        if (smallId !== false) {
          pointB = pointArray[smallId];
          pointArray[pointArray.length - 1] = pointB;
          sphereArray.push(' ');
          sphereArray[smallId].material = matRed;

        } else {
          console.log('new point');
          createSphere(pointB);
        }
        activeLine.geometry.vertices[0] = activeLine.geometry.vertices[1] = new THREE.Vector3(0, 0, 0);
        activeTriangle.geometry.vertices[0] = pointA;
        activeTriangle.geometry.vertices[1] = pointB;

        break;

      case 2:
        pointC = activeFinger;
        pointArray.push(pointC);

        smallId = proximity(pointC, proxVal);
        if (smallId !== false) {
          pointC = pointArray[smallId];
          pointArray[pointArray.length - 1] = pointC;
          sphereArray.push(' ');

          sphereArray[smallId].material = matRed;

        } else {
          console.log('new point');
          createSphere(pointC);
        }

        createTriangle(pointA, pointB, pointC);
        break;

    } // fin switch



  }


  //function to determine the nearest value

  function proximity(vect, val) {

    var smallest = 2000;
    var smallId = false;

    for (var i = 0; i < pointArray.length - 1; i++) { // explore all the points
      if (vect.distanceTo(pointArray[i]) < val && vect.distanceTo(pointArray[i]) < smallest) { // if smaller than the dist, the last smallest and not himself
        smallest = vect.distanceTo(pointArray[i]); // store the smallest
        smallId = i;

      }
      //  console.log('point ' +i + ', dist '  + vect.distanceTo(pointArray[i]) +' | small id ' + smallId + ', snallest dist ' + smallest);

    }
    return smallId; //return the id else, return false
  }



  function updateLine(pointA, pointB) {


    var lineGeometry = new THREE.Geometry(); // en faire une variable globale

    lineGeometry.vertices.push(pointA);
    lineGeometry.vertices.push(pointB);
    lineGeometry.verticesNeedUpdate = true;

    var lineMaterial = new THREE.LineBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      linewidth: 3
    });

    this.line = new THREE.Line(lineGeometry, lineMaterial);
    this.line.geometry.verticesNeedUpdate = true;

    scene.add(this.line);


  }


  function createTriangle(pointA, pointC, pointC) {


    activeTriangle.geometry.vertices[0] =
      activeTriangle.geometry.vertices[1] =
      activeTriangle.geometry.vertices[2] = new THREE.Vector3(0, 0, 0);

    var geom = new THREE.Geometry();


    geom.vertices.push(pointA);
    geom.vertices.push(pointB);
    geom.vertices.push(pointC);

    geom.faces.push(new THREE.Face3(0, 1, 2));
    geom.computeFaceNormals();

    var object = new THREE.Mesh(geom, matBlue);
    object.geometry.verticesNeedUpdate = true;


    scene.add(object);



    //not optimized at all...
    if (proximity(pointA, proxVal) !== false) {
      sphereArray[proximity(pointA, proxVal)].material = matWhite;
    } else {
      sphereArray[sphereArray.length - 3].material = matWhite;
    }
    if (proximity(pointB, proxVal) !== false) {
      sphereArray[proximity(pointB, proxVal)].material = matWhite;
    } else {
      sphereArray[sphereArray.length - 2].material = matWhite;
    }
    if (proximity(pointC, proxVal) !== false) {
      sphereArray[proximity(pointC, proxVal)].material = matWhite;
    } else {
      sphereArray[sphereArray.length - 1].material = matWhite;
    }



  }

  function createSphere(point) {

    var sphermesh = new THREE.Mesh(new THREE.SphereGeometry(20, 8, 8), matRed);;
    sphermesh.position = point;
    scene.add(sphermesh);

    sphereArray.push(sphermesh);

  }



  document.onkeypress = function(evt) {
    var k = evt ? evt.which : window.event.keyCode;
    if (k == 32) createPoint();
  }


  ///////////////////////////////////////////////////////////////////////////////////////
  //        DELETE triangle ? ** use two fingers and leap control obj
  ///////////////////////////////////////////////////////////////////////////////////////


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



  ////////////////////////////
  //Adding hands in the scene
  ///////////////////////////

  for (var i = 0; i < 2; i++) {
    var hand;

    hand = new THREE.Mesh(new THREE.RingGeometry(140, 160, 40, 90, 100, Math.PI * 2), handMaterial);

    // idee deco main : deux double anneaux en plus, pour simuler le poignet

    hand.fingers = [];

    if (hands.length < 2)

      for (var j = 0; j < 5; j++) {

        if (i == 0) var finger = new THREE.Mesh(new THREE.SphereGeometry(20, 8, 8), matOrange);
        //peut changer de mat entre les deux mains
        if (i == 1) var finger = new THREE.Mesh(new THREE.SphereGeometry(20, 8, 8), matOrange);
        finger.position.x = SCENE_SIZE * 1000;
        scene.add(finger);
        hand.fingers.push(finger);

      }
    scene.add(hand);
    hands.push(hand);
  }



  /*



/* // TYPE

console.log("1  " + hands[0].rotation.x);
var vect = new THREE.Vector3( 5, -9, 2 );
//hands[0].rotation.setFromAxisAngle(vect, Math.PI / 2);
console.log("2 " + hands[0].rotation.constructor.toString());
  //Adding "stabilized" result a less reactive interaction


*/

  Leap.loop({
    enableGestures: true
  }, function(frame) {

    /////////////////
    // MAIN 
    /////////////////

    for (var i = 0; i < 2; i++) {
      if (frame.hands[i]) {
        hands[i].position = leapToScene(frame.hands[i].palmPosition);

        hands[i].rotation.x = (90 * Math.PI / 180) - frame.hands[i].palmNormal[2];
        hands[i].rotation.y = frame.hands[i].palmNormal[0];
        hands[i].rotation.z = frame.hands[i].palmNormal[1]; //useless

        leftHandId = frame.hands[0].id;
        if (frame.hands[1]) rightHandId = frame.hands[1].id;

        //////////////////////inverser ////////////////////////////////
        if (hands.length == 2) {
          if (hands[0].position.x < hands[1].position.x) {
            //    console.log('gauche');

            hands[0].material.color.setHex(0xff0000);

          } else if (hands[1].position.x < hands[0].position.x) {
            //  console.log(hands);
            // hands.reverse();
            //      console.log('droite');
            return;

            /*
            hands[0].material.color.setHex(0xffff00);
            console.log('droite');
*/
          }

        }



        for (var j = 0; j < 5; j++) {

          if (frame.hands[i].fingers[j]) {

            hands[i].fingers[j].position = leapToScene(frame.hands[i].fingers[j].tipPosition);

            if (frame.hands[1] && frame.hands[1].fingers[0]) {
              activeFinger = leapToScene(frame.hands[1].fingers[0].tipPosition);

            } else {
                activeFinger = new THREE.Vector3( 0, 0, 0 );
            }

          } else {
            hands[i].fingers[j].position.x = SCENE_SIZE * 1000;

          }
        }
      } else {
        hands[i].position.x = SCENE_SIZE * 1000;
      }


    }

    /////////////////
    // CAMERA CONTROL
    /////////////////
    if (index == -1) {
      cameraControls.update(frame);
    } else {
      objectsControls[index].update(frame);
    };

    // custom modifications (here: show coordinate system always on target and light movement)
    coords1.position = cameraControls.target;
    coords2.position = cameraControls.target;
    coords3.position = cameraControls.target;



    /////////////////
    // GESTURE
    /////////////////

    var gestures = frame.gestures,
      circle,
      pointable,
      direction,
      normal;



    if (gestures.length > 0) {
      // In this example we will focus only on the first gesture, for the sake of simplicity
      if (gestures[0].type == 'circle') {
        console.log('circle');
        circle = gestures[0];
        // Get Pointable object
        circle.pointable = frame.pointable(circle.pointableIds[0]);
        // Reset circle gesture variables as nedded, not really necessary in this case
        if (circle.state == 'start') {
          clockwise = true;
        } else if (circle.state == 'update') {
          direction = circle.pointable.direction;
          // Check if pointable exists
          if (direction) {
            normal = circle.normal;
            // Check if product of vectors is going forwards or backwards
            // Since Leap uses a right hand rule system
            // forward is into the screen, while backwards is out of it
            clockwise = Leap.vec3.dot(direction, normal) > 0;
            if (clockwise) {
              //Do clockwose stuff
            } else {
              //Do counterclockwise stuff
            }
          }
        }
      } // fin gesture circle


      if (gestures[0].type == 'keyTap') {
        if (leftHandId == gestures[0].handIds && activeFinger.x !== 0) {
          console.log('tapmaingauche');
          createPoint();
        }
      }


    } // fin gesture detection



  }); // fin leap loop



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



} // fin init()



document.onmousedown = function() {
  console.log(leapToScene(activeFinger.tipPosition));

};



function animate() {



if(activeFinger.x){

    activeTriangle.geometry.vertices[2] = activeFinger;




  // updating vertice
  activeTriangle.geometry.verticesNeedUpdate = true;
  activeTriangle.geometry.elementsNeedUpdate = true;
  activeTriangle.geometry.morphTargetsNeedUpdate = true;
  activeTriangle.geometry.uvsNeedUpdate = true;
  activeTriangle.geometry.normalsNeedUpdate = true;
  activeTriangle.geometry.colorsNeedUpdate = true;
  activeTriangle.geometry.tangentsNeedUpdate = true;
  activeTriangle.geometry.computeFaceNormals();



  activeLine.geometry.verticesNeedUpdate = true;

  if (countPoints % 3 == 0) {
    activeLine.geometry.vertices[1] = activeFinger;
  }

}
  requestAnimationFrame(animate);
  controls.update();
  // 
  //  changeControlsIndex;
  render();
}

function render() {


/*
          renderer.setViewport( 0, 0, window.innerWidth/2, window.innerHeight);
          renderer.setScissor( 0, 0, window.innerWidth/2, window.innerHeight);
          renderer.enableScissorTest ( true );
          renderer.setClearColor( view.background );

*/


          cameraRight.updateProjectionMatrix();

        renderer.clear();


  renderer.setViewport( window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight);
 renderer.setViewport( window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight);
  renderer.setScissor( window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight );
renderer.enableScissorTest ( true );
          camera.updateProjectionMatrix();
renderer.setClearColor( 0xdd8888);

renderer.render(scene, cameraRight);

  renderer.setViewport( 0, 0, window.innerWidth/2, window.innerHeight );
   renderer.setViewport(0, 0, window.innerWidth/2, window.innerHeight );
  renderer.setScissor( 0, 0, window.innerWidth/2, window.innerHeight );
renderer.enableScissorTest ( true );
          camera.updateProjectionMatrix();
renderer.setClearColor( 0xeeeeee);
  renderer.render(scene, camera);



  stats.update();

}



document.onmousedown = function() {
   console.log(activeFinger);
};



function leapToScene(leapPosition) {
  var x = (leapPosition[0] / 300) * SCENE_SIZE;
  var y = (((leapPosition[1]) - 200) / 300) * SCENE_SIZE;
  var z = (leapPosition[2] / 300) * SCENE_SIZE;
  var toReturn = new THREE.Vector3(x, y, z);
  return toReturn;
}



function onWindowResize() {
/*
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();

  render();
*/
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



document.onmousemove = getMouseXY;

// Temporary variables to hold mouse x-y pos.s
var tempX = 0
var tempY = 0

// Main function to retrieve mouse x-y pos.s

  function getMouseXY(e) {

    tempX = e.pageX
    tempY = e.pageY
    // catch possible negative values in NS4
    if (tempX < 0) {
      tempX = 0
    }
    if (tempY < 0) {
      tempY = 0
    }
    // show the position values in the form named Show
    // in the text fields named MouseX and MouseY

    return true
  }