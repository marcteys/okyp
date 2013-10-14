OKYP
====

Create 3D objects in your browser with a Leap Motion controller.


## Requirements

* A leap motion controller
* A recent browser which supports WebGL

## Usage

Okyp needs 2 hands to works. When you put your 2 hands in the scene, you can see few differences between these two. The first hand detected in the scene is the `controller hand`. This hand is used to navigate in the 3D scene. The second hand is used to point a 3D point in the scene.


### Navigate in the scene

To navigate in the scene, you ***must** have only one hand detected.
The camera controls are provided by a motified version of [threeleapcontrols](https://github.com/torstensprenger/threeleapcontrols). 

***Rotate :*** Use 3 fingers, and rotate/move them.

***Zoom :*** Use all the hand, and move uo/down (note : didn't ork very well for the moment)

***Drag/Pan :*** `desactivate` Use two fists and move to drag/pan 

### Create mesh

You need to insert a second hand in the scene. All the fingers from this hand are in *white* except one, in *red*. This is you master pointing finger. For more prescision, use only your *index* finger. The fingers of the *controller hand* switch to blue. That's mean your ready to create a new triangle !

To create it, simply move your index to the desired position, and "tap", with a finger of the *controller hand*.



### Differents mode

You can also create complexe mesh, with more than 3 vertices.
In the `main.js` file, change the boolean `triangleMode` to `false`

### Notes

* The best way to be prescise is to use the index of each hands.
* Okyp detect automatically when you try to create a point near an other point. It is better to have a precise closed shape. You can increase or decreate this value by modifing the variable `proxVal` at line //insert line here.

## Dependancies

* LeapJS - used to get the data from the leap motion controller.
* ThreeJS - Powerfull JS library, a standard to develop real-time 3D applications in web browsers.

## TODO

* 3D ui
* Camera from to view is actually bottom view I think
* better hand insertion in the scene - follow the camera position/rotation (ex "cube" obj in the scene )



