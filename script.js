
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const names = ["Bauti", "Negra"];
const numSegments = names.length;
const angleStep = (2 * Math.PI) / numSegments;
let currentAngle = 0;
let spinning = false;

function drawWheel() {
  const radius = canvas.width / 2;
  for (let i = 0; i < numSegments; i++) {
    const angle = i * angleStep;
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, angle, angle + angleStep);
    ctx.fillStyle = i % 2 === 0 ? "#ffc107" : "#ff5722";
    ctx.fill();
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + angleStep / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(names[i], radius - 10, 10);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning) return;
  spinning = true;
  const spins = Math.floor(Math.random() * 5 + 5);
  const extraAngle = Math.random() * 2 * Math.PI;
  const totalAngle = spins * 2 * Math.PI + extraAngle;
  const duration = 4000;
  const start = performance.now();

  function animate(now) {
    const elapsed = now - start;
    if (elapsed >= duration) {
      currentAngle += totalAngle;
      currentAngle %= 2 * Math.PI;
      const winnerIndex = Math.floor(numSegments - (currentAngle / angleStep)) % numSegments;
      document.getElementById("result").textContent = "¡" + names[winnerIndex] + " se queda con los perros!";
      spinning = false;
      return;
    }
    const progress = elapsed / duration;
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const angle = easedProgress * totalAngle;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawWheel();
    ctx.restore();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

drawWheel();
document.getElementById("spin").addEventListener("click", spinWheel);
