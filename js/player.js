const Player = (function () {
  let x = 0;
  let z = 0;
  const laneWidth = 2.5;

  let targetLane = 0;
  let anim = 0;

  function reset() {
    x = 0;
    z = 0;
    targetLane = 0;
    anim = 0;
  }

  function update() {
    const targetX = targetLane * laneWidth;
    x += (targetX - x) * 0.18;
    anim += 0.3;
  }

  function draw(ctx, cam) {
    const scale = cam.scale / (cam.scale + z);
    const px = cam.centerX + x * scale;
    const py = cam.centerY + cam.horizon - z * scale;
    const w = 1.2 * scale;
    const h = 2.2 * scale;

    ctx.fillStyle = '#0066cc';
    ctx.fillRect(px - w/2, py - h, w, h * 0.6);
    ctx.beginPath();
    ctx.arc(px, py - h - w * 0.3, w * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = w * 0.3;
    const leg = Math.sin(anim) * w * 0.5;
    ctx.beginPath();
    ctx.moveTo(px - w * 0.3, py - h * 0.4);
    ctx.lineTo(px - w * 0.3, py + leg);
    ctx.moveTo(px + w * 0.3, py - h * 0.4);
    ctx.lineTo(px + w * 0.3, py - leg);
    ctx.stroke();
  }

  function hit(obstacles) {
    for (const o of obstacles) {
      if (Math.abs(o.x - x) < 1.0 && Math.abs(o.z - z) < 1.2) {
        return true;
      }
    }
    return false;
  }

  return { reset, update, draw, hit, get z() { return z; },
           set lane(l) { targetLane = Math.max(-1, Math.min(1, l)); } };
})();
