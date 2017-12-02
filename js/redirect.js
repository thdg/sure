var roomSize = 40;
var margin = 20;
var effectiveRoomSize = roomSize - margin;
// This means the room is effectively 20 units wide
// Leaves 5 units for error, walking to far

var points = [
    new THREE.Vector3(effectiveRoomSize, 0, 0),
    new THREE.Vector3(0, 0, -effectiveRoomSize),
    new THREE.Vector3(-effectiveRoomSize, 0, 0),
    new THREE.Vector3(0, 0, effectiveRoomSize)
];

currentTarget = 0;
function findNextTarget() {
    // Return the point we want to redirect to
    return (currentTarget + 1)%points.length; // Just go circles no matter what
}

var lastSpawnedWhen;
function isToCloseToEdge() {
    var pos = realCam.position;
    // If from any direction to an edge is less than margin return true
    if (pos.x > roomSize-margin || pos.x < -roomSize+margin)
        return true;
    if (pos.z > roomSize-margin || pos.z < -roomSize+margin)
        return true;
}

function closeToTarget() {
    lastSpawnedWhen = lastSpawnedWhen ? lastSpawnedWhen : realCam.position.clone();
    var last = lastSpawnedWhen.clone();
    var dist = last.clone().sub(realCam.position).length();
    if (dist > margin && isToCloseToEdge()) {
        spawnStimuli();
        currentTarget = findNextTarget();
        lastSpawnedWhen = realCam.position.clone();
    }
}


function spawnStimuli() {
    // Just set spawn position as opposide of castle (0,0,0)
    var spawnPos = virtualCam.position.clone();
    spawnPos.y = 0;
    spawnPos.normalize().multiplyScalar(10);
    addDino(spawnPos.add(virtualCam.position));
}
