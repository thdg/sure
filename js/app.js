var container, stats;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var MODELS = {};

var loaded = 0, loading = 0;

loadAsset("castle", "SM_Fort", 1.0);
loadAsset("tree1", "sapin", 2.0);
loadAsset("tree2", "sapin2", 2.0);
loadAsset("tree3", "arbre1", 0.75);

(function load() {
    console.log("loading: " + loaded + "/" + loading);
    if (loaded === loading) {
        init();
        animate();
        return;
    }
    setTimeout(load, 100);
})();

function loadAsset(name, file, scale) {
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
            MODELS[name] = object;
            loaded++;
        }, onProgress, onError );
    });
}

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 250;

    // scene
    scene = new THREE.Scene();
    var ambientLight = new THREE.AmbientLight( 0xeeeeee, 1.0 );
    scene.add( ambientLight );
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );
    // model

    scene.add(MODELS["castle"]);

    var numberOfTrees = 1000;
    for (var i=0; i<numberOfTrees; i++) {
        var tree = MODELS["tree"+(i%3+1)].clone();
        var randomPos = function(min, max) {
            var v = new THREE.Vector2(1,1);
            v.multiplyScalar(Math.random()*(max-min) + min);
            v.rotateAround(new THREE.Vector2(0, 0), Math.random()*360);
            return v;
        };
        var pos = randomPos(50, 350);
        tree.position.x += pos.x;
        tree.position.z += pos.y;
        tree.scale.multiplyScalar(Math.random()*0.5+0.75);
        scene.add(tree);
    }


    var geometry = new THREE.PlaneGeometry( 1000, 1000, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0x51a540, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = -Math.PI/2;
    scene.add( plane );

    //
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //
    window.addEventListener( 'resize', onWindowResize, false );
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
//
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}
