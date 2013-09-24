/*
      | |               
  ___ | | ___   _ _ __  
 / _ \| |/ / | | | '_ \ 
| (_) |   <| |_| | |_) |
 \___/|_|\_\\__, | .__/ 
             __/ | |    
            |___/|_|    

Leap Motion mesh builder

*/
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
	};
})();

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



	for (var i = 0; i < frame.gestures.length; i++) {

		var gesture = frame.gestures[0];
		var type = gesture.type;
		console.log(gesture);

		switch (type) {



			case "keyTap":
				sphere.position.x = gesture.position[0];
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



/* Leap fonctione


   console.log('CHECK');
      var SCENE_SIZE = 1000, camera, scene, renderer, stats, clock, geometry, material, mesh,controller, hands= [];

      var init = function () {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, SCENE_SIZE/1000, SCENE_SIZE );
        camera.position.z = SCENE_SIZE/2;
        scene = new THREE.Scene();
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
*/