
function Dino(descr) {
    this.setup(descr);
    this.speed = 30;
    this.forward = new THREE.Vector3(0, Math.PI, 0);
    this.model.name = "dino";
    this.model.entity = this;
    this.screamed = false;
}

Dino.prototype = new Entity();

Dino.prototype.update = function (dt) {

    var pos = this.getPos();

    if (!this.screamed && pos.distanceTo(virtualCam.position) < 30) {
        this.sound = new THREE.PositionalAudio(listener);
        this.sound.setVolume(1.0);
        this.sound.setBuffer(SOUNDS.rawr);
        this.sound.panner.positionX.value = pos.x;
        this.sound.panner.positionY.value = pos.y;
        this.sound.panner.positionZ.value = pos.z;
        this.sound.play();
        this.screamed = true;
    }

    if (pos.distanceTo(virtualCam.position) > 20) {
        var dir = virtualCam.position.clone().sub(pos);
        dir.y = 0;
        dir.normalize();
        var move = dir.multiplyScalar(this.speed * dt);
        this.translate(move);
    } else {
	if (!this.model.entity._isDeadNow) {
		let health = document.getElementById("health")
		health.value -= 1;
	}
    }
    this.model.lookAt(virtualCam.position);
    this.model.rotation.y += this.forward.y;
};

Dino.prototype.getRadius = function () {
    return 5;
};

function addDino(pos) {
    var dino = new Dino({
        model: MODELS["dino"].clone()
    });
    if (pos) {
        dino.setPos(new THREE.Vector3(pos.x, virtualCam.position.y, pos.z));
    } else {
        dino.setPos((new THREE.Vector3(Math.random()*80-40, 0, -Math.random()*80)).add(virtualCam.position));
    }
    entities.push(dino);
    return dino;
}
