# US 6.5.4

## 1. Context

* We need to enable camera movement around the scene with the mouse.

## 2. Requirements

**US 6.5.4** As a healthcare staff member, I want to control the camera with the mouse.

* Controls can either be created or imported (e.g., three.js addon OrbitControls or equivalent):
    * Left button: unused for now. It will be defined in the next sprint
    * Right button: orbit
    * Wheel: Zoom or dolly

## 3. Analysis

* We decided to use the "OrbitControls" from ThreeJS since it fully supports what is needed.

## 4. Design

### 4.1. Realization

* The following functionality will be applied on the OrbitControls:
    * Left button: Drag (For now. Next sprint it will be defined by the client.)
    * Right button: Orbit
    * Wheel: Zoom

### 4.4. Tests

* Testing will be done manually by moving the camera around the scene.

## 5. Implementation

* This was done by implementing the OrbitControls in the main surgery_rooms.js class:
    ```
    controls = new OrbitControls( camera, this.renderer.domElement );

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.maxPolarAngle = Math.PI / 2;

    controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
    controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

    controls.minDistance=1.5;
    controls.maxDistance=50;
    
    controls.target = new THREE.Vector3(0.0, 0.0, 0.0);
    ```
