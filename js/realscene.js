
var scene2, renderer2, realCam, topCam;
var meshfloor, playerModel;

function initRealScene() {
    var canvas2 = document.getElementById( 'canvas2' );
    realCam = new THREE.PerspectiveCamera( 60, 1, 1, 1000 );
    scene2 = new THREE.Scene();

    topCam = new THREE.PerspectiveCamera( 60, 1, 1, 2000 );
    topCam.position.y = 120;
    topCam.rotation.x = -Math.PI/2;

    meshfloor = new THREE.Mesh(
	new THREE.PlaneGeometry(roomSize*2, roomSize*2, 16, 16),
	new THREE.MeshBasicMaterial({color:0x9f6d4c, wireframe:false})
    );
    meshfloor.rotation.x -= Math.PI/2;
    scene2.add(meshfloor);

    playerModel = new THREE.Mesh(
        new THREE.CubeGeometry(5, 5, 5),
        new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe:false})
    );
    scene2.add(playerModel);
    playerModel.position.set(0, HEIGHT, 0);
    realCam.position.set(0, HEIGHT, 20);
    realCam.lookAt(new THREE.Vector3(0, HEIGHT, 0).add(points[currentTarget]));

    renderer2 = new THREE.WebGLRenderer({ canvas: canvas2, antialias: true } );
    renderer2.setSize(200, 200);
    renderer2.setSize(canvas2.width, canvas2.height);
}
