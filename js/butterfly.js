
function Butterfly(descr) {
    this.setup(descr);
    this.speed = 30;
    this.forward = new THREE.Vector3(0, Math.PI, 0);
    this.model.name = "butterfly";
    this.model.entity = this;
    this.screamed = false;
}

Butterfly.prototype = new Entity();

Butterfly.prototype.update = function (dt) {

    var pos = this.getPos();

    if (pos.distanceTo(virtualCam.position) > 20) {
        var dir = virtualCam.position.clone().sub(pos);
        dir.y = 0;
        dir.normalize();
        var move = dir.multiplyScalar(this.speed * dt);
        this.translate(move);
    }
    this.model.lookAt(virtualCam.position);
    this.model.rotation.y += this.forward.y;
};

Butterfly.prototype.getRadius = function () {
    return 5;
};

function addButterfly(pos) {
    var butterfly = new Butterfly({
        model: MODELS["butterfly"].clone()
    });
    if (pos) {
        butterfly.setPos(new THREE.Vector3(pos.x, 0, pos.z));
    } else {
        butterfly.setPos((new THREE.Vector3(Math.random()*80-40, 0, Math.random()*80-40)).add(virtualCam.position));
    }
    entities.push(butterfly);
    return butterfly;
}
