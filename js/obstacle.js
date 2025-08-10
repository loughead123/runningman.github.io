const Obstacle = (function () {
  const list = [];

  class Box {
    constructor(x, z) {
      this.x = x; 
      this.z = z;
      this.width = 1.2;
      this.height = 1.2;
      this.depth = 1.2;
    }
    update(speed) {
      this.z += speed;
    }
    draw(ctx, cam) {
      const scale = cam.scale / (cam.scale + this.z);
      const px = cam.centerX + this.x * scale;
      const py = cam.centerY + cam.horizon - this.z * scale;
      const w = this.width * scale;
      const h = this.height * scale;
      ctx.fillStyle = '#444';
      ctx.fillRect(px - w/2, py - h, w, h);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(px - w/2, py, w, 5);
    }
  }

  function spawn(cam) {
    const x = (Math.random() - 0.5) * 6;
    const z = cam.far - 5;
    list.push(new Box(x, z));
  }

  function updateAll(speed) {
    for (let i = list.length - 1; i >= 0; i--) {
      list[i].update(speed);
      if (list[i].z > 30) list.splice(i, 1);
    }
  }

  function drawAll(ctx, cam) {
    list.forEach(o => o.draw(ctx, cam));
  }

  return { list, spawn, updateAll, drawAll };
})();
