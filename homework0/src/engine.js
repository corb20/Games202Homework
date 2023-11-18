//这两行是会被运行的代码
var cameraPosition = [-20, 180, 250];
GAMES202Main();

//定义相应的函数
function GAMES202Main() {
	const canvas = document.querySelector('#glcanvas');
	canvas.width = window.screen.width;
	canvas.height = window.screen.height;
	const gl = canvas.getContext('webgl');
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	//创建一个透视相机（PerspectiveCamera），用于渲染3D场景。相机具有视场角（fov）、宽高比、近剪裁面和远剪裁面等属性。
	const camera = new THREE.PerspectiveCamera(75, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000);
	//创建相机控制器 cameraControls，它使用户能够通过鼠标和键盘控制相机的视角。
	const cameraControls = new THREE.OrbitControls(camera, canvas);
	cameraControls.enableZoom = true;
	cameraControls.enableRotate = true;
	cameraControls.enablePan = true;
	cameraControls.rotateSpeed = 0.3;
	cameraControls.zoomSpeed = 1.0;
	cameraControls.panSpeed = 2.0;

	function setSize(width, height) {
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
	setSize(canvas.clientWidth, canvas.clientHeight);
	window.addEventListener('resize', () => setSize(canvas.clientWidth, canvas.clientHeight));

	//设置相机的初始位置和目标位置。
	camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
	cameraControls.target.set(0, 1, 0);

	//创建一个点光源 pointLight，它用于照亮场景中的物体。
	const pointLight = new PointLight(250, [1, 1, 1]);

	//创建一个渲染器 renderer，它将渲染3D场景，并将光源添加到渲染器中。
	const renderer = new WebGLRenderer(gl, camera);
	renderer.addLight(pointLight);
	//调用 loadOBJ 函数，加载一个OBJ模型文件，该函数接受渲染器、模型路径和模型名称作为参数。
	//材质和shader在loadOBJ中实现
	loadOBJ(renderer, 'assets/mary/', 'Marry');

	var guiParams = {
		modelTransX: 0,
		modelTransY: 0,
		modelTransZ: 0,
		modelScaleX: 52,
		modelScaleY: 52,
		modelScaleZ: 52,
	}
	function createGUI() {
		const gui = new dat.gui.GUI();
		const panelModel = gui.addFolder('Model properties');
		const panelModelTrans = panelModel.addFolder('Translation');
		const panelModelScale = panelModel.addFolder('Scale');
		panelModelTrans.add(guiParams, 'modelTransX').name('X');
		panelModelTrans.add(guiParams, 'modelTransY').name('Y');
		panelModelTrans.add(guiParams, 'modelTransZ').name('Z');
		panelModelScale.add(guiParams, 'modelScaleX').name('X');
		panelModelScale.add(guiParams, 'modelScaleY').name('Y');
		panelModelScale.add(guiParams, 'modelScaleZ').name('Z');
		panelModel.open();
		panelModelTrans.open();
		panelModelScale.open();
	}

	createGUI();

	function mainLoop(now) {
		cameraControls.update();

		renderer.render(guiParams);
		requestAnimationFrame(mainLoop);
	}
	requestAnimationFrame(mainLoop);
}
