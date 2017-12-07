
function Chest(descr) {
    this.setup(descr);
    this.model.name = "chest";
    this.model.entity = this;

    this.sound = new THREE.PositionalAudio(listener);
    this.sound.setVolume(1.0);

    var target = virtualCam.position;
    //this.model.lookAt(target);
    this.pinged = false;
}

Chest.prototype = new Entity();

Chest.prototype.update = function (dt) {
    if (!this.pinged) {
        this.sound = new THREE.PositionalAudio(listener);
        this.sound.setVolume(1.0);
        this.sound.setBuffer(SOUNDS.ping);
        this.sound.panner.positionX.value = this.getPos().x;
        this.sound.panner.positionY.value = this.getPos().y;
        this.sound.panner.positionZ.value = this.getPos().z;
        this.sound.play();
        this.pinged = true;
    }
    this.model.position.y = 0;
};

Chest.prototype.getRadius = function () {
    return 5;
};

Chest.prototype.hit = function () {
    modifyCounter();
    this.kill();
};

function addChest(pos) {
    var chest = new Chest({
        model: MODELS["chest"].clone()
    });
    if (pos) {
        chest.setPos(new THREE.Vector3(pos.x, 0, pos.z));
    } else {
        chest.setPos((new THREE.Vector3(Math.random()*20-10, 0, -Math.random()*20)).add(virtualCam.position));
    }
    entities.push(chest);
    return chest;
}
