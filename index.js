Swal.fire({
  title: "Te amo, mi vida 💖",
  text: "Siempre serás mi prioridad, en cada instante, en cada decisión y en cada latido de mi corazón. Porque desde que llegaste, todo cobra sentido. Mi princesa, mi todo.",
  imageUrl: "https://github.com/gonzalezwerner/paratimidoritateamo/raw/cb5307491de937e82669b1857c1137133938fd4c/MIVIDA.jpg",
  imageWidth: 200,
  imageHeight: 200,
  imageAlt: "Imagen de amor"
});

const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frases = [
  "Eres el amor de mi vida, Dorita 💖",
  "Desde que llegaste, todo es mejor 🌅",
  "Mi felicidad empieza contigo 💫",
  "Cada latido grita tu nombre 💓",
  "Tu sonrisa ilumina mi universo ✨",
  "Juntos somos invencibles 💞",
  "Eres mi hogar, mi refugio, mi todo 🏡",
  "Gracias por elegirme cada día 🌹",
  "Contigo aprendí lo que es amar de verdad 💘"
];
let fraseActual = frases[0];
let fraseIndex = 0;
setInterval(() => {
  fraseIndex = (fraseIndex + 1) % frases.length;
  fraseActual = frases[fraseIndex];
}, 2000);

// ❤️ Heart math
function heartCoords(t, scale = 1) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return {
    x: canvas.width / 2 + x * scale,
    y: canvas.height / 2 + y * scale
  };
}

// ❤️ Draw static heart
let heartPath = new Path2D();
function drawStaticHeart() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  heartPath = new Path2D();
  for (let t = 0; t <= Math.PI * 2; t += 0.01) {
    const pos = heartCoords(t, 15);
    if (t === 0) heartPath.moveTo(pos.x, pos.y);
    else heartPath.lineTo(pos.x, pos.y);
  }
  heartPath.closePath();

  ctx.fillStyle = "red";
  ctx.fill(heartPath);

  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Haz clic en el corazón 💖", canvas.width / 2, canvas.height / 2 + 70);
}

drawStaticHeart();

function isClickInsideHeart(x, y) {
  return ctx.isPointInPath(heartPath, x, y);
}

canvas.addEventListener("click", function handleClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (isClickInsideHeart(x, y)) {
    canvas.removeEventListener("click", handleClick);
    audio.play().catch(() => {});
    startAnimation();
  }
});

// 🎵 Music
const audio = new Audio("https://github.com/gonzalezwerner/paratimidoritateamo/raw/refs/heads/main/Axel%20-%20Te%20Voy%20A%20Amar%20(mp3cut.net).mp3");
audio.loop = true;

// 🌟 Animation
function startAnimation() {
  const rand = Math.random;
  const width = canvas.width;
  const height = canvas.height;
  const points = [];
  const dr = 0.1;

  for (let i = 0; i < Math.PI * 2; i += dr) {
    const x = Math.pow(Math.sin(i), 3) * 210;
    const y =
      -(15 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i)) *
      13;
    points.push([x, y]);
  }

  const heartCount = points.length;
  let targets = [];
  function pulse(kx, ky) {
    targets = points.map(([x, y]) => [
      kx * x + width / 2,
      ky * y + height / 2
    ]);
  }

  const e = [];
  for (let i = 0; i < heartCount; i++) {
    const x = rand() * width;
    const y = rand() * height;
    e[i] = {
      vx: 0, vy: 0,
      speed: rand() + 5,
      q: ~~(rand() * heartCount),
      D: 2 * (i % 2) - 1,
      force: 0.2 * rand() + 0.7,
      f: "rgba(255,0,0,0.3)",
      trace: Array.from({ length: 40 }, () => ({ x, y }))
    };
  }

  const floatHearts = [];
  setInterval(() => {
    floatHearts.push({
      x: rand() * width,
      y: height + 10,
      size: rand() * 10 + 5,
      speed: rand() * 1.5 + 0.5,
      opacity: rand() * 0.5 + 0.5
    });
  }, 300);

  let time = 0;
  function loop() {
    const n = -Math.cos(time);
    pulse((1 + n) * 0.5, (1 + n) * 0.5);
    time += 0.01;

    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, width, height);

    for (let u of e) {
      const q = targets[u.q];
      const dx = u.trace[0].x - q[0];
      const dy = u.trace[0].y - q[1];
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 10) {
        if (rand() > 0.95) u.q = ~~(rand() * heartCount);
        else {
          if (rand() > 0.99) u.D *= -1;
          u.q = (u.q + u.D + heartCount) % heartCount;
        }
      }

      u.vx += (-dx / len) * u.speed;
      u.vy += (-dy / len) * u.speed;
      u.trace[0].x += u.vx;
      u.trace[0].y += u.vy;
      u.vx *= u.force;
      u.vy *= u.force;

      for (let k = 0; k < u.trace.length - 1; k++) {
        const T = u.trace[k], N = u.trace[k + 1];
        N.x -= 0.4 * (N.x - T.x);
        N.y -= 0.4 * (N.y - T.y);
      }

      ctx.fillStyle = u.f;
      for (let k = 0; k < u.trace.length; k++) {
        ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
      }
    }

    ctx.font = `bold ${16 + n * 2}px Arial`;
    ctx.textAlign = "center";
    ctx.fillStyle = `hsl(${(time * 100) % 360}, 100%, 70%)`;
    ctx.fillText(fraseActual, width / 2, height / 2);

    ctx.font = "14px Courier New";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText("Con todo mi amor, Alejandro", width / 2, height - 30);

    for (let i = floatHearts.length - 1; i >= 0; i--) {
      const h = floatHearts[i];
      h.y -= h.speed;
      ctx.globalAlpha = h.opacity;
      ctx.fillStyle = "rgba(255,0,0,0.8)";
      ctx.beginPath();
      ctx.moveTo(h.x, h.y);
      ctx.bezierCurveTo(h.x - h.size / 2, h.y - h.size / 2, h.x - h.size, h.y + h.size / 3, h.x, h.y + h.size);
      ctx.bezierCurveTo(h.x + h.size, h.y + h.size / 3, h.x + h.size / 2, h.y - h.size / 2, h.x, h.y);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (h.y + h.size < 0) floatHearts.splice(i, 1);
    }

    requestAnimationFrame(loop);
  }

  loop();
}
