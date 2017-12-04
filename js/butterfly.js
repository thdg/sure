
function Butterfly(descr) {
    this.setup(descr);
    this.speed = 20;
    this.forward = new THREE.Vector3(0, Math.PI, 0);
    this.model.name = "butterfly";
    this.model.entity = this;
    this.screamed = false;
    this.timeToLive = 5;
}

Butterfly.prototype = new Entity();

Butterfly.prototype.update = function (dt) {

    this.timeToLive -= dt;
    if (this.timeToLive < 0) this.kill();

    var dir = virtualCam.position.clone(); //.multiplyScalar(-1);
    dir.y = 0;
    dir.normalize();
    var move = dir.multiplyScalar(this.speed * dt);
    this.translate(move);

    this.model.lookAt(virtualCam.position);
    this.model.rotation.y += this.forward.y;
};

Butterfly.prototype.getRadius = function () {
    return 5;
};

Butterfly.prototype.hit = function () {
    // Nothing happens on hit
};

function addButterfly(pos) {
    var butterfly = new Butterfly({
        model: MODELS["butterfly"].clone()
    });
    if (pos) {
        butterfly.setPos(new THREE.Vector3(pos.x, HEIGHT, pos.z));
    } else {
        butterfly.setPos((new THREE.Vector3(0, HEIGHT, -40)).add(virtualCam.position));
    }
    entities.push(butterfly);
    return butterfly;
}
