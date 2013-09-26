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

*/
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
	};
})();
/*
//global var
var container = document.getElementById('container');

// Setup the THREE.Scene()
var height = 300,
	width = 640;


var renderer = new THREE.WebGLRenderer({
	antialias: true
});
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);



//drawing

scene.add(camera);

camera.position.z = 300;

// elements

var spherematerial = new THREE.MeshLambertMaterial({
	color: 0xFF000
});
var sphere = new THREE.Mesh(
	new THREE.SphereGeometry(
		30, 32, 32
	), spherematerial);


var pointlight = new THREE.PointLight(0xFFFFFF);

pointlight.position.x = 10;
pointlight.position.y = 50;
pointlight.position.z = 150;
scene.add(sphere);
scene.add(pointlight);


renderer.setSize(width, height);
container.appendChild(renderer.domElement);



// Leap motion
// 
// 
// 
/*
var controller = new Leap.Controller({
	enableGestures: true
});

controller.connect();

var frame;

controller.on('connect', function() {

	console.log('Successfully connected.');

});

controller.on('frame', function(data) {

	frame = data;



        var fingers = [];

    for( var j = 0; j < fingers.length; j++ ){

          var finger = new THREE.Mesh(geometry,spherematerial);
            finger.position.x = 0
            scene.add(finger);
            fingers.push(finger);
    }




	for (var i = 0; i < frame.gestures.length; i++) {

		var gesture = frame.gestures[0];
		var type = gesture.type;
		console.log(gesture);

		switch (type) {



			case "keyTap":
				sphere.position.x = gesture.position[0];
        console.log('tap'); 
				break;

		}

	}



});


console.log(frame);



function leapToScene(leapPos) {

	var iBox = frame.interactionBox;

	var left = iBox.center[0] - iBox.size[0] / 2;
	var top = iBox.center[1] + iBox.size[1] / 2;

	var x = leapPos[0] - left;
	var y = leapPos[1] - top;

	x /= iBox.size[0];
	y /= iBox.size[1];

	x *= width;
	y *= height;

	return [x, -y];

}



(function animloop() {
	requestAnimFrame(animloop);
	renderer.render(scene, camera);
})();


/*

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var clock = new THREE.Clock();

// custom global variables
var mesh;
      var animate = function () {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
      }
init();
animate();

// FUNCTIONS    
function init() 
{
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(SCREEN_WIDTH/2,150,400);
  camera.lookAt(scene.position);  
  // RENDERER
    renderer = new THREE.WebGLRenderer( {antialias:true} );
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );
  // EVENTS
  // CONTROLS
  // STATS
  // LIGHT
  var light = new THREE.PointLight(0xffffff);
  light.position.set(100,250,100);
  scene.add(light);
  
  // SKYBOX
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  scene.add(skyBox);
  
  ////////////
  // CUSTOM //
  ////////////
  
  var geometry = new THREE.SphereGeometry( 30, 32, 16 );
  var material = new THREE.MeshLambertMaterial( { color: 0x000088 } );
  mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(40,40,40);
  scene.add(mesh);
  
  var axes = new THREE.AxisHelper(50);
  axes.position = mesh.position;
  scene.add(axes);
  
  var gridXZ = new THREE.GridHelper(100, 10);
  gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
  gridXZ.position.set( 100,0,100 );
  scene.add(gridXZ);
  
  var gridXY = new THREE.GridHelper(100, 10);
  gridXY.position.set( 100,100,0 );
  gridXY.rotation.x = Math.PI/2;
  gridXY.setColors( new THREE.Color(0x000066), new THREE.Color(0x000066) );
  scene.add(gridXY);

  var gridYZ = new THREE.GridHelper(100, 10);
  gridYZ.position.set( 0,100,100 );
  gridYZ.rotation.z = Math.PI/2;
  gridYZ.setColors( new THREE.Color(0x660000), new THREE.Color(0x660000) );
  scene.add(gridYZ);
  
  // direction (normalized), origin, length, color(hex)
  var origin = new THREE.Vector3(50,100,50);
  var terminus  = new THREE.Vector3(75,75,75);
  var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
  var arrow = new THREE.ArrowHelper(direction, origin, 50, 0x884400);
  scene.add(arrow);
  
  
  
}
*/

  // grid



      var SCENE_SIZE = 1000, camera, scene, renderer, stats, clock, geometry, material, mesh,controller, hands= [];

      var init = function () {
        camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = SCENE_SIZE*2;
        camera.position.y = 1000;
        scene = new THREE.Scene();
                camera.lookAt( scene.position );

        geometry = new THREE.SphereGeometry(SCENE_SIZE/20,4,4);
        material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth:  1} );
        for(var i = 0; i<2; i ++){
          var hand = new THREE.Mesh( geometry, material );
          hand.position.x = SCENE_SIZE * 1000;
          hand.fingers = [];
          for (var j = 0; j<5; j++){
            var finger = new THREE.Mesh(geometry,material);
            finger.position.x = SCENE_SIZE * 1000;
            scene.add(finger);
            hand.fingers.push(finger);
          }
          scene.add( hand );
          hands.push( hand );
        }




        // grid
        //         var size = 500, step = 50;

addGrid(1000,100,0x000000,0.2);





        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        Leap.loop(function(frame){
          for(var i = 0; i <2; i++){
            if(frame.hands[i]){
              hands[i].position = leapToScene(frame.hands[i].palmPosition)
              for(var j = 0; j <5; j++){
                if(frame.hands[i].fingers[j]){
                  hands[i].fingers[j].position = leapToScene(frame.hands[i].fingers[j].tipPosition)
                }else{
                  hands[i].fingers[j].position.x = SCENE_SIZE * 1000
                }
              }
            }else{
              hands[i].position.x = SCENE_SIZE *1000
            }
          }
        });
      }
      var animate = function () {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
      }
      init();
      animate();
      function leapToScene(leapPosition){
        var x = (leapPosition[0]/300)*SCENE_SIZE
        var y = (((leapPosition[1])-200)/300)*SCENE_SIZE
        var z = (leapPosition[2]/300)*SCENE_SIZE
        var toReturn = new THREE.Vector3(x,y,z)
        return toReturn
      }


function addGrid(size,step,color,opacity) {

   //     var size = 1000, step = 100;

        var geometry = new THREE.Geometry();

        for ( var i = - size; i <= size; i += step ) {

          geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
          geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

          geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
          geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

        }

        var material = new THREE.LineBasicMaterial( { color: color, opacity: opacity } );

        var line = new THREE.Line( geometry, material );
        line.type = THREE.LinePieces;
        scene.add( line );

        plane = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000 ), new THREE.MeshBasicMaterial() );
        plane.rotation.x = - Math.PI / 2;
        plane.visible = false;
        scene.add( plane );


}