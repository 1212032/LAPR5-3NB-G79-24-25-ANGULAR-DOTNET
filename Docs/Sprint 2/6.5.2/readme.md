# US 6.5.2

## 1. Context

* As a healthcare staff member, it is essential to have a visually immersive and contextually appropriate representation of the hospital or clinic. To achieve this, the 3D visualization must incorporate suitable textures for the floor, walls, and other elements. These textures enhance the realism and usability of the visualization module, providing an intuitive and efficient environment for healthcare tasks.

## 2. Requirements

**US 6.5.2** 

As a healthcare staff member, I want to see appropriate textures (that is, suitable for use in representing a hospital or clinic) mapped onto the floor, walls, and so on.

Its description should be imported from a JSON (JavaScript Object Notation) formatted file. The floor must consist of several surgical  rooms. Each room must be enclosed by walls and include a door and a surgical table. There should be no representation of the ceiling. If a room is being used at any given time, a 3D model of a human body should be lying on the table. Models can either be created or imported.

**Acceptance criteria:**

* All floor areas must display textures appropriate to their function (e.g., hallway textures for corridors, room textures for surgical areas).
* Wall textures must differentiate between interior and exterior surfaces.
* Doors should have distinct textures for easy identification.
* The visualization should load and display textures dynamically from a configuration file.

## 3. Analysis

* Texture Appropriateness: Ensure textures convey the intended hospital environment.
* Performance: Optimize texture loading to prevent lag or rendering delays.
* Dynamic Configuration: Enable customization via a JSON file, allowing flexibility in texture assignments.

* Utilize Three.js for rendering the 3D environment.
* Import textures dynamically from paths specified in the JSON file used in US 6.5.1.
* Enhance the texture mapping logic to handle various surface types (e.g., ground, walls, doors).


## 4. Design

### 4.1. Realization

* Textures will be dynamically loaded and applied to specific surfaces. The JSON file structure will include additional fields for texture URLs and their corresponding usage, as detailed below:
```
{
  "groundTextureUrl": "./textures/ground.jpg",
  "roomGroundTextureUrl": "./textures/roomGround.jpg",
  "roomWallInsideTextureUrl": "./textures/roomInside.jpg",
  "roomWallOutsideTextureUrl": "./textures/roomOutside.jpg",
  "roomWallInsideWithDoorTextureUrl": "./textures/roomDoorInside.jpg",
  "roomWallOutsideWithDoorTextureUrl": "./textures/roomDoorOutside.jpg",
  "doorTextureUrl": "./textures/door.jpg"
}
```
**Texture Application Logic:**

* Floor:

    Apply groundTextureUrl to non-room areas.
    Apply roomGroundTextureUrl to room floors.

* Walls:

    Differentiate between roomWallInsideTextureUrl and roomWallOutsideTextureUrl.
    Apply roomWallInsideWithDoorTextureUrl and roomWallOutsideWithDoorTextureUrl for walls with doors.

* Doors:

Use doorTextureUrl for door objects.

## 5. Implementation

**Code Example**

* Floor Class (Texture Application):
```
const groundMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(description.groundTextureUrl)
});
const roomGroundMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(description.roomGroundTextureUrl)
});
```
* Wall Class (Interior/Exterior Texture Mapping):
```
const wallInsideMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(this.insideTextureUrl)
});
const wallOutsideMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(this.outsideTextureUrl)
});

```
* Door Texture:
```
const doorMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(description.doorTextureUrl)
});

```
## 6. Integration/Demonstration

**Integration Steps:**
* Add texture files to the designated project folder.
* Update the JSON configuration file with the texture paths.
* Test the visualization to ensure textures are correctly applied to all relevant surfaces.

**Visual Output:**
* Rooms display distinct wall and floor textures.
* Hallways and empty areas use appropriate ground textures.
* Doors are visually identifiable with unique textures.