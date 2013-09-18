/*
      | |               
  ___ | | ___   _ _ __  
 / _ \| |/ / | | | '_ \ 
| (_) |   <| |_| | |_) |
 \___/|_|\_\\__, | .__/ 
             __/ | |    
            |___/|_|    

*/



var container = document.getElementById('container');
var renderer = new THREE.WebGLRenderer();
//var renderer = new THREE.CanvasRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

container.appendChild(renderer.domElement);


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1,100000);
scene.add(camera);

var material = new THREE.ParticleCanvasMaterial({
	color : 0xFF0000,
	opacity : 1,
	program : function(context){
		context.beginPath();
				context.fill();

		context.arc(0,0,1,0,Math.PI *2,true);
		context.closePath();
						context.fill();
	}

});

var particle = new THREE.Particle(material);

particle.position.x = 0;
particle.position.y = 0;
particle.position.z = 0;

particle.scale.x = particle.scale.y = 10;

scene.add(particle);



camera.position.z = 100;

camera.lookAt(particle);

renderer.render(scene,camera);






