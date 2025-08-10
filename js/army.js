const Army = (function () {
  let z = -20;
  let speed = 0.08;

  class Soldier {
    constructor(offsetX) {
      this.x = offsetX;
    }
  }

  const soldiers = [
    new Soldier(-1),
    new Soldier(0),
    new Soldier(1)
  ];

  function update(playerZ) {
    z += speed;
    speed += 0.0001;
  }

  function draw(ctx, cam) {
    soldiers.forEach(s => {
      const scale = cam.scale / (cam.scale + z);
      const px = cam.centerX + s.x * scale;
      const py = cam.centerY + cam.horizon - z * scale;
      const w = 1.2 * scale;
      const h = 2.0 * scale;

      ctx.fillStyle = '#b22222';
      ctx.fillRect(px - w/2, py - h, w, h * 0.6);
      ctx.beginPath();
      ctx.arc(px, py - h, w * 0.3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function distanceTo(playerZ) {
    return Math.max(0, playerZ - z).toFixed(1);
  }

  return { update, draw, distanceTo, get z() { return z; } };
})();
