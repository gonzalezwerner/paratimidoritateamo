Swal.fire({
  title: "Te amo, mi vida 💖",
  text: "Siempre serás mi prioridad, en cada instante, en cada decisión y en cada latido de mi corazón. Porque desde que llegaste, todo tiene sentido. Mi princesa, mi todo.",
  imageUrl: "https://github.com/gonzalezwerner/paratimidoritateamo/raw/cb5307491de937e82669b1857c1137133938fd4c/MIVIDA.jpg",
  imageWidth: 200,
  imageHeight: 200,
  imageAlt: "Mi amor"
});

// Ajuste de resolución para que se vea nítido en pantallas retina/móviles
const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;
canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
ctx.scale(dpr, dpr);

// Audio
const audio = new Audio("https://github.com/gonzalezwerner/paratimidoritateamo/raw/refs/heads/main/Axel%20-%20Te%20Voy%20A%20Amar%20(mp3cut.net).mp3");
audio.loop = true;

// Frases
const frases = [
  "Eres el amor de mi vida, Dorita 💖",
  "Desde que llegaste, todo es mejor 🌅",
  "Mi felicidad empieza contigo 💫",
  "Cada latido grita tu nombre 💓",
  "Juntos somos invencibles 💞",
  "Tu sonrisa ilumina mi universo ✨",
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

let heartPath = new Path2D();

// Dibuja corazón estático
function drawStaticHeart() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

  heartPath = new Path2D();
  const scale = 15;
  const centerX = canvas.width / dpr / 2;
  const centerY = canvas.height / dpr / 2;

  for (let t = 0; t <= Math.PI * 2; t += 0.01) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const posX = centerX + x * scale;
    const posY = centerY + y * scale;

    if (t === 0) heartPath.moveTo(posX, posY);
    else heartPath.lineTo(posX, posY);
  }

  heartPath.closePath();
  ctx.fillStyle = "red";
  ctx.fill(heartPath);

  ctx.font = "14px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Toca el corazón 💖", centerX, centerY + 80);
}

function isClickInsideHeart(x, y) {
  return ctx.isPointInPath(heartPath, x, y);
}

drawStaticHeart();

canvas.addEventListener("click", function handleClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left);
  const y = (e.clientY - rect.top);

  if (isClickInsideHeart(x, y)) {
    canvas.removeEventListener("click", handleClick);
    audio.play().catch(() => {});
    startAnimation();
  }
});

function startAnimation() {
  const rand = Math.random;
  const traceCount = 50;
  const dr = 0.1;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;

  const pointsOrigin = [];
  for (let i = 0; i < Math.PI * 2; i += dr) {
    const x = Math.pow(Math.sin(i), 3) * 210;
    const y = -(15 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i)) * 13;
    pointsOrigin.push([x, y]);
  }

  const heartPointsCount = pointsOrigin.length;
  let targetPoints = [];

  function pulse(kx, ky) {
    for (let i = 0; i < pointsOrigin.length; i++) {
      targetPoints[i] = [
        kx * pointsOrigin[i][0] + width / 2,
        ky * pointsOrigin[i][1] + height / 2
      ];
    }
  }

  const e = [];
  for (let i = 0; i < heartPointsCount; i++) {
    const x = rand() * width;
    const y = rand() * height;
    e[i] = {
      vx: 0,
      vy: 0,
      speed: rand() + 5,
      q: ~~(rand() * heartPointsCount),
      D: 2 * (i % 2) - 1,
      force: 0.2 * rand() + 0.7,
      f: "rgba(255,0,0,0.3)",
      trace: Array.from({ length: traceCount }, () => ({ x, y }))
    };
  }

  const floatingHearts = [];
  setInterval(() => {
    floatingHearts.push({
      x: rand() * width,
      y: height + 10,
      size: rand() * 10 + 5,
      speed: rand() * 1.5 + 0.5,
      opacity: rand() * 0.5 + 0.5
    });
  }, 300);

  let time = 0;
  const config = {
    traceK: 0.4,
    timeDelta: 0.01
  };

  function loop() {
    let n = -Math.cos(time);
    pulse((1 + n) * 0.5, (1 + n) * 0.5);
    time += ((Math.sin(time) < 0 ? 9 : n > 0.8 ? 0.2 : 1) * config.timeDelta);

    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, width, height);

    for (let i = e.length; i--;) {
      const u = e[i];
      const q = targetPoints[u.q];
      const dx = u.trace[0].x - q[0];
      const dy = u.trace[0].y - q[1];
      const length = Math.sqrt(dx * dx + dy * dy);

      if (length < 10) {
        if (rand() > 0.95) u.q = ~~(rand() * heartPointsCount);
        else {
          if (rand() > 0.99) u.D *= -1;
          u.q = (u.q + u.D + heartPointsCount) % heartPointsCount;
        }
      }

      u.vx += (-dx / length) * u.speed;
      u.vy += (-dy / length) * u.speed;
      u.trace[0].x += u.vx;
      u.trace[0].y += u.vy;
      u.vx *= u.force;
      u.vy *= u.force;

      for (let k = 0; k < u.trace.length - 1;) {
        const T = u.trace[k];
        const N = u.trace[++k];
        N.x -= config.traceK * (N.x - T.x);
        N.y -= config.traceK * (N.y - T.y);
      }

      ctx.fillStyle = u.f;
      for (let k = 0; k < u.trace.length; k++) {
        ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
      }
    }

    ctx.font = `bold ${20 + n * 4}px Arial`;
    ctx.textAlign = "center";
    ctx.fillStyle = `hsl(${(time * 100) % 360}, 100%, 70%)`;
    ctx.fillText(fraseActual, width / 2, height / 2);

    ctx.font = "12px Courier New";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText("Con todo mi amor, Alejandro", width / 2, height - 20);

    for (let i = floatingHearts.length - 1; i >= 0; i--) {
      const h = floatingHearts[i];
      h.y -= h.speed;
      ctx.globalAlpha = h.opacity;
      ctx.fillStyle = "rgba(255,0,0,0.8)";
      ctx.beginPath();
      ctx.moveTo(h.x, h.y);
      ctx.bezierCurveTo(h.x - h.size / 2, h.y - h.size / 2, h.x - h.size, h.y + h.size / 3, h.x, h.y + h.size);
      ctx.bezierCurveTo(h.x + h.size, h.y + h.size / 3, h.x + h.size / 2, h.y - h.size / 2, h.x, h.y);
      ctx.fill();
      ctx.globalAlpha = 1;

      if (h.y + h.size < 0) floatingHearts.splice(i, 1);
    }

    requestAnimationFrame(loop);
  }

  loop();
}
