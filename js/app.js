var container, stats;
var virtualCam, scene, renderer, listener, sound;
var lineM, lineG, line, line2;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var MODELS = {};
var SOUNDS = {};
var HEIGHT = 2.5;

var loaded = 0, loading = 0;
var prevTime;

loadAsset("castle", "SM_Fort", 1.0, new THREE.Vector3(0, -Math.PI/2, 0), new THREE.Vector3(0, -0.2, 0));
loadAsset("tree1", "sapin", 2.0);
loadAsset("tree2", "sapin2", 2.0);
loadAsset("tree3", "arbre1", 0.75);
loadAsset("dino", "dino", 10.00, new THREE.Vector3(0, Math.PI, 0), new THREE.Vector3(0, 3.1, 0));

(function load() {
    console.log("loading: " + loaded + "/" + loading);
    if (loaded === loading) {
        init();
        prevTime = performance.now();
        animate();
        return;
    }
    setTimeout(load, 100);
})();

var entities = [];

function init() {

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'click', onDocumentMouseClick, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    window.addEventListener( 'resize', onWindowResize, false );

    initVirtualScene();
    initRealScene();

    minimap = new THREE.WebGLRenderer({ alpha: false });
    minimap.setPixelRatio(window.devicePixelRatio);
    minimap.setSize(200, 200);
    minimap.setClearColor( 0x000000, .5 );
    minimap.domElement.id = "minimap";
    document.getElementById("container").appendChild(minimap.domElement);

}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    virtualCam.aspect = window.innerWidth / window.innerHeight;
    virtualCam.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

var movementSpeed = 30;
var rotationSpeed = 1.5;
var rotationAlterLeft = 0.80;
var rotationAlterRight = 1.20;

var rotationScale = 1;
var movementScale = 0.5;

var timePassed = 0;
var timeBetweenDinos = 5;
var nextDino = timeBetweenDinos;

var path = [];
var realPath = [];
var pathDelta = 0.200;

var renderPaths = false;
var paused = false;
function render() {

    var time = performance.now();
    var dt = ( time - prevTime ) / 1000;
    prevTime = time;

    if (!paused) {
        timePassed += dt;
        if (timePassed > nextDino) {
            //addDino();
            nextDino += timeBetweenDinos;
        }

        // Checks if to close to edge and spawns dino if is
        closeToTarget();

        if (pathDelta * path.length < timePassed) {
            path.push(virtualCam.position.clone());
            realPath.push(realCam.position.clone());

            if (renderPaths) {
                // Need more efficient way to do this
                scene.remove(line);
                lineM = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
                lineG = new THREE.Geometry();
                lineG.vertices = path;
                line = new THREE.Line(lineG, lineM);
                scene.add(line);

                scene2.remove(line2);
                lineM = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
                lineG = new THREE.Geometry();
                lineG.vertices = realPath;
                line2 = new THREE.Line(lineG, lineM);
                scene2.add(line2);
            }
        }

        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            if (!e.isDeadNow) {
                e.update(dt);
            }
        }

        var vDir = virtualCam.getWorldDirection(); // the virtual direction
        var rDir = realCam.getWorldDirection(); // the real direction

        if (KEYPRESSED[KEYCODES["w"]]) {
            virtualCam.position.add(vDir.multiplyScalar(movementSpeed * dt));
            realCam.position.add(rDir.multiplyScalar(movementSpeed * movementScale * dt));
        }
        if (KEYPRESSED[KEYCODES["s"]]) {
            virtualCam.position.sub(vDir.multiplyScalar(movementSpeed * dt));
            realCam.position.sub(rDir.multiplyScalar(movementSpeed * movementScale * dt));
        }
        if (KEYPRESSED[KEYCODES["a"]]) {
            virtualCam.rotation.y += rotationSpeed * rotationAlterLeft * dt;
            realCam.rotation.y += rotationSpeed * rotationScale * dt;
        }
        if (KEYPRESSED[KEYCODES["d"]]) {
            virtualCam.rotation.y -= rotationSpeed * rotationAlterRight * dt;
            realCam.rotation.y -= rotationSpeed * rotationScale * dt;
        }

        mmCam.position.x = virtualCam.position.x;
        mmCam.position.z = virtualCam.position.z;
        playerModel.position.x = realCam.position.x;
        playerModel.position.z = realCam.position.z;
    }

    if (eatKey("p")) {
        paused = !paused;
    }

    if (eatKey("m")) {
        renderPaths = !renderPaths;
    }

    renderer.render( scene, virtualCam );
    renderer2.render(scene2, topCam);
    minimap.render( scene, mmCam );
}

var raycaster = new THREE.Raycaster();

function onDocumentMouseClick(event) {
    event.preventDefault();

    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, virtualCam );
    for (var i=0; i < entities.length; i++) {
        var entity = entities[i];
        var intersections = raycaster.intersectObjects(entity.model.children);
        if (intersections.length > 0) {
            entity.hit();
        }
    }
}
