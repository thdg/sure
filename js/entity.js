function Entity() { }

Entity.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }

    // I am not dead yet!
    this._isDeadNow = false;

    scene.add(this.model);
};

Entity.prototype.getPos = function () {
    return this.model.position;
};

Entity.prototype.setPos = function (pos) {
    this.model.position.x = pos.x;
    this.model.position.y = pos.y;
    this.model.position.z = pos.z;
};

Entity.prototype.translate = function (move) {
    this.model.position = this.model.position.add(move);
};

// this method is "abstract"
Entity.prototype.getRadius = function () {
    return 0;
};

Entity.prototype.hit = function () {
    this.kill();
};

Entity.prototype.kill = function () {
    this._isDeadNow = true;
    scene.remove(this.model);
};
