// Соболев А. Ю. М8О-307Б
// Вариант №17: NURBS, n = 5, k = 3
var container, stats;

var camera, scene, renderer;
var group;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;

var properties = {
    w1: 1, w2: 1, w3: 1, w4: 1, w5: 1,
    x1: 100, y1: 100,
    x2: 200, y2: 100,
    x3: 100, y3: 200,
    x4: 100, y4: 300,
    x5: 300, y5: 100,
};

// запускаем при загрузке окна
window.onload = function() {
    // инициализация
    init();
    //запускаем рекурсивную функцию анимации, отрисовывающую каждый кадр
    animate();
}

function init() {
    var gui = new dat.GUI();
    var f1 = gui.addFolder("Weights");
    // создаем интерфейс
    f1.add(properties, 'w1').min(0.1).max(5).step(0.1);
    f1.add(properties, 'w2').min(0.1).max(5).step(0.1);
    f1.add(properties, 'w3').min(0.1).max(5).step(0.1);
    f1.add(properties, 'w4').min(0.1).max(5).step(0.1);
    f1.add(properties, 'w5').min(0.1).max(5).step(0.1);
    var f2 = gui.addFolder("Dot 1");
    f2.add(properties, 'x1').min(0).max(500).step(1);
    f2.add(properties, 'y1').min(0).max(500).step(1);
    var f2 = gui.addFolder("Dot 2");
    f2.add(properties, 'x2').min(0).max(500).step(1);
    f2.add(properties, 'y2').min(0).max(500).step(1);
    var f2 = gui.addFolder("Dot 3");
    f2.add(properties, 'x3').min(0).max(500).step(1);
    f2.add(properties, 'y3').min(0).max(500).step(1);
    var f2 = gui.addFolder("Dot 4");
    f2.add(properties, 'x4').min(0).max(500).step(1);
    f2.add(properties, 'y4').min(0).max(500).step(1);
    var f2 = gui.addFolder("Dot 5");
    f2.add(properties, 'x5').min(0).max(500).step(1);
    f2.add(properties, 'y5').min(0).max(500).step(1);
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 0, 150, 750 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    scene.add( new THREE.AmbientLight( 0x808080 ) );

    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    group = new THREE.Group();
    group.position.y = 50;
    scene.add( group );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    window.addEventListener( 'resize', onWindowResize, false );
}


function onWindowResize() {
    windowHalfX = window.innerWidth / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

// обработка событий нажатий на кнопку мыши
function onDocumentMouseDown( event ) {
    event.preventDefault();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
}

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}

function onDocumentMouseUp() {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut() {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function animate() {
    requestAnimationFrame( animate );
    var selectedObject = scene.getObjectByName("line");
    group.remove( selectedObject );
    var nurbsControlPoints = [];
    var nurbsKnots = [];
    var nurbsDegree = 3;

    for ( var i = 0; i <= nurbsDegree; i ++ ) { nurbsKnots.push( 0 ); }
    var j = 5;
    var i = 0;
    nurbsControlPoints.push(new THREE.Vector4(
        properties.x1, properties.y1, properties.z1, properties.w1
    ));
    var knot1 = (i + 1) / (j - nurbsDegree);
    nurbsKnots.push(THREE.Math.clamp(knot1, 0, 1));
    i++;
    nurbsControlPoints.push(new THREE.Vector4(
        properties.x2, properties.y2, properties.z2, properties.w2
    ));
    var knot2 = (i + 1) / (j - nurbsDegree);
    nurbsKnots.push(THREE.Math.clamp(knot2, 0, 1));
    i++;
    nurbsControlPoints.push(new THREE.Vector4(
        properties.x3, properties.y3, properties.z3, properties.w3
    ));
    var knot3 = (i + 1) / (j - nurbsDegree);
    nurbsKnots.push(THREE.Math.clamp(knot3, 0, 1));
    i++;
    nurbsControlPoints.push(new THREE.Vector4(
        properties.x4, properties.y4, properties.z4, properties.w4
    ));
    var knot4 = (i + 1) / (j - nurbsDegree);
    nurbsKnots.push(THREE.Math.clamp(knot4, 0, 1));
    i++;
    nurbsControlPoints.push(new THREE.Vector4(
        properties.x5, properties.y5, properties.z5, properties.w5
    ));
    var knot5 = (i + 1) / (j - nurbsDegree);
    nurbsKnots.push(THREE.Math.clamp(knot5, 0, 1));
    i++;
    nurbsControlPoints.push(new THREE.Vector4(
        properties.x6, properties.y6, properties.z6, properties.w6
    ));

    var nurbsCurve = new THREE.NURBSCurve( nurbsDegree, nurbsKnots, nurbsControlPoints );

    var nurbsGeometry = new THREE.BufferGeometry();
    nurbsGeometry.setFromPoints( nurbsCurve.getPoints( 200 ) );

    var nurbsMaterial = new THREE.LineBasicMaterial( { color: 0x333333 } );

    var nurbsLine = new THREE.Line( nurbsGeometry, nurbsMaterial );
    nurbsLine.position.set( 0, 0, 0 );
    nurbsLine.name = "line";
    group.add( nurbsLine );

    render();
}

function render() {
    group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
    renderer.render( scene, camera );
}
