import * as THREE from "three";

/*
 * parameters = {
 *  ambientLight: { color: Integer, intensity: Float },
 *  directionalLight: { color: Integer, intensity: Float, distance: Float, position: Vector3 },
 * }
 */

export default class Lights {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a group of objects
        this.object = new THREE.Group();

        // Create the ambient light
        this.object.ambientLight = new THREE.AmbientLight(this.ambientLight.color, this.ambientLight.intensity);
        this.object.add(this.object.ambientLight);
        
        // Create directional light and turn on shadows for this light
        this.object.directionalLight = new THREE.DirectionalLight(this.directionalLight.color, this.directionalLight.intensity); //, this.directionalLight.distance) ;
        this.object.directionalLight.position.set(this.directionalLight.position.x, this.directionalLight.position.y, this.directionalLight.position.z);
        this.object.directionalLight.castShadow = true;

        // Set up shadow properties for this light
        this.object.directionalLight.shadow.mapSize.width = 512;
        this.object.directionalLight.shadow.mapSize.height = 512;
        this.object.directionalLight.shadow.camera.near = 5.0;
        this.object.directionalLight.shadow.camera.far = 15.0;
        this.object.add(this.object.directionalLight);

        //const helper  = new THREE.DirectionalLightHelper(this.object.directionalLight, 5);
        //this.object.add(helper);
        
    }
}