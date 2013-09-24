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
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

//global var
var container = document.getElementById('container');

// Setup the THREE.Scene()
var height = 300,
	width = 640;


var renderer = new THREE.WebGLRenderer({ antialias: true });
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, width/height, 0.1, 10000 );


//drawing

scene.add(camera);

camera.position.z = 300;

// elements

var spherematerial = new THREE.MeshLambertMaterial( 
{color : 0xFF000
} );
var sphere = new THREE.Mesh(
	new THREE.SphereGeometry(
		30,32,32
		), spherematerial);


var pointlight = new THREE.PointLight(0xFFFFFF);

pointlight.position.x = 10;
pointlight.position.y = 50;
pointlight.position.z = 150;
scene.add(sphere);
scene.add(pointlight);


renderer.setSize(width,height);
container.appendChild(renderer.domElement);


(function animloop(){
  requestAnimFrame(animloop);
	renderer.render(scene,camera);
})();





  window.onmousemove = handleMouseMove;
  setInterval(getMousePosition, 100); // setInterval repeats every X ms

  function handleMouseMove(event) {
      event = event || window.event; // IE-ism
      mousePos = {
          x: event.clientX,
          y: event.clientY
      };
  }

  function getMousePosition() {
      var pos = mousePos;
      if (!pos) {
          // We haven't seen any movement yet
          pos = {x: "?", y: "?"};
      }
     pointlight.position.x =  pos.x ;
     pointlight.position.y =  -pos.y ;
  }
  
  function display(msg) {
    var p = document.createElement('p');
    p.innerHTML = msg;
    document.body.appendChild(p);
  }





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
