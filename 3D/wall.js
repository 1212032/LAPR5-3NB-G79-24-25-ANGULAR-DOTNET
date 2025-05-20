import * as THREE from "three";

/*
 * parameters = {
 *  insideTextureUrl: String,
 *  outsideTextureUrl: String
 * }
 */

export default class Wall {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a group of objects
        this.object = new THREE.Group();

        // Create the front texture
        const texture = new THREE.TextureLoader().load(this.insideTextureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        // Create the front face (a rectangle)
        let geometry = new THREE.PlaneGeometry(3.0, 3.0);
        let materialFront = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
        let face = new THREE.Mesh(geometry, materialFront);
        face.position.set(0.0, 1.0, 0.025);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);

        // Create the back texture
        const textureOutside = new THREE.TextureLoader().load(this.outsideTextureUrl);
        textureOutside.colorSpace = THREE.SRGBColorSpace;
        textureOutside.magFilter = THREE.LinearFilter;
        textureOutside.minFilter = THREE.LinearMipmapLinearFilter;

        // Create the rear face (a rectangle)
        let materialBack = new THREE.MeshPhongMaterial({ color: 0xffffff, map: textureOutside });
        let faceBack = new THREE.Mesh(geometry, materialBack);
        faceBack.rotateY(Math.PI);
        faceBack.position.set(0.0, 1.0, 0);
        faceBack.castShadow = true;
        faceBack.receiveShadow = true;
        this.object.add(faceBack);


        // // Create the two left faces (a four-triangle mesh)
        // let points = new Float32Array([
        //     -1.475, -0.5, 0.025,
        //     -1.475, 2.5, 0.025,
        //     -1.5, 2.5, 0.0,
        //     -1.5, -0.5, 0.0,

        //     -1.5, 2.5, 0.0,
        //     -1.475, 2.5, 0,
        //     -1.475, -0.5, 0,
        //     -1.5, -0.5, 0.0
        // ]);
        // let normals = new Float32Array([
        //     -0.707, 0.0, 0.707,
        //     -0.707, 0.0, 0.707,
        //     -0.707, 0.0, 0.707,
        //     -0.707, 0.0, 0.707,

        //     -0.707, 0.0, -0.707,
        //     -0.707, 0.0, -0.707,
        //     -0.707, 0.0, -0.707,
        //     -0.707, 0.0, -0.707
        // ]);
        // let indices = [
        //     0, 1, 2,
        //     2, 3, 0,
        //     4, 5, 6,
        //     6, 7, 4
        // ];
        // geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        // geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        // geometry.setIndex(indices);
        // material = new THREE.MeshPhongMaterial({ color: 0x6b554b });
        // face = new THREE.Mesh(geometry, material);
        // face.castShadow = true;
        // face.receiveShadow = true;
        // this.object.add(face);

        // // Create the two right faces (a four-triangle mesh)
        // face = new THREE.Mesh().copy(face, false);
        // face.rotateZ(Math.PI);
        // // face.
        // face.position.y+=2;
        // this.object.add(face);


        // Create the top face (a four-triangle mesh)
        let points = new Float32Array([
            -1.5, 2.5, 0.0,
            -1.475, 2.5, 0.025,
            -1.475, 2.5, 0,
            1.475, 2.5, 0.025,
            1.475, 2.5, 0,
            1.5, 2.5, 0.0
        ]);
        let normals = new Float32Array([
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
        ]);
        let indices = [
            0, 1, 2,
            2, 1, 3,
            3, 4, 2,
            4, 3, 5
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        let material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        face = new THREE.Mesh(geometry, material);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);
    }
}