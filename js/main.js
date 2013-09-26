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


*/





if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

      var container, stats;

      var camera, controls, scene, renderer;

      var cross;

      init();
      animate();

      function init() {

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 500;

        controls = new THREE.OrbitControls( camera );
        controls.addEventListener( 'change', render );

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

        // world

        var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
        var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );

        for ( var i = 0; i < 500; i ++ ) {

          var mesh = new THREE.Mesh( geometry, material );
          mesh.position.x = ( Math.random() - 0.5 ) * 1000;
          mesh.position.y = ( Math.random() - 0.5 ) * 1000;
          mesh.position.z = ( Math.random() - 0.5 ) * 1000;
          mesh.updateMatrix();
          mesh.matrixAutoUpdate = false;
          scene.add( mesh );

        }


        // lights

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        scene.add( light );

        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );


        // renderer

        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setClearColor( scene.fog.color, 1 );
        renderer.setSize( window.innerWidth, window.innerHeight );

        container = document.getElementById( 'container' );
        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 100;
        container.appendChild( stats.domElement );

        //

        window.addEventListener( 'resize', onWindowResize, false );

      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        render();

      }

      function animate() {

        requestAnimationFrame( animate );
        controls.update();

      }

      function render() {

        renderer.render( scene, camera );
        stats.update();

      }















/*
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
	};
})();




var controls;

      var SCENE_SIZE = 1000, camera, scene, renderer, stats, clock, geometry, material, mesh,controller, hands= [];

      var init = function () {
        camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = SCENE_SIZE*2;
        camera.position.y = 1000;
        scene = new THREE.Scene();




 controls = new THREE.TrackballControls( camera );

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [ 65, 83, 68 ];

        controls.addEventListener( 'change', render );


               // GOOD camera.lookAt( scene.position );

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

        // LIGHTS

        hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 500, 0 );
        scene.add( hemiLight );

        //

        dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( -1, 1.75, 1 );
        dirLight.position.multiplyScalar( 50 );
        scene.add( dirLight );

        dirLight.castShadow = true;

        dirLight.shadowMapWidth = 2048;
        dirLight.shadowMapHeight = 2048;

        var d = 50;

        dirLight.shadowCameraLeft = -d;
        dirLight.shadowCameraRight = d;
        dirLight.shadowCameraTop = d;
        dirLight.shadowCameraBottom = -d;

        dirLight.shadowCameraFar = 3500;
        dirLight.shadowBias = -0.0001;
        dirLight.shadowDarkness = 0.35;
        //dirLight.shadowCameraVisible = true;


var geom = new THREE.Geometry(); 
var v1 = new THREE.Vector3(0,0,0);
var v2 = new THREE.Vector3(0,500,0);
var v3 = new THREE.Vector3(0,500,500);

geom.vertices.push(v1);
geom.vertices.push(v2);
geom.vertices.push(v3);

geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
geom.computeFaceNormals();

var object = new THREE.Mesh( geom, new THREE.MeshPhongMaterial() );

object.position.z = -100;//move a bit back - size of 500 is a bit big
object.rotation.y = -Math.PI * .5;//triangle is pointing in depth, rotate it -90 degrees on Y

scene.add(object);








var geom2 = new THREE.Geometry(); 
var v1 = new THREE.Vector3(0,0,0);
var v2 = new THREE.Vector3(0,400,10);
var v3 = new THREE.Vector3(60,100,600);

geom2.vertices.push(v1);
geom2.vertices.push(v2);
geom2.vertices.push(v3);

geom2.faces.push( new THREE.Face3( 0, 1, 2 ) );
geom2.computeFaceNormals();

var object2 = new THREE.Mesh( geom2, new THREE.MeshPhongMaterial() );

object2.position.z = -100;//move a bit back - size of 500 is a bit big
object2.rotation.y = -Math.PI * .5;//triangle is pointing in depth, rotate it -90 degrees on Y

scene.add(object2);






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


}*/