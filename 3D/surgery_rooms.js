import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { generalData, floorData, keysData, lightsData } from "./default_data.js";
import { merge } from "./merge.js";
import Floor from "./floor.js";
import CameraPosition from "./cameraPosition.js";
import Keys from "./keys.js";
import Lights from "./lights.js";
import UserInterface from "./user_interface.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { roomInformation } from "./room_information.js";

/*
 * generalParameters = {
 *  setDevicePixelRatio: Boolean
 * }
 *
 * keysParameters = {
 *  keyCodes: { userInterface: String, help: String, statistics: String }
 * }
 *
 * lightsParameters = {
 *  ambientLight: { color: Integer, intensity: Float },
 *  pointLight1: { color: Integer, intensity: Float, range: Float, position: Vector3 },
 *  pointLight2: { color: Integer, intensity: Float, range: Float, position: Vector3 },
 *  spotLight: { color: Integer, intensity: Float, range: Float, angle: Float, penumbra: Float, position: Vector3, direction: Float }
 * }
 */

let camera, controls, raycaster, mouse, currentRoomId;

export default class ThumbRaiser {
    constructor(generalParameters, floorParameters, keysParameters, lightsParameters) {
        try {
            this.generalParameters = merge({}, generalData, generalParameters);
            this.floorParameters = merge({}, floorData, floorParameters);
            this.keysParameters = merge({}, keysData, keysParameters);
            this.lightsParameters = merge({}, lightsData, lightsParameters);

            // Create a 3D scene
            this.scene3D = new THREE.Scene();

            // Create the floor
            this.floor = new Floor(this.floorParameters);

            // Create the floor
            this.cameraPosition = new CameraPosition();

            // Create Spotlight for room
            this.spotLightRoom = new THREE.SpotLight(0x96c285, 15, 50, Math.PI / 4, 0.2,2);
            this.spotLightRoom.position.set(50000, 1.3, 50000);
            this.spotLightRoom.target.position.set(0, 0, 0); 

            this.scene3D.add(this.spotLightRoom);
            this.scene3D.add(this.spotLightRoom.target);

            // Create the keys
            this.keys = new Keys(this.keysParameters);

            // Create the lights
            this.lights = new Lights(this.lightsParameters);

            // Create the statistics and make its node invisible
            this.statistics = new Stats();
            this.statistics.dom.style.visibility = "hidden";
            document.body.appendChild(this.statistics.dom);

            // Create a renderer and turn on shadows in the renderer
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            if (this.generalParameters.setDevicePixelRatio) {
                this.renderer.setPixelRatio(window.devicePixelRatio);
            }
            this.renderer.autoClear = false;
            this.renderer.shadowMap.enabled = false;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);


            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2(1, 1);


            // skybox
            let materials = [];
            let texture_ft = new THREE.TextureLoader().load('./textures/meadow_ft.jpg');
            let texture_bk = new THREE.TextureLoader().load('./textures/meadow_bk.jpg');
            let texture_up = new THREE.TextureLoader().load('./textures/meadow_up.jpg');
            let texture_dn = new THREE.TextureLoader().load('./textures/meadow_dn.jpg');
            let texture_rt = new THREE.TextureLoader().load('./textures/meadow_rt.jpg');
            let texture_lf = new THREE.TextureLoader().load('./textures/meadow_lf.jpg');

            materials.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
            materials.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
            materials.push(new THREE.MeshBasicMaterial({ map: texture_up }));
            materials.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
            materials.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
            materials.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

            for (let i = 0; i < 6; i++) {
                materials[i].side = THREE.BackSide;
            }
            let cube = new THREE.BoxGeometry(1024, 1024, 1024);
            let skybox = new THREE.Mesh(cube, materials);
            this.scene3D.add(skybox);


            try {

                camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.set(-5, 10, -5);

                controls = new OrbitControls(camera, this.renderer.domElement);

                controls.enableDamping = false;
                controls.dampingFactor = 0.05;

                controls.screenSpacePanning = false;

                controls.maxPolarAngle = Math.PI / 2;

                controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
                controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
                controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

                controls.minDistance = 1.5;
                controls.maxDistance = 50;

                controls.target = new THREE.Vector3(0.0, 0.0, 0.0);

            } catch (error) {
                alert(error.message);
            }



            // Set the mouse move action (none)
            this.dragMiniMap = false;
            this.changeCameraDistance = false;
            this.changeCameraOrientation = false;

            // Set the game state
            this.gameRunning = false;

            // Get and configure the panel's <div> elements
            this.helpPanel = document.getElementById("help-panel");
            this.helpPanel.style.visibility = "hidden";
            this.subwindowsPanel = document.getElementById("subwindows-panel");
            this.userInterfaceCheckBox = document.getElementById("user-interface");
            this.userInterfaceCheckBox.checked = true;
            this.helpCheckBox = document.getElementById("help");
            this.helpCheckBox.checked = false;
            this.statisticsCheckBox = document.getElementById("statistics");
            this.statisticsCheckBox.checked = false;

            // Build the help panel
            this.buildHelpPanel();

            // Register the event handler to be called on window resize
            window.addEventListener("resize", event => this.windowResize(event));

            // Register the event handler to be called on key down
            document.addEventListener("keydown", event => this.keyChange(event, true));

            // Register the event handler to be called on key release
            document.addEventListener("keyup", event => this.keyChange(event, false));

            // Register the event handler to be called on mouse down
            this.renderer.domElement.addEventListener("mousedown", event => this.mouseDown(event));

            // Register the event handler to be called on mouse move
            this.renderer.domElement.addEventListener("mousemove", event => this.mouseMove(event));

            // Register the event handler to be called on mouse up
            //this.renderer.domElement.addEventListener("mouseup", event => this.mouseUp(event));

            // Register the event handler to be called on mouse wheel
            //this.renderer.domElement.addEventListener("wheel", event => this.mouseWheel(event));

            // Register the event handler to be called on context menu
            this.renderer.domElement.addEventListener("contextmenu", event => this.contextMenu(event));

            // Register the event handler to be called on select, input number, or input checkbox change
            this.userInterfaceCheckBox.addEventListener("change", event => this.elementChange(event));
            this.helpCheckBox.addEventListener("change", event => this.elementChange(event));
            this.statisticsCheckBox.addEventListener("change", event => this.elementChange(event));

            this.activeElement = document.activeElement;
        } catch (error) {
            alert(error.message);
        }
    }

    buildHelpPanel() {
        const table = document.getElementById("help-table");
    
        // Limpa o conteúdo anterior da tabela
        table.innerHTML = `
            <tr>
                <th>Room ID</th>
                <th>Status</th>
                <th>Patient</th>
                <th>Surgery</th>
            </tr>
        `;
    
        // Itera sobre os dados do arquivo externo e adiciona à tabela
        roomInformation.forEach((room) => {
            const row = table.insertRow();
            const roomIdCell = row.insertCell(0);
            const statusCell = row.insertCell(1);
            const patientCell = row.insertCell(2);
            const surgeryCell = row.insertCell(3);
    
            roomIdCell.innerHTML = room.roomId;
            statusCell.innerHTML = room.status;
            patientCell.innerHTML = room.patient ? room.patient.name : "N/A";
            surgeryCell.innerHTML = room.patient ? room.patient.surgery : "N/A";
        });
    }

    setUserInterfaceVisibility(visible) {
        this.userInterfaceCheckBox.checked = visible;
        this.subwindowsPanel.style.visibility = visible ? "visible" : "hidden";
        this.userInterface.setVisibility(visible);
    }

    setHelpVisibility(visible) {
        this.helpCheckBox.checked = visible;
        this.helpPanel.style.visibility = visible ? "visible" : "hidden";
    }

    setStatisticsVisibility(visible) { // Hidden: false; visible: true
        this.statisticsCheckBox.checked = visible;
        this.statistics.dom.style.visibility = visible ? "visible" : "hidden";
    }

    windowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    keyChange(event, state) {
        // Allow digit and arrow keys to be used when entering numbers
        if (["horizontal", "vertical", "distance", "zoom"].indexOf(event.target.id) < 0) {
            event.target.blur();
        }

        if (event.code === "KeyI" && state) {
    
            if (this.isHelpPanelVisible) {
                this.setHelpVisibility(false);
                this.isHelpPanelVisible = false; // Atualize o estado
            } else {
                this.updateRoomInfo(); // Atualiza as informações da sala
                this.setHelpVisibility(true);
                this.isHelpPanelVisible = true; // Atualize o estado
            }
        }

        if (document.activeElement == document.body) {
            // Prevent the "Space" and "Arrow" keys from scrolling the document's content
            if (event.code == "Space" || event.code == "ArrowLeft" || event.code == "ArrowRight" || event.code == "ArrowDown" || event.code == "ArrowUp") {
                event.preventDefault();
            }
            if (event.code == this.keys.keyCodes.userInterface && state) { // Display / hide user interface
                this.setUserInterfaceVisibility(!this.userInterfaceCheckBox.checked);
            }
            if (event.code == this.keys.keyCodes.help && state) { // Display / hide help
                this.setHelpVisibility(!this.helpCheckBox.checked);
            }
            if (event.code == this.keys.keyCodes.statistics && state) { // Display / hide statistics
                this.setStatisticsVisibility(!this.statisticsCheckBox.checked);
            }
        }
    }

    mouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    mouseDown(event) {
        if (event.buttons == 1) {
            const intersection = raycaster.intersectObjects(this.scene3D.children);
            if (intersection.length > 0) {
                let currentObject = intersection[0].object;
                let currentObjectId = currentObject.uuid;
                for (let i = 0; i < this.floor.size.width; i++) {
                    for (let j = 0; j < this.floor.size.height; j++) {
                        if (this.floor.objectIdMap[j][i] == currentObjectId) {

                            currentRoomId = this.floor.roomIdMap[j][i];

                            this.updateRoomInfo();

                            this.cameraPosition.changePosition(currentObject, this.floor.size, camera.position, controls);

                            //update spotlight position on click
                            this.spotLightRoom.position.set(camera.position.x, 1.7 , camera.position.z); 
                            this.spotLightRoom.target.position.set(camera.position.x, 0, camera.position.z);        
                        }
                    }
                }
            }
        }
    }

    contextMenu(event) {
        event.preventDefault();
    }

    elementChange(event) {
        switch (event.target.id) {
            case "user-interface":
                this.setUserInterfaceVisibility(event.target.checked);
                break;
            case "help":
                this.setHelpVisibility(event.target.checked);
                break;
            case "statistics":
                this.setStatisticsVisibility(event.target.checked);
                break;
        }
    }

    update() {
        try {
            if (!this.gameRunning) {
                if (this.floor.loaded) {
                    this.scene3D.add(this.floor.object);
                    this.scene3D.add(this.lights.object);
                    this.userInterface = new UserInterface(this.scene3D, this.renderer, this.lights);
                    this.gameRunning = true;
                }
            } else {
                this.statistics.update();
                this.renderer.render(this.scene3D, camera);
                this.renderer.clearDepth();
                controls.update();
                raycaster.setFromCamera(mouse, camera);
            }
        } catch (error) {
            alert(error.message);
        }
    }
    
    updateRoomInfo() {
        const roomId = currentRoomId;
        const table = document.getElementById("help-table");
        table.innerHTML = `
            <tr>
                <th>Room ID</th>
                <th>Status</th>
                <th>Patient</th>
                <th>Surgery</th>
            </tr>
        `;
    
        if (roomId > 0) {
            const roomInfo = roomInformation.find((room) => room.roomId === roomId);
    
            if (roomInfo) {
                const row = table.insertRow();
                const roomIdCell = row.insertCell(0);
                const statusCell = row.insertCell(1);
                const patientCell = row.insertCell(2);
                const surgeryCell = row.insertCell(3);
    
                roomIdCell.innerHTML = roomInfo.roomId;
                statusCell.innerHTML = roomInfo.status;
                patientCell.innerHTML = roomInfo.patient ? roomInfo.patient.name : "N/A";
                surgeryCell.innerHTML = roomInfo.patient ? roomInfo.patient.surgery : "N/A";
            }
        } else {
            const row = table.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 4;
            cell.innerHTML = "No room data available for this position.";
        }
    }
    
}