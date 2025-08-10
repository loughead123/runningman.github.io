const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
const dpr = window.devicePixelRatio || 1;
const W = 375, H = 667;
cvs.width  = W * dpr;
cvs.height = H * dpr;
ctx.scale(dpr, dpr);

const player = { x: 80, y: H-120, w: 40, h: 60, vy: 0, onGround: true };
const army   = { x: W+50, y: H-120, w: 50, h: 65, speed: 3.5 };
let obstacles = [];
let gameOver = false;

const startBtn   = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const bgm        = document.getElementById('bgm');
startBtn.onclick   = startGame;
restartBtn.onclick = () => location.reload();

window.addEventListener('touchstart', jump, { passive: false });
window.addEventListener('keydown', e => { if (e.code === 'Space') jump(); });
function jump(e) {
  if (e) e.preventDefault();
  if (!gameOver && player.onGround) {
    player.vy = -18;
    player.onGround = false;
  }
}

let frame = 0;
function loop() {
  if (gameOver) return;
  update();
  draw();
  frame++;
  requestAnimationFrame(loop);
}

function update() {
  player.y += player.vy;
  player.vy += 0.9;
  if (player.y + player.h >= H) {
    player.y = H - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  army.x -= army.speed;
  if (army.x + army.w < 0) army.x = W + 50;
  
  if (frame % 90 === 0) {
    obstacles.push({
      x: W + 30,
      y: H - 80 - Math.random() * 100,
      w: 30,
      h: 50 + Math.random() * 60
    });
  }
  obstacles.forEach(o => o.x -= 6);
  obstacles = obstacles.filter(o => o.x + o.w > -30);
  
  const crash = (a, b) =>
    a.x < b.x + b.w && a.x + a.w > b.x &&
    a.y < b.y + b.h && a.y + a.h > b.y;
  if (crash(player, army) || obstacles.some(o => crash(player, o))) {
    endGame();
  }

  const dist = Math.max(0, army.x - (player.x + player.w));
  document.getElementById('distance').textContent = '距离：' + Math.round(dist) + ' m';
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#00f';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = '#0f0';
  ctx.fillRect(army.x, army.y, army.w, army.h);
  
  ctx.fillStyle = '#f00';
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));
}

function startGame() {
  gameOver = false;
  startBtn.style.display = 'none';
  bgm.play();
  loop();
}
function endGame() {
  gameOver = true;
  bgm.pause();
  restartBtn.style.display = 'inline-block';
}
