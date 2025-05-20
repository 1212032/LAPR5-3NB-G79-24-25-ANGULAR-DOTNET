import * as THREE from "three";

export const generalData = {
    setDevicePixelRatio: false
}

export const floorData = {
    url: "./rooms/rooms.json"
}

export const keysData = {
    keyCodes: { userInterface: "KeyU", help: "KeyI", statistics: "KeyS" }
}

export const lightsData = {
    ambientLight: { color: 0xffffff, intensity: 1.0 },
    directionalLight: { color: 0xffffff, intensity: 1.0, distance: 0.0, position: new THREE.Vector3(0.0, 0.0, 0.0) },
}
