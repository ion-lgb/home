const PARTICLE_COUNT = 60;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export function initParticles() {
  const canvas = document.getElementById("heroParticles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: random(0, window.innerWidth),
    y: random(0, window.innerHeight),
    radius: random(1, 3),
    alpha: random(0.3, 0.8),
    speedX: random(-0.2, 0.2),
    speedY: random(-0.15, 0.15)
  }));

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 8);
      gradient.addColorStop(0, `rgba(124, 58, 237, ${p.alpha})`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.radius * 8, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < -50) p.x = window.innerWidth + 50;
      if (p.x > window.innerWidth + 50) p.x = -50;
      if (p.y < -50) p.y = window.innerHeight + 50;
      if (p.y > window.innerHeight + 50) p.y = -50;
    });
    requestAnimationFrame(draw);
  };
  draw();
}
