import * as THREE from "three";

export default class CameraPosition {
    constructor() { }

    changePosition(currentObject, floorSize, cameraPosition, controls, camera) {
        let x = currentObject.position.x;
        let xIncrement = 0;
        if (x >= -1.5 && x <= 1.5) {
            x = 0;
        }
        for (let i = 0; i < floorSize.height; i++) {
            if (Math.abs(x) >= (1.5 + (i * 3)) && Math.abs(x) <= (1.5 + ((i + 1) * 3))) {
                let remainder = Math.abs(x) % 3;
                if (remainder != 0) {
                    if (remainder < 1.5) {
                        xIncrement = 0.01;
                    } else {
                        if (remainder > 1.5) {
                            xIncrement = -0.01;
                        }
                    }
                }
                if (x < 0) {
                    x = 3 * (i + 1);
                    x *= -1;
                } else {
                    x = 3 * (i + 1);
                }
                break;
            }
        }
        if (x > 0)
            xIncrement = xIncrement * -1;

        let z = currentObject.position.z;
        let zIncrement = 0;
        if (z >= -1.5 && z <= 1.5) {
            z = 0;
        }
        for (let i = 0; i < floorSize.width; i++) {
            if (Math.abs(z) >= (1.5 + (i * 3)) && Math.abs(z) <= (1.5 + ((i + 1) * 3))) {
                let remainder = Math.abs(z) % 3;
                if (remainder != 0) {
                    if (remainder < 1.5) {
                        zIncrement = 0.01;
                    } else {
                        if (remainder > 1.5) {
                            zIncrement = -0.01;
                        }
                    }
                }
                if (z < 0) {
                    z = 3 * (i + 1);
                    z *= -1;
                } else {
                    z = 3 * (i + 1);
                }
                break;
            }
        }
        if (z > 0)
            zIncrement = zIncrement * -1;

        cameraPosition.set(x + xIncrement, cameraPosition.y, z + zIncrement);
        controls.target = new THREE.Vector3(x, 0, z);
    }
}