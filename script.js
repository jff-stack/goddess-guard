// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const container = document.getElementById('3d-container');
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Load 3D model (you'll need to provide the model file)
const loader = new THREE.GLTFLoader();
loader.load('models/breast_model.glb', function(gltf) {
  const model = gltf.scene;
  scene.add(model);

  // Add interactive sensors
  const sensors = [];

  // Create dummy sensors as spheres (replace with actual sensor models)
  const sensorGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const sensorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  const sensorPositions = [
    { x: 0, y: 0.5, z: 0.5, name: 'Gyroscopic Vibration Sensor', description: 'Detects anomalies in breast tissue.' },
    { x: 0.2, y: 0.5, z: 0.5, name: 'Bluetooth Beacon', description: 'Connects to the monitoring app.' },
    { x: -0.2, y: 0.5, z: 0.5, name: 'Piezoelectric Detector', description: 'Monitors cardiovascular signals.' },
  ];

  sensorPositions.forEach(pos => {
    const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    sensor.position.set(pos.x, pos.y, pos.z);
    sensor.userData = { name: pos.name, description: pos.description };
    model.add(sensor);
    sensors.push(sensor);
  });

  // Raycaster for detecting mouse over
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseMove(event) {
    // Normalize mouse coordinates
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(sensors);

    if (intersects.length > 0) {
      const sensor = intersects[0].object;
      document.getElementById('info-box').hidden = false;
      document.getElementById('sensor-name').textContent = sensor.userData.name;
      document.getElementById('sensor-description').textContent = sensor.userData.description;
    } else {
      document.getElementById('info-box').hidden = true;
    }
  }

  window.addEventListener('mousemove', onMouseMove, false);

  animate();
}, undefined, function(error) {
  console.error(error);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

camera.position.z = 2;
