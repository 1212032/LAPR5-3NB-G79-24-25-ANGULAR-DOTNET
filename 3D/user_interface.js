import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export default class UserInteraction {
    constructor(scene, renderer, lights) {

        function colorCallback(object, color) {
            object.color.set(color);
        }

        function shadowsCallback(enabled) {
            scene.traverseVisible(function (child) { // Modifying the scene graph inside the callback is discouraged: https://threejs.org/docs/index.html?q=object3d#api/en/core/Object3D.traverseVisible
                if (child.material) {
                    child.material.needsUpdate = true;
                }
            });
        }

        // Create the graphical user interface
        this.gui = new GUI({ hideable: false });

        // Create the lights folder
        const lightsFolder = this.gui.addFolder("Lights");

        // Create the ambient light folder
        const ambientLightFolder = lightsFolder.addFolder("Ambient light");
        const ambientLight = lights.object.ambientLight;
        const ambientColor = { color: "#" + new THREE.Color(ambientLight.color).getHexString() };
        ambientLightFolder.addColor(ambientColor, "color").onChange(color => colorCallback(ambientLight, color));
        ambientLightFolder.add(lights.object.ambientLight, "intensity", 0.0, 4.0, 0.01);

        // Create directional light #1 folder
        const directionalLightFolder = lightsFolder.addFolder("Directional light");
        const directionalLight = lights.object.directionalLight;
        const directionalColor1 = { color: "#" + new THREE.Color(directionalLight.color).getHexString() };
        directionalLightFolder.addColor(directionalColor1, "color").onChange(color => colorCallback(directionalLight, color));
        directionalLightFolder.add(lights.object.directionalLight, "intensity", 0.0, 3.0, 0.1);
        directionalLightFolder.add(lights.object.directionalLight.position, "x", -50.0, 50.0, 0.01);
        directionalLightFolder.add(lights.object.directionalLight.position, "y", 0.0, 20.0, 0.01);
        directionalLightFolder.add(lights.object.directionalLight.position, "z", -50.0, 50.0, 0.01);

       

        // Create the shadows folder
        const shadowsFolder = this.gui.addFolder("Shadows");
        shadowsFolder.add(renderer.shadowMap, "enabled").onChange(enabled => shadowsCallback(enabled));
    }

    setVisibility(visible) {
        if (visible) {
            this.gui.show();
        }
        else {
            this.gui.hide();
        }
    }
}