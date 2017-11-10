var container, stats;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var MODELS = {};
var HEIGHT = 2.5;

var loaded = 0, loading = 0;
var prevTime;

var scene2, renderer2, camera2;
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

function init() {
    var canvas1 = document.getElementById( 'canvas1' );
    camera = new THREE.PerspectiveCamera( 45, canvas1.width/canvas1.height, 1, 2000 );

    // scene
    scene = new THREE.Scene();
    var ambientLight = new THREE.AmbientLight( 0xeeeeee, 1.0 );
    scene.add( ambientLight );
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    camera.position.y = HEIGHT;
    camera.position.z = 500;
    scene.add( camera );
    // model

    var castle = MODELS["castle"];
    scene.add(castle);

    var dino = MODELS["dino"];//.clone();
    dino.translateZ(-400);
    scene.add(dino);

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

    //
    renderer = new THREE.WebGLRenderer({ canvas: canvas1, antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x93f4ff, 1 );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    //
    window.addEventListener( 'resize', onWindowResize, false );


    //Scene 2
    var canvas2 = document.getElementById( 'canvas2' );
    camera2 = new THREE.PerspectiveCamera( 60, canvas2.width/canvas2.height, 1, 1000 );
    scene2 = new THREE.Scene();

    meshfloor = new THREE.Mesh(
	new THREE.PlaneGeometry(20,20,20,20),
	new THREE.MeshBasicMaterial({color:0x9f6d4c , wireframe:false})
    );
    meshfloor.rotation.x -= Math.PI/2;
    scene2.add(meshfloor);
    camera2.position.set(0, HEIGHT, -5);
    camera2.lookAt(new THREE.Vector3(0, HEIGHT, 0));
	
    renderer2 = new THREE.WebGLRenderer({ canvas: canvas2, antialias: true } );
    renderer2.setSize(canvas2.width, canvas2.height);
}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
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
};
KEYPRESSED = {};

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
var rotationSpeed = 2;
var rotationAlterLeft = 1.25;
var rotationAlterRight = 0.75;
function render() {
    var time = performance.now();
    var dt = ( time - prevTime ) / 1000;
    prevTime = time;

    var dir = camera.getWorldDirection();
    if (KEYPRESSED[KEYCODES["w"]]) {
	camera.position.add(dir.multiplyScalar(movementSpeed * dt));
	camera2.position.sub(dir.multiplyScalar(movementSpeed * dt/100));
		
    }
    if (KEYPRESSED[KEYCODES["s"]]) {
	camera.position.sub(dir.multiplyScalar(movementSpeed * dt));
	camera2.position.add(dir.multiplyScalar(movementSpeed * dt/100));
    }
    if (KEYPRESSED[KEYCODES["a"]]) {
	camera.rotation.y += rotationSpeed * rotationAlterLeft * dt;
	camera2.rotation.y -= rotationSpeed * rotationAlterLeft * dt/5;
    }
    if (KEYPRESSED[KEYCODES["d"]]) {
	camera.rotation.y -= rotationSpeed * rotationAlterRight * dt;
	camera2.rotation.y += rotationSpeed * rotationAlterLeft * dt/5;
    }



    renderer.render( scene, camera );
    renderer2.render(scene2, camera2);
}
