
let config = {};
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin");
const result = document.getElementById("result");
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
let confettiParticles = [];
let spinning = false;
let angle = 0;

async function loadConfig() {
  const res = await fetch('config.json?_=' + Date.now());
  config = await res.json();
  document.getElementById("title").textContent = config.title;
  drawWheel();
}
function drawWheel() {
  const radius = canvas.width/2;
  const num = config.options.length;
  const arc = (2*Math.PI)/num;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<num;i++){
    const opt = config.options[i];
    const start = i*arc + angle;
    ctx.beginPath();
    ctx.moveTo(radius,radius);
    ctx.arc(radius,radius,radius,start,start+arc);
    ctx.fillStyle = opt.color;
    ctx.fill();
    // Text
    ctx.save();
    ctx.translate(radius,radius);
    ctx.rotate(start+arc/2);
    ctx.textAlign="center";
    ctx.fillStyle="#fff";
    ctx.font="bold 20px Comic Sans MS";
    ctx.fillText(opt.text,radius-60,10);
    ctx.restore();
    // Image
    if(opt.image){
      const img = new Image();
      img.src = opt.image;
      img.onload = ()=>{
        ctx.save();
        ctx.translate(radius,radius);
        ctx.rotate(start+arc/2);
        ctx.drawImage(img,radius-90,-30,50,50);
        ctx.restore();
      }
    }
  }
}
function spinWheel() {
  if(spinning) return;
  spinning = true;
  const spins = Math.floor(Math.random()*5+5);
  const extra = Math.random()*2*Math.PI;
  const total = spins*2*Math.PI + extra;
  const duration = 5000;
  const startTime = performance.now();
  function animate(now){
    const elapsed = now - startTime;
    if(elapsed>=duration){
      angle += total;
      angle %= 2*Math.PI;
      const num = config.options.length;
      const arc = (2*Math.PI)/num;
      const index = Math.floor(num - ((angle%(2*Math.PI)) / arc)) % num;
      result.textContent = "🎉 Ganador: "+config.options[index].text+" 🎉";
      launchConfetti();
      spinning=false;
      return;
    }
    const progress = elapsed/duration;
    const eased = 1 - Math.pow(1-progress,3); // efecto desaceleración
    const current = eased * total;
    ctx.save();
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(current);
    ctx.translate(-canvas.width/2,-canvas.height/2);
    drawWheel();
    ctx.restore();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
spinBtn.addEventListener("click",spinWheel);

function launchConfetti() {
  confettiParticles = [];
  for(let i=0;i<200;i++){
    confettiParticles.push({
      x:Math.random()*confettiCanvas.width,
      y:Math.random()*confettiCanvas.height - confettiCanvas.height,
      r:Math.random()*6+4,
      d:Math.random()*Math.PI*2,
      color:`hsl(${Math.random()*360},100%,50%)`,
      tilt:Math.random()*10-10
    });
  }
  requestAnimationFrame(drawConfetti);
}
function drawConfetti(){
  confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  confettiParticles.forEach(p=>{
    confettiCtx.beginPath();
    confettiCtx.arc(p.x,p.y,p.r,0,2*Math.PI);
    confettiCtx.fillStyle=p.color;
    confettiCtx.fill();
    p.y+=3;
    p.x+=Math.sin(p.d);
    p.tilt += Math.random()*0.1;
    p.d += 0.01;
  });
  confettiParticles = confettiParticles.filter(p=>p.y<confettiCanvas.height+20);
  if(confettiParticles.length>0) requestAnimationFrame(drawConfetti);
}

loadConfig();
