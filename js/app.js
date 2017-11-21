var container, stats;
var virtualCam, scene, renderer, listener, sound;
var lineM, lineG, line;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var MODELS = {};
var SOUNDS = {};
var HEIGHT = 2.5;

var loaded = 0, loading = 0;
var prevTime;

var scene2, renderer2, realCam;
var meshfloor;

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


function loadAsset(name, file, scale, rotation, translation) {
    loading++;
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    var onError = function ( xhr ) { };
    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'obj/' );
    mtlLoader.load( file + '.mtl', function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'obj/' );
        objLoader.load( file + '.obj', function ( object ) {
            object.scale.multiplyScalar(scale);
            if (rotation) {
                object.rotateX(rotation.x);
                object.rotateY(rotation.y);
                object.rotateZ(rotation.z);
            }
            if (translation) {
                object.translateX(translation.x);
                object.translateY(translation.y);
                object.translateZ(translation.z);
            }
            MODELS[name] = object;
            loaded++;
        }, onProgress, onError );
    });
}

var entities = [];

function init() {
    var canvas1 = document.getElementById( 'canvas1' );
    var mm = document.getElementById( 'minimap' );
    virtualCam = new THREE.PerspectiveCamera( 45, canvas1.width/canvas1.height, 1, 2000 );
    mmCam = new THREE.PerspectiveCamera( 45, mm.width/mm.height, 1, 2000 );

    // scene
    scene = new THREE.Scene();
    var ambientLight = new THREE.AmbientLight( 0xeeeeee, 1.0 );
    scene.add( ambientLight );
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    virtualCam.add( pointLight );
    virtualCam.position.y = HEIGHT;
    virtualCam.position.z = 500;
    scene.add( virtualCam );

    mmCam.position.y = 100;
    mmCam.position.z = virtualCam.position.z;
    mmCam.rotation.x = -Math.PI/2;

    listener = new THREE.AudioListener();
    virtualCam.add( listener );

    //sound.setBuffer( buffer );
    //sound.setLoop( true );
    //sound.play();

    var audioLoader = new THREE.AudioLoader();

    //Load a sound and set it as the Audio object's buffer
    audioLoader.load( 'sounds/deathb.wav', function( buffer ) {
        SOUNDS["rawr"] = buffer;
    });


    // model
    var castle = MODELS["castle"];
    scene.add(castle);

    addDino();

    var numberOfTrees = 2000;
    for (var i=0; i<numberOfTrees; i++) {
        var tree = MODELS["tree"+(i%3+1)].clone();
        var randomPos = function(min, max) {
            var v = new THREE.Vector2(1,1);
            v.multiplyScalar(Math.random()*(max-min) + min);
            v.rotateAround(new THREE.Vector2(0, 0), Math.random()*360);
            return v;
        };
        var pos = randomPos(50, 1000);

        tree.translateX(pos.x);
        tree.translateZ(pos.y);
        tree.rotateY(Math.random()*Math.PI*2);
        tree.scale.multiplyScalar(Math.random()*0.5+0.75);
        scene.add(tree);
    }


    var geometry = new THREE.PlaneGeometry( 10000, 10000, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0x51a540, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = -Math.PI/2;
    scene.add( plane );

    // Should be a plane
    // var roadM = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1000 });
    // var roadG = new THREE.Geometry();
    // roadG.vertices.push(new THREE.Vector3(0, 0.01, 500));
    // roadG.vertices.push(new THREE.Vector3(0, 0.01, 0));
    // var road = new THREE.Line(roadG, roadM);
    // scene.add(road);

    lineM = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 10 });
    lineG = new THREE.Geometry();
    //lineG.vertices.push(new THREE.Vector3(0, 2, 500));
    //lineG.vertices.push(new THREE.Vector3(0, 2, 0));
    line = new THREE.Line(lineG, lineM);
    scene.add(line);

    //
    renderer = new THREE.WebGLRenderer({ canvas: canvas1, antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x93f4ff, 1 );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'click', onDocumentMouseClick, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    //
    window.addEventListener( 'resize', onWindowResize, false );

    //Scene 2
    var canvas2 = document.getElementById( 'canvas2' );
    realCam = new THREE.PerspectiveCamera( 60, canvas2.width/canvas2.height, 1, 1000 );
    scene2 = new THREE.Scene();

    meshfloor = new THREE.Mesh(
	new THREE.PlaneGeometry(20,20,20,20),
	new THREE.MeshBasicMaterial({color:0x9f6d4c , wireframe:false})
    );
    meshfloor.rotation.x -= Math.PI/2;
    scene2.add(meshfloor);
    realCam.position.set(0, HEIGHT, -5);
    realCam.lookAt(new THREE.Vector3(0, HEIGHT, 0));
	
    renderer2 = new THREE.WebGLRenderer({ canvas: canvas2, antialias: true } );
    renderer2.setSize(canvas2.width, canvas2.height);

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

KEYCODES = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "w": 87,
    "a": 65,
    "s": 83,
    "d": 68,
    "p": 80
};

KEYPRESSED = {};
function eatKey(key) {
    var isDown = KEYPRESSED[KEYCODES[key]];
    KEYPRESSED[KEYCODES[key]] = false;
    return isDown;
}

function isPressed(key) {
    return KEYPRESSED[KEYCODES[key]];
}

function onKeyDown(event) {
    var key = event.keyCode;
    KEYPRESSED[key] = true;
}

function onKeyUp(event) {
    var key = event.keyCode;
    KEYPRESSED[key] = false;
}



function animate() {
    requestAnimationFrame( animate );
    render();
}

var movementSpeed = 30;
var rotationSpeed = 1.5;
var rotationAlterLeft = 1.15;
var rotationAlterRight = 0.85;

var timePassed = 0;
var timeBetweenDinos = 5;
var nextDino = timeBetweenDinos;

var path = [];
var pathDelta = 0.200;

var paused = false;
function render() {

    var time = performance.now();
    var dt = ( time - prevTime ) / 1000;
    prevTime = time;

    if (!paused) {
        timePassed += dt;
        if (timePassed > nextDino) {
            addDino();
            nextDino += timeBetweenDinos;
        }

        if (pathDelta * path.length < timePassed) {
            path.push(virtualCam.position.clone());
            //path.push(new THREE.Vector2(virtualCam.position.x, virtualCam.position.y));
            scene.remove(line);

            lineM = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
            lineG = new THREE.Geometry();
            lineG.vertices = path;
            line = new THREE.Line(lineG, lineM);
            scene.add(line);
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
        realCam.position.sub(rDir.multiplyScalar(movementSpeed/100 * dt));

        }
        if (KEYPRESSED[KEYCODES["s"]]) {
        virtualCam.position.sub(vDir.multiplyScalar(movementSpeed * dt));
        realCam.position.add(rDir.multiplyScalar(movementSpeed/100 * dt));
        }
        if (KEYPRESSED[KEYCODES["a"]]) {
        virtualCam.rotation.y += rotationSpeed * rotationAlterLeft * dt;
        realCam.rotation.y -= rotationSpeed * rotationAlterLeft/5 * dt;
        }
        if (KEYPRESSED[KEYCODES["d"]]) {
        virtualCam.rotation.y -= rotationSpeed * rotationAlterRight * dt;
        realCam.rotation.y += rotationSpeed * rotationAlterRight/5 * dt;
        }

        mmCam.position.x = virtualCam.position.x;
        mmCam.position.z = virtualCam.position.z;
    }

    if (eatKey("p")) {
        paused = !paused;
    }

    renderer.render( scene, virtualCam );
    renderer2.render(scene2, realCam);
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
