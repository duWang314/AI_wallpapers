const timeEl = document.getElementById("digital-time");
const densityEl = document.getElementById("density");
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
const buttons = document.querySelectorAll(".control-row button");
let stars = [];
let width = 0;
let height = 0;
let effect = "pulse";

function resizeCanvas() {
  const { innerWidth, innerHeight } = window;
  width = innerWidth;
  height = innerHeight;
  canvas.width = width;
  canvas.height = height;
  stars = Array.from({ length: 120 }, () => createStar());
}

function createStar() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.3,
    speed: Math.random() * 0.4 + 0.1,
    alpha: Math.random() * 0.8 + 0.2,
  };
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = "#fff";
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    star.y -= star.speed;
    if (star.y < 0) {
      star.y = height;
      star.x = Math.random() * width;
    }
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawStars);
}

function updateTime() {
  const now = new Date();
  const formatted = now.toLocaleTimeString("zh-CN", { hour12: false });
  timeEl.textContent = formatted;
}

function handlePointer(event) {
  const x = event.clientX / width;
  const y = event.clientY / height;
  document.documentElement.style.setProperty("--pointer-x", x);
  document.documentElement.style.setProperty("--pointer-y", y);
  const density = Math.floor(x * 100 + y * 50);
  densityEl.textContent = density;
}

function setEffect(name) {
  effect = name;
  document.body.classList.remove("is-pulse", "is-orbit", "is-glow");
  document.body.classList.add(`is-${name}`);
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.effect === name);
  });
}

window.addEventListener("resize", () => resizeCanvas());
window.addEventListener("pointermove", handlePointer);

buttons.forEach((button) => {
  button.addEventListener("click", () => setEffect(button.dataset.effect));
});

updateTime();
setInterval(updateTime, 1000);
resizeCanvas();
drawStars();
setEffect(effect);
