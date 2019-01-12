// Соболев А. Ю. М8О-307Б
var camera, controls, scene, renderer, geometry;
var properties = {
    h: 18,
    reflectivity: 1.0, // светоотражающее свойство
    t: 0,              // смещение по оси y
    x: 0, y:0, z:0     // тут храним текущее положение объекта
};

//запускаем при загрузке окна
window.onload = function() {
    //если WebGL не доступен - сообщение об ошибке
    if ( WEBGL.isWebGLAvailable() === false ) {
        document.body.appendChild( WEBGL.getWebGLErrorMessage() );
    }
    //инициализация
    init();
    //запускаем рекурсивную функцию анимации, отрисовывающую каждый кадр
    animate();
}

function init() {
    //Тут создаем GUI
    var gui = new dat.GUI();
    gui.add(properties, 'h').min(4).max(100).step(1);
    gui.add(properties, 't').min(-5).max(5).step(0.5);
    gui.add( properties, 'reflectivity', 0.1, 2 );
    
    //сцена
    scene = new THREE.Scene();
    //цвет сцены
    scene.background = new THREE.Color( 0xcccccc );
    //туман для красоты
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    //renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('WebGL-output').setAttribute('width', window.innerWidth);
    document.getElementById('WebGL-output').setAttribute('height', window.innerHeight);
    document.getElementById('WebGL-output').appendChild(renderer.domElement);
    //камера
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 400, 200, 0 );
    // controls (позволяет управлять камерой при помощи мыши и клавиатуры)
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;
    
    // освещение
    //точечное освещение
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    var light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( - 1, - 1, - 1 );
    scene.add( light );
    //общий свет, светит "отовсюду"
    var light = new THREE.AmbientLight( 0x222222 );
    scene.add( light );
    //обработка события "изменение размера окна"
    window.addEventListener( 'resize', onWindowResize, false );
}

//если изменился размер окна - должен измениться размер renderer'а и настройки камеры
function onWindowResize() {
    //настраиваем пропорции камеры во избежание искажений
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //настраиваем окно renderer'а для того, чтобы оно занимало весь экран
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//функция, вызывающаяся раз за разом, в которой и происходит отрисовка объекта
function animate() {
    requestAnimationFrame( function() {animate();} );
    controls.update();
    
    //создание объекта
    geometry = new THREE.CylinderGeometry( 60, 60, 100, properties.h );
    //настройка цвета
    var newColor = new THREE.Color( 0x008800 );
    var material = new THREE.MeshPhysicalMaterial({color: newColor, flatShading: true, side: THREE.DoubleSide, reflectivity: properties.reflectivity}); // зеленая плоскость с невидимыми гранями
    //удаление предыдущего объекта со сцены
    var selectedObject = scene.getObjectByName("mesh");
    scene.remove( selectedObject );

    var mesh = new THREE.Mesh( geometry, material);
    properties.y += properties.t * 0.1;
    mesh.position.y += Math.cos(properties.y + mesh.position.y);
    mesh.name = "mesh";
    scene.add(mesh);
    var selectedObject = scene.getObjectByName("line");
    scene.remove( selectedObject );
    var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
    var line = new THREE.LineSegments( geometry, lineMaterial )
    line.position.y += Math.cos(properties.y + line.position.y);
    line.name = "line"
    scene.add( line );

    //рендерим сцену
    renderer.render( scene, camera );
}
