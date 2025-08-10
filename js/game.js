let scene, camera, renderer, player, army, road, obstacles = [];
let gameOver = false, frame = 0, speed = 0.12, muted = false;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 4, 10);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('cvs'), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 5);
  scene.add(dir);

  const g = new THREE.PlaneGeometry(10, 2000);
  const m = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('assets/ground.jpg') });
  m.map.wrapS = m.map.wrapT = THREE.RepeatWrapping;
  m.map.repeat.set(1, 100);
  road = new THREE.Mesh(g, m);
  road.rotation.x = -Math.PI / 2;
  road.position.z = -1000;
  scene.add(road);

  const pGeo = new THREE.PlaneGeometry(1, 2);
  const pMat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('assets/player.png'),
    transparent: true
  });
  player = new THREE.Mesh(pGeo, pMat);
  player.position.set(0, 1, 0);
  scene.add(player);

  const aGeo = new THREE.PlaneGeometry(1.2, 2);
  const aMat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('assets/soldier.png'),
    transparent: true
  });
  army = new THREE.Mesh(aGeo, aMat);
  army.position.set(0, 1, 8);
  scene.add(army);

  window.addEventListener('resize', onResize);
  window.addEventListener('touchstart', jump, { passive: false });
  document.getElementById('startBtn').onclick = startGame;
  document.getElementById('restartBtn').onclick = () => location.reload();
  document.getElementById('muteBtn').onclick  = toggleMute;
}

function startGame() {
  gameOver = false;
  document.getElementById('startBtn').style.display = 'none';
  if (!muted) document.getElementById('bgm').play();
  animate();
}

function toggleMute() {
  muted = !muted;
  const audio = document.getElementById('bgm');
  audio.muted = muted;
  document.getElementById('muteBtn').textContent = muted ? '🔇' : '🔊';
}

function animate() {
  if (gameOver) return;
  requestAnimationFrame(animate);

  road.position.z += speed;
  if (road.position.z > 0) road.position.z = -1000;

  army.position.x = player.position.x;
  army.position.z -= speed * 0.9;

  if (frame % 120 === 0) {
    const oGeo = new THREE.PlaneGeometry(1, 1 + Math.random());
    const oMat = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('assets/obstacle.png'),
      transparent: true
    });
    const obs = new THREE.Mesh(oGeo, oMat);
    obs.position.set((Math.random() - 0.5) * 6, 1, -50);
    scene.add(obs);
    obstacles.push(obs);
  }

  obstacles.forEach(o => o.position.z += speed);
  obstacles = obstacles.filter(o => o.position.z < 15);
  
  const dist = army.position.distanceTo(player.position);
  const armyClose = dist < 2.5;
  const hitObstacle = obstacles.some(o => o.position.distanceTo(player.position) < 1.5);
  if (armyClose || hitObstacle) endGame();

  document.getElementById('distance').textContent = `军队距离：${Math.max(0, Math.round(dist - 2))} m`;

  renderer.render(scene, camera);
  frame++;
}

let jumping = false;
function jump(e) {
  if (e) e.preventDefault();
  if (jumping || gameOver) return;
  jumping = true;
  let jumpUp = () => {
    if (player.position.y < 3) {
      player.position.y += 0.15;
      requestAnimationFrame(jumpUp);
    } else {
      let jumpDown = () => {
        if (player.position.y > 1) {
          player.position.y -= 0.15;
          requestAnimationFrame(jumpDown);
        } else {
          player.position.y = 1;
          jumping = false;
        }
      };
      jumpDown();
    }
  };
  jumpUp();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function endGame() {
  gameOver = true;
  document.getElementById('bgm').pause();
  document.getElementById('restartBtn').style.display = 'inline-block';
}

init();
