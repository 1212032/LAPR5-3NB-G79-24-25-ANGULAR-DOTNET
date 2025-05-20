import * as THREE from "three";
import Ground from "./ground.js";
import Wall from "./wall.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/*
 * parameters = {
 *  url: String
 * }
 */

export default class Floor {
    constructor(parameters) {
        this.onLoad = function (description) {
            // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
            THREE.Cache.enabled = true;

            try {
                // Store the floor's map and size
                this.map = description.map;
                this.roomIdMap = description.roomIdMap;
                this.size = description.size;

                // Create a group of objects
                this.object = new THREE.Group();

                this.objectIdMap = new Array(description.size.width);
                for (let i = 0; i < description.size.width; i++) {
                    this.objectIdMap[i] = new Array(description.size.height);
                    for (let j = 0; j < description.size.height; j++) {
                        this.objectIdMap[i][j] = '';
                    }
                }

                // Create the ground
                this.ground = new Ground({
                    groundTextureUrl: description.groundTextureUrl, roomGroundTextureUrl: description.roomGroundTextureUrl,
                    size: description.size, map: description.map
                });
                this.object.add(this.ground.object);

                // Create a wall
                this.wall = new Wall({ insideTextureUrl: description.roomWallInsideTextureUrl, outsideTextureUrl: description.roomWallOutsideTextureUrl });
                this.wallWithDoor = new Wall({ insideTextureUrl: description.roomWallInsideWithDoorTextureUrl, outsideTextureUrl: description.roomWallOutsideWithDoorTextureUrl });

                const gltfLoader = new GLTFLoader();

                // Build the floor
                let wallNorthObject;
                let wallWestObject;
                let wallSouthObject;
                let wallEastObject;
                let bedDisplacement = 0.03;
                let patientDisplacement = 0.94;
                for (let i = 0; i < description.size.width; i++) { // In order to represent the eastmost walls, the map width is one column greater than the actual floor width
                    for (let j = 0; j < description.size.height; j++) { // In order to represent the southmost walls, the map height is one row greater than the actual floor height
                        /*
                         * description.map[][]
                         * each position represents a room
                         * 0 -> no room
                         * empty rooms:
                         * 1 -> room facing north
                         * 2 -> room facing west
                         * 3 -> room facing south
                         * 4 -> room facing east
                         * occupied rooms:
                         * 5 -> room facing north
                         * 6 -> room facing west
                         * 7 -> room facing south
                         * 8 -> room facing east
                         */
                        let roomOccupied = false;
                        let bedRotation = 0;
                        let bedX = 0;
                        let bedZ = 0;
                        let patientX = 0;
                        let patientZ = 0;
                        let boxX = 0;
                        let boxZ = 0;
                        switch (description.map[j][i]) {
                            // room facing north
                            case 5:
                                roomOccupied = true;
                            case 1:
                                bedRotation = 0;
                                bedX = 1.5;
                                bedZ = 3.0 - bedDisplacement;
                                patientX = 1.5;
                                patientZ = 3.0 - patientDisplacement;
                                boxX = 1.5;
                                boxZ = 1.99;
                                wallNorthObject = this.wallWithDoor.object.clone();
                                wallWestObject = this.wall.object.clone();
                                wallSouthObject = this.wall.object.clone();
                                wallEastObject = this.wall.object.clone();
                                break;

                            // room facing west
                            case 6:
                                roomOccupied = true;
                            case 2:
                                bedRotation = Math.PI / 2;
                                bedX = 3.0 - bedDisplacement;
                                bedZ = 1.5;
                                patientX = 3.0 - patientDisplacement;
                                patientZ = 1.5;
                                boxX = 1.99;
                                boxZ = 1.5;
                                wallNorthObject = this.wall.object.clone();
                                wallWestObject = this.wallWithDoor.object.clone();
                                wallSouthObject = this.wall.object.clone();
                                wallEastObject = this.wall.object.clone();
                                break;

                            // room facing south
                            case 7:
                                roomOccupied = true;
                            case 3:
                                bedRotation = Math.PI;
                                bedX = 1.5;
                                bedZ = bedDisplacement;
                                patientX = 1.5;
                                patientZ = patientDisplacement;
                                boxX = 1.5;
                                boxZ = 1.01;
                                wallNorthObject = this.wall.object.clone();
                                wallWestObject = this.wall.object.clone();
                                wallSouthObject = this.wallWithDoor.object.clone();
                                wallEastObject = this.wall.object.clone();
                                break;

                            // room facing east
                            case 8:
                                roomOccupied = true;
                            case 4:
                                bedRotation = Math.PI + Math.PI / 2;
                                bedX = bedDisplacement;
                                bedZ = 1.5;
                                patientX = patientDisplacement;
                                patientZ = 1.5;
                                boxX = 1.01;
                                boxZ = 1.5;
                                wallNorthObject = this.wall.object.clone();
                                wallWestObject = this.wall.object.clone();
                                wallSouthObject = this.wall.object.clone();
                                wallEastObject = this.wallWithDoor.object.clone();
                                break;

                            // no room (case 0)
                            default:
                                break;
                        }

                        if (description.map[j][i] >= 1 && description.map[j][i] <= 8) {
                            let scaled_i = (i - description.size.width / 2.0) * 3;
                            let scaled_j = (j - description.size.height / 2.0) * 3;

                            // north wall
                            wallNorthObject.position.set(scaled_i + 1.5, 0.5, scaled_j);
                            this.object.add(wallNorthObject);

                            // west wall
                            wallWestObject.rotateY(Math.PI / 2.0);
                            wallWestObject.position.set(scaled_i, 0.5, scaled_j + 1.5);
                            this.object.add(wallWestObject);

                            // south wall
                            wallSouthObject.rotateY(Math.PI);
                            wallSouthObject.position.set(scaled_i + 1.5, 0.5, scaled_j + 3.0);
                            this.object.add(wallSouthObject);

                            // east wall
                            wallEastObject.rotateY(Math.PI / 2.0 + Math.PI);
                            wallEastObject.position.set(scaled_i + 3.0, 0.5, scaled_j + 1.5);
                            this.object.add(wallEastObject);

                            gltfLoader.load("./models/gltf/medical_table/scene.gltf", (gltfScene) => {
                                gltfScene.scene.scale.set(0.02, 0.02, 0.02);
                                gltfScene.scene.position.set(scaled_i + bedX, 0, scaled_j + bedZ);
                                gltfScene.scene.rotation.y = bedRotation;
                                this.object.add(gltfScene.scene);
                            });

                            let boxGeometry = new THREE.BoxGeometry(1, 1.5, 2);
                            let boxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 });
                            let box = new THREE.Mesh(boxGeometry, boxMaterial);
                            box.position.set(scaled_i + boxX, 0.5, scaled_j + boxZ);
                            box.rotation.y = bedRotation;
                            this.objectIdMap[j][i] = box.uuid;
                            this.object.add(box);


                            if (roomOccupied) {
                                gltfLoader.load("./models/gltf/patient/scene.gltf", (gltfScene) => {
                                    gltfScene.scene.scale.set(0.007, 0.007, 0.007);
                                    gltfScene.scene.position.set(scaled_i + patientX, 0.66, scaled_j + patientZ);
                                    gltfScene.scene.rotation.y = bedRotation - Math.PI;
                                    this.object.add(gltfScene.scene);
                                });
                            }
                        }
                    }
                }
                this.object.scale.set(1.0, 0.5, 1.0);
                this.loaded = true;
            } catch (error) {
                alert(error.message);
            }
        }

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a floor description resource file
        loader.load(this.url, description => this.onLoad(description));
    }
}