
function Wall(descr) {
    this.setup(descr);
    this.speed = 20;
    this.forward = new THREE.Vector3(0, Math.PI, 0);
    this.model.name = "wall";
    this.model.entity = this;
    this.screamed = false;
    this.timeToLive = 5;

    var look = virtualCam.position.clone();
    look.y = 0;
    this.model.lookAt(look);
    this.model.rotation.y += this.forward.y;
}

Wall.prototype = new Entity();

Wall.prototype.update = function (dt) {
    // Wall does nothing
};

Wall.prototype.getRadius = function () {
    return 5;
};

Wall.prototype.hit = function () {
    // Nothing happens on hit
};

function addWall(pos) {
    var wall = new Wall({
        model: MODELS["wall"].clone()
    });
    if (pos) {
        wall.setPos(new THREE.Vector3(pos.x, 1.7, pos.z));
    } else {
        wall.setPos((new THREE.Vector3(0, -0.8, -40)).add(virtualCam.position));
    }
    entities.push(wall);
    return wall;
}
