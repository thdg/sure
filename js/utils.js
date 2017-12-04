
function loadAsset(name, file, scale, rotation, translation) {
    loading++;
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
        }
    };
    var onError = function ( xhr ) { console.log("FAILED TO LOAD MODEL") };
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


KEYCODES = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "w": 87,
    "a": 65,
    "s": 83,
    "d": 68,
    "p": 80,
    "m": 77
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

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
