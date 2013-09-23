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





