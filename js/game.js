(function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startBtn');
  const distanceSpan = document.getElementById('armyDist');
  const muteBtn = document.getElementById('muteBtn');

  let W, H, running = false, lastTime = 0;
  let groundOffset = 0;

  const cam = {
    centerX: 0,
    centerY: 0,
    horizon: 0,
    scale: 240,
    far: 40
  };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cam.centerX = W / 2;
    cam.centerY = H / 2;
    cam.horizon = H * 0.8;
  }
  window.addEventListener('resize', resize);
  resize();

  function startGame() {
    running = true;
    startBtn.style.display = 'none';
    document.getElementById('distance').style.display = 'block';
    Player.reset();
    Obstacle.list.length = 0;
    AudioManager.bgm.currentTime = 0;
    AudioManager.bgm.play();
    requestAnimationFrame(loop);
  }

  function endGame() {
    running = false;
    startBtn.style.display = 'block';
    startBtn.textContent = '再来一次';
    AudioManager.bgm.pause();
  }

  function drawCityBG() {
    const sky = ctx.createLinearGradient(0, 0, 0, cam.horizon);
    sky.addColorStop(0, '#87ceeb');
    sky.addColorStop(1, '#fff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, cam.horizon);

    ctx.fillStyle = '#555';
    ctx.fillRect(0, cam.horizon, W, H - cam.horizon);

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(cam.centerX - 4 * cam.scale, cam.horizon);
    ctx.lineTo(cam.centerX + 4 * cam.scale, cam.horizon);
    ctx.lineTo(cam.centerX + 2 * cam.scale, H);
    ctx.lineTo(cam.centerX - 2 * cam.scale, H);
    ctx.closePath();
    ctx.fill();

    for (let i = -4; i <= 4; i += 2) {
      const scale = cam.scale / (cam.scale + 20);
      const px = cam.centerX + i * scale;
      const py = cam.horizon - 20 * scale;
      const w = 1.5 * scale;
      const h = 15 * scale;
      ctx.fillStyle = '#666';
      ctx.fillRect(px - w/2, py - h, w, h);
    }
  }

  function loop(ts) {
    if (!running) return;
    const dt = ts - lastTime;
    lastTime = ts;

    Player.update();
    Army.update(Player.z);
    Obstacle.updateAll(0.2);
    if (Math.random() < 0.015) Obstacle.spawn(cam);

    if (Army.z >= Player.z - 0.8 || Player.hit(Obstacle.list)) {
      endGame();
      return;
    }

    ctx.clearRect(0, 0, W, H);
    drawCityBG();
    Obstacle.drawAll(ctx, cam);
    Player.draw(ctx, cam);
    Army.draw(ctx, cam);

    distanceSpan.textContent = Army.distanceTo(Player.z);

    requestAnimationFrame(loop);
  }

  startBtn.addEventListener('click', startGame);
  muteBtn.addEventListener('click', AudioManager.toggleMute);

  let touchX = 0;
  canvas.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
  });
  canvas.addEventListener('touchmove', e => {
    if (!running) return;
    const dx = e.touches[0].clientX - touchX;
    if (dx > 40) { Player.lane = 1; touchX = e.touches[0].clientX; }
    if (dx < -40) { Player.lane = -1; touchX = e.touches[0].clientX; }
    e.preventDefault();
  });

  window.addEventListener('keydown', e => {
    if (!running) return;
    if (e.key === 'ArrowLeft') Player.lane = -1;
    if (e.key === 'ArrowRight') Player.lane = 1;
  });
})();
