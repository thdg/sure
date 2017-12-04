var playerVM;

function initVirtualScene() {
    var canvas1 = document.getElementById( 'canvas1' );
    var mm = document.getElementById( 'minimap' );
    virtualCam = new THREE.PerspectiveCamera( 45, canvas1.width/canvas1.height, 1, 2000 );
    mmCam = new THREE.PerspectiveCamera( 45, 1, 1, 2000 );

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

    var audioLoader = new THREE.AudioLoader();

    //Load a sound and set it as the Audio object's buffer
    audioLoader.load( 'sounds/deathb.wav', function( buffer ) {
        SOUNDS["rawr"] = buffer;
    });
    audioLoader.load( 'sounds/gmae.wav', function( buffer ) {
        SOUNDS["ping"] = buffer;
    });


    // model
    var castle = MODELS["castle"];
    scene.add(castle);

    var numberOfTrees = 1500;
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


    playerVM = new THREE.Mesh(
        new THREE.CubeGeometry(5, 5, 5),
        new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe:false})
    );
    scene.add(playerVM);

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
}
