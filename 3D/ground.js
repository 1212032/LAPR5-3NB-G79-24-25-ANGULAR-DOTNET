import * as THREE from "three";

/*
 * parameters = {
 *  groundTextureUrl: string,
 *  roomGroundTextureUrl: string,
 *  size: Vector2,
 *  map: array
 * }
 */

export default class Ground {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // // Create a texture
        const groundTexture = new THREE.TextureLoader().load(this.groundTextureUrl);
        groundTexture.magFilter = THREE.LinearFilter;
        groundTexture.minFilter = THREE.LinearMipmapLinearFilter;

        const roomGroundTexture = new THREE.TextureLoader().load(this.roomGroundTextureUrl);
        roomGroundTexture.magFilter = THREE.LinearFilter;
        roomGroundTexture.minFilter = THREE.LinearMipmapLinearFilter;

        const geometry = new THREE.PlaneGeometry(3, 3);
        const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, map: groundTexture });
        const roomGroundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, map: roomGroundTexture });

        const group = new THREE.Group();
        for (let i = 0; i < this.size.width; i++) {
            for (let j = 0; j < this.size.height; j++) {
                let x = (i - this.size.width / 2.0 + 0.5) * 3;
                let y = (j - this.size.height / 2.0 + 0.5) * -3;
                if (this.map[j][i] >= 1 && this.map[j][i] <= 8) {
                    let roomGround = new THREE.Mesh(geometry, roomGroundMaterial);
                    roomGround.position.set(x, y, 0.0);
                    group.add(roomGround);
                } else {
                    let ground = new THREE.Mesh(geometry, groundMaterial);
                    ground.position.set(x, y, 0.0);
                    group.add(ground);
                }
            }
        }

        this.object = group;
        this.object.rotateX(-Math.PI / 2.0);
        this.object.castShadow = false;
        this.object.receiveShadow = true;
    }
}