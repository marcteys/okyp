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